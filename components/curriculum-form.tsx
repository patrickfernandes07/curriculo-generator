"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CurriculumData, curriculumToDb } from "@/types/curriculum";
import { PersonalInfoStep } from "./steps/personal-info";
import { ExperienceStep } from "./steps/experience";
import { EducationStep } from "./steps/education";
import { SkillsStep } from "./steps/skills";
import { CurriculumPreview } from "./curriculum-preview";
import { generatePDF } from "@/lib/pdf-generator";
import { Download, Save, Trash2 } from "lucide-react";

const initialData: CurriculumData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    portfolio: "",
    summary: "",
  },
  experiences: [],
  education: [],
  skills: [],
};

interface Tab {
  value: string;
  label: string;
  icon: string;
}


function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Erro desconhecido";
}

export function CurriculumForm() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [curriculumData, setCurriculumData] = useState<CurriculumData>(initialData);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  
  useEffect(() => {
    const savedData = localStorage.getItem("curriculumData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as CurriculumData;
        setCurriculumData(parsedData);
        setIsSaved(true);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, []);

  
  const saveToLocalStorage = () => {
    localStorage.setItem("curriculumData", JSON.stringify(curriculumData));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  
  const saveToDatabase = async () => {
    setSaving(true);
    
    try {
      const supabase = createClient();
      
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert("Você precisa estar logado para salvar");
        router.push("/login");
        return;
      }

      
      const dbData = curriculumToDb(curriculumData);

      
      const { data, error } = await supabase
        .from("curriculums")
        .insert({
          ...dbData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      alert("Currículo salvo com sucesso!");
      
      
      localStorage.removeItem("curriculumData");
      
      
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar currículo: " + getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  
  const clearData = () => {
    if (confirm("Tem certeza que deseja limpar todos os dados?")) {
      setCurriculumData(initialData);
      localStorage.removeItem("curriculumData");
    }
  };

  
  const handleGeneratePDF = () => {
    generatePDF(
      curriculumData,
      `curriculo-${curriculumData.personalInfo.fullName || "meu"}.pdf`
    );
  };

  const tabs: Tab[] = [
    { value: "personal", label: "Dados Pessoais", icon: "👤" },
    { value: "experience", label: "Experiência", icon: "💼" },
    { value: "education", label: "Formação", icon: "🎓" },
    { value: "skills", label: "Habilidades", icon: "⚡" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Currículo</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para gerar seu currículo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  {tabs.map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-xs sm:text-sm"
                    >
                      <span className="mr-1">{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="personal" className="mt-6">
                  <PersonalInfoStep
                    data={curriculumData.personalInfo}
                    onChange={(data) =>
                      setCurriculumData({
                        ...curriculumData,
                        personalInfo: data,
                      })
                    }
                  />
                </TabsContent>

                <TabsContent value="experience" className="mt-6">
                  <ExperienceStep
                    data={curriculumData.experiences}
                    onChange={(data) =>
                      setCurriculumData({
                        ...curriculumData,
                        experiences: data,
                      })
                    }
                  />
                </TabsContent>

                <TabsContent value="education" className="mt-6">
                  <EducationStep
                    data={curriculumData.education}
                    onChange={(data) =>
                      setCurriculumData({ ...curriculumData, education: data })
                    }
                  />
                </TabsContent>

                <TabsContent value="skills" className="mt-6">
                  <SkillsStep
                    data={curriculumData.skills}
                    onChange={(data) =>
                      setCurriculumData({ ...curriculumData, skills: data })
                    }
                  />
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  onClick={saveToLocalStorage}
                  variant="outline"
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaved ? "Salvo Local!" : "Salvar Local"}
                </Button>
                <Button
                  onClick={clearData}
                  variant="outline"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
                <Button 
                  onClick={saveToDatabase} 
                  className="w-full"
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Salvando..." : "Salvar no Banco"}
                </Button>
                <Button onClick={handleGeneratePDF} variant="secondary" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Preview do Currículo</CardTitle>
              <CardDescription>
                Veja como seu currículo está ficando em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-gray-50">
                <div className="overflow-auto max-h-[800px]">
                  <div className="scale-[0.7] origin-top-left w-[142.857%]">
                    <CurriculumPreview data={curriculumData} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}