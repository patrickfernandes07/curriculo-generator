"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CurriculumPreview } from "./curriculum-preview";
import { generatePDF } from "@/lib/pdf-generator";
import { CurriculumData } from "@/types/curriculum";
import { Download, ArrowLeft } from "lucide-react";

interface PreviewCurriculumProps {
  data: CurriculumData;
}

export function PreviewCurriculum({ data }: PreviewCurriculumProps) {
  const router = useRouter();

  const handleGeneratePDF = () => {
    generatePDF(
      data,
      `curriculo-${data.personalInfo.fullName || "meu"}.pdf`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold">Preview do Currículo</h1>
          </div>
          <Button onClick={handleGeneratePDF}>
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="shadow-2xl">
          <CurriculumPreview data={data} />
        </div>
      </div>
    </div>
  );
}