import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { curriculum, vaga } = await request.json();

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
Resumo: ${curriculum.personalInfo.summary}
Experiências: ${JSON.stringify(curriculum.experiences)}
Formação: ${JSON.stringify(curriculum.education)}
Habilidades: ${JSON.stringify(curriculum.skills)}

VAGA:
Título: ${vaga.title}
Descrição: ${vaga.description}
Requisitos: ${vaga.requirements}

Retorne APENAS o JSON, sem texto adicional.
    `;

    const text = await callGemini(prompt);

    // Extrair JSON
    let jsonText = text
      .trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "");
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("Resposta inválida da IA");
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Erro no match:", error);
    return NextResponse.json(
      {
        error: "Erro ao analisar compatibilidade",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
