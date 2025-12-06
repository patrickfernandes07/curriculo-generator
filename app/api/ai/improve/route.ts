import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const { text, type } = await request.json();

    let prompt = "";

    if (type === "summary") {
      prompt = `
Você é um especialista em redação de currículos profissionais.

Melhore o seguinte resumo profissional, tornando-o mais:
- Profissional e objetivo
- Impactante e atrativo para recrutadores
- Claro sobre as competências e experiência
- Conciso (máximo 4-5 linhas)

Resumo original:
${text}

Retorne APENAS o texto melhorado, sem explicações, sem aspas, sem prefixos.
      `;
    } else if (type === "experience") {
      prompt = `
Você é um especialista em redação de currículos profissionais.

Melhore a seguinte descrição de experiência profissional, tornando-a mais:
- Orientada a resultados e conquistas
- Usando verbos de ação no passado
- Destacando responsabilidades e impacto
- Profissional e clara

Descrição original:
${text}

Retorne APENAS o texto melhorado, sem explicações, sem aspas, sem prefixos.
      `;
    }

    const improvedText = await callGemini(prompt);

    // Remover aspas se houver
    const cleanText = improvedText.trim().replace(/^["']|["']$/g, "");

    return NextResponse.json({ improvedText: cleanText });
  } catch (error: any) {
    console.error("Erro ao melhorar texto:", error);
    return NextResponse.json(
      {
        error: "Erro ao melhorar texto",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
