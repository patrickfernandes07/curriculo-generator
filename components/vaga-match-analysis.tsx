"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { dbToCurriculum } from "@/types/curriculum";

interface VagaMatchAnalysisProps {
  vaga: any;
  curriculums: any[];
}

export function VagaMatchAnalysis({
  vaga,
  curriculums,
}: VagaMatchAnalysisProps) {
  const [selectedCurriculumId, setSelectedCurriculumId] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  const analyzeMatch = async () => {
    if (!selectedCurriculumId) {
      alert("Selecione um currículo primeiro!");
      return;
    }

    setAnalyzing(true);

    try {
      const curriculum = curriculums.find((c) => c.id === selectedCurriculumId);
      const curriculumData = dbToCurriculum(curriculum);

      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          curriculum: curriculumData,
          vaga: {
            title: vaga.title,
            description: vaga.description,
            requirements: vaga.requirements,
          },
        }),
      });

      if (!response.ok) throw new Error("Erro ao analisar match");

      const result = await response.json();
      setMatchResult(result);
    } catch (error: any) {
      console.error(error);
      alert("Erro ao analisar compatibilidade: " + error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Análise de Compatibilidade com IA
        </CardTitle>
        <CardDescription>
          Veja o quanto seu currículo combina com esta vaga
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Seletor de currículo */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Selecione um currículo:
          </label>
          <Select
            value={selectedCurriculumId}
            onValueChange={setSelectedCurriculumId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Escolha um currículo..." />
            </SelectTrigger>
            <SelectContent>
              {curriculums.map((curriculum) => (
                <SelectItem key={curriculum.id} value={curriculum.id}>
                  {curriculum.full_name} -{" "}
                  {new Date(curriculum.updated_at).toLocaleDateString("pt-BR")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botão de análise */}
        <Button
          onClick={analyzeMatch}
          disabled={analyzing || !selectedCurriculumId}
          className="w-full"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          {analyzing ? "Analisando..." : "Analisar Compatibilidade"}
        </Button>

        {/* Resultado */}
        {matchResult && (
          <div className="mt-6 space-y-4">
            {/* Score */}
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-5xl font-bold text-purple-600 mb-2">
                {matchResult.score}%
              </div>
              <div className="text-gray-600 font-medium">
                Compatibilidade
              </div>
            </div>

            {/* Habilidades que combinam */}
            {matchResult.matchedSkills &&
              matchResult.matchedSkills.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h4 className="font-semibold mb-2 text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Habilidades que Você Possui ({matchResult.matchedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matchedSkills.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Habilidades faltando */}
            {matchResult.missingSkills &&
              matchResult.missingSkills.length > 0 && (
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <h4 className="font-semibold mb-2 text-orange-700 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Habilidades Desejáveis ({matchResult.missingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missingSkills.map((skill: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Recomendação */}
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Recomendação
              </h4>
              <p className="text-gray-700">{matchResult.recommendation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}