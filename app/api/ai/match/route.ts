import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

interface PersonalInfo {
  fullName: string;
  summary?: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface Experience {
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

interface Education {
  degree: string;
  field: string;
  institution: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
}

interface Skill {
  name: string;
  category: string;
}

interface Curriculum {
  personalInfo: PersonalInfo;
  experiences?: Experience[];
  education?: Education[];
  skills?: Skill[];
}

interface JobPosition {
  title: string;
  description: string;
  requirements: string;
}

interface MatchRequest {
  curriculum: Curriculum;
  vaga: JobPosition;
}

interface MatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

function isValidMatchResult(data: unknown): data is MatchResult {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.score === "number" &&
    Array.isArray(obj.matchedSkills) &&
    obj.matchedSkills.every((item) => typeof item === "string") &&
    Array.isArray(obj.missingSkills) &&
    obj.missingSkills.every((item) => typeof item === "string") &&
    typeof obj.recommendation === "string"
  );
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Erro desconhecido";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MatchRequest;
    const { curriculum, vaga } = body;

    const prompt = `
Você é um especialista em recrutamento e seleção.

Compare o currículo do candidato com a vaga e retorne APENAS um JSON válido (sem markdown) no seguinte formato:

{
  "score": número de 0 a 100 representando a compatibilidade,
  "matchedSkills": ["habilidade1", "habilidade2"],
  "missingSkills": ["habilidade3", "habilidade4"],
  "recommendation": "texto com recomendação se deve ou não se candidatar e por quê"
}

CURRÍCULO:
Nome: ${curriculum.personalInfo.fullName}
Resumo: ${curriculum.personalInfo.summary || "Não informado"}
Experiências: ${JSON.stringify(curriculum.experiences || [])}
Formação: ${JSON.stringify(curriculum.education || [])}
Habilidades: ${JSON.stringify(curriculum.skills || [])}

VAGA:
Título: ${vaga.title}
Descrição: ${vaga.description}
Requisitos: ${vaga.requirements}

Retorne APENAS o JSON, sem texto adicional.
    `;

    const text = await callGemini(prompt);

    const jsonText = text
      .trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Resposta inválida da IA");
    }

    const parsedData: unknown = JSON.parse(jsonMatch[0]);

    if (!isValidMatchResult(parsedData)) {
      console.error("Estrutura do JSON inválida:", parsedData);
      return NextResponse.json(
        { error: "Estrutura do JSON retornado é inválida" },
        { status: 500 }
      );
    }

    const result: MatchResult = parsedData;

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Erro no match:", error);
    return NextResponse.json(
      {
        error: "Erro ao analisar compatibilidade",
        details: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
