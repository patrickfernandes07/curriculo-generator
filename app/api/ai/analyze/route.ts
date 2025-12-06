import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

interface PersonalInfo {
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
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

interface CurriculumAnalysis {
  score: number;
  suggestions: string[];
  strengths: string[];
  weaknesses: string[];
}

function isValidAnalysis(data: unknown): data is CurriculumAnalysis {
  if (typeof data !== "object" || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.score === "number" &&
    Array.isArray(obj.suggestions) &&
    obj.suggestions.every((item) => typeof item === "string") &&
    Array.isArray(obj.strengths) &&
    obj.strengths.every((item) => typeof item === "string") &&
    Array.isArray(obj.weaknesses) &&
    obj.weaknesses.every((item) => typeof item === "string")
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
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Chave da API Gemini não configurada" },
        { status: 500 }
      );
    }

    const curriculum = (await request.json()) as Curriculum;

    if (!curriculum.personalInfo || !curriculum.personalInfo.fullName) {
      return NextResponse.json(
        { error: "Dados do currículo incompletos" },
        { status: 400 }
      );
    }

    const prompt = `
Você é um especialista em análise de currículos e recrutamento.

Analise o seguinte currículo e retorne APENAS um JSON válido (sem markdown, sem explicações, sem texto adicional) no seguinte formato exato:

{
  "score": número de 0 a 100,
  "suggestions": [
    "sugestão 1",
    "sugestão 2",
    "sugestão 3"
  ],
  "strengths": [
    "ponto forte 1",
    "ponto forte 2"
  ],
  "weaknesses": [
    "ponto fraco 1",
    "ponto fraco 2"
  ]
}

Currículo para análise:
Nome: ${curriculum.personalInfo.fullName}
Email: ${curriculum.personalInfo.email || "Não informado"}
Telefone: ${curriculum.personalInfo.phone || "Não informado"}
Localização: ${curriculum.personalInfo.location || "Não informado"}

Resumo Profissional:
${curriculum.personalInfo.summary || "Não informado"}

Experiências Profissionais:
${
  curriculum.experiences && curriculum.experiences.length > 0
    ? curriculum.experiences
        .map(
          (exp: Experience) => `
- ${exp.position} na ${exp.company}
  Período: ${exp.startDate} até ${exp.current ? "Presente" : exp.endDate}
  Descrição: ${exp.description || "Não informada"}
`
        )
        .join("\n")
    : "Nenhuma experiência informada"
}

Formação Acadêmica:
${
  curriculum.education && curriculum.education.length > 0
    ? curriculum.education
        .map(
          (edu: Education) => `
- ${edu.degree} em ${edu.field}
  Instituição: ${edu.institution}
  Período: ${edu.startDate} até ${edu.current ? "Presente" : edu.endDate}
`
        )
        .join("\n")
    : "Nenhuma formação informada"
}

Habilidades:
${
  curriculum.skills && curriculum.skills.length > 0
    ? curriculum.skills
        .map((skill: Skill) => `- ${skill.name} (${skill.category})`)
        .join("\n")
    : "Nenhuma habilidade informada"
}

Critérios de avaliação:
- Clareza e objetividade do resumo profissional
- Qualidade e relevância das experiências
- Descrições de responsabilidades e conquistas
- Formação acadêmica adequada
- Habilidades técnicas e comportamentais
- Formatação e organização geral
- Quantidade de informações (não muito vazio, não muito extenso)

IMPORTANTE: Retorne APENAS o JSON, sem nenhum texto antes, depois ou ao redor. Não use \`\`\`json ou qualquer formatação markdown.
    `;

    console.log("Enviando prompt para Gemini...");

    const text = await callGemini(prompt);

    console.log("Resposta do Gemini:", text);

    let jsonText = text.trim();

    jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");

    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("JSON não encontrado na resposta:", text);
      return NextResponse.json(
        {
          error: "Resposta da IA não contém JSON válido",
          rawResponse: text.substring(0, 200),
        },
        { status: 500 }
      );
    }

    const parsedData: unknown = JSON.parse(jsonMatch[0]);

    if (!isValidAnalysis(parsedData)) {
      console.error("Estrutura do JSON inválida:", parsedData);
      return NextResponse.json(
        { error: "Estrutura do JSON retornado é inválida" },
        { status: 500 }
      );
    }

    const analysis: CurriculumAnalysis = parsedData;

    console.log("Análise concluída com sucesso:", analysis);

    return NextResponse.json(analysis);
  } catch (error: unknown) {
    console.error("Erro na análise:", error);
    return NextResponse.json(
      {
        error: "Erro ao analisar currículo",
        details: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
