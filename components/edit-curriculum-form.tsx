"use client";

import { useState } from "react";
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
import { Download, Save, ArrowLeft, Trash2, Sparkles } from "lucide-react";

interface EditCurriculumFormProps {
  curriculumId: string;
  initialData: CurriculumData;
}

interface Tab {
  value: string;
  label: string;
  icon: string;
}


interface CurriculumAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}


function isValidAnalysis(data: unknown): data is CurriculumAnalysis {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.score === "number" &&
    Array.isArray(obj.strengths) &&
    obj.strengths.every((item) => typeof item === "string") &&
    Array.isArray(obj.weaknesses) &&
    obj.weaknesses.every((item) => typeof item === "string") &&
    Array.isArray(obj.suggestions) &&
    obj.suggestions.every((item) => typeof item === "string")
  );
}


function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Erro desconhecido";
}

export function EditCurriculumForm({
  curriculumId,
  initialData,
}: EditCurriculumFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("personal");
  const [curriculumData, setCurriculumData] = useState<CurriculumData>(initialData);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CurriculumAnalysis | null>(null);

  
  const analyzeCurriculum = async () => {
    setAnalyzing(true);

    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(curriculumData),
      });

      if (!response.ok) throw new Error("Erro ao analisar");

      const result: unknown = await response.json();

      
      if (!isValidAnalysis(result)) {
        throw new Error("Resposta da IA com formato inválido");
      }

      setAnalysis(result);

      
      const supabase = createClient();
      await supabase
        .from("curriculums")
        .update({
          ai_score: result.score,
          ai_suggestions: result,
        })
        .eq("id", curriculumId);

    } catch (error: unknown) {
      console.error(error);
      alert("Erro ao analisar currículo: " + getErrorMessage(error));
    } finally {
      setAnalyzing(false);
    }
  };

  
  const updateCurriculum = async () => {
    setSaving(true);

    try {
      const supabase = createClient();

      
      const dbData = curriculumToDb(curriculumData);

      
      const { error } = await supabase
        .from("curriculums")
        .update({
          ...dbData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", curriculumId);

      if (error) throw error;

      alert("Currículo atualizado com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar currículo: " + getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  
  const deleteCurriculum = async () => {
    if (!confirm("Tem certeza que deseja excluir este currículo?")) {
      return;
    }

    setDeleting(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("curriculums")
        .delete()
        .eq("id", curriculumId);

      if (error) throw error;

      alert("Currículo excluído com sucesso!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir currículo: " + getErrorMessage(error));
      setDeleting(false);
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
    <div>
      <div className="mb-4">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Editar Currículo</CardTitle>
              <CardDescription>
                Atualize as informações do seu currículo
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

              <div className="mt-6 space-y-4">
                {/* Análise com IA */}
                <Button
                  onClick={analyzeCurriculum}
                  variant="secondary"
                  className="w-full"
                  disabled={analyzing}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {analyzing ? "Analisando..." : "Analisar com IA"}
                </Button>

                {/* Resultado da análise */}
                {analysis && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-lg">Análise do Currículo</h3>
                          <div className="text-3xl font-bold text-blue-600">
                            {analysis.score}/100
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-green-700">✓ Pontos Fortes:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {analysis.strengths.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-orange-700">⚠ Pontos a Melhorar:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {analysis.weaknesses.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-2 text-blue-700">💡 Sugestões:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {analysis.suggestions.map((s, i) => (
                              <li key={i}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Botões de ação */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={updateCurriculum}
                    className="flex-1"
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                  <Button
                    onClick={handleGeneratePDF}
                    variant="secondary"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
                
                <Button
                  onClick={deleteCurriculum}
                  variant="destructive"
                  className="w-full"
                  disabled={deleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {deleting ? "Excluindo..." : "Excluir Currículo"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
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