import { NextRequest, NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

type ImproveTextType = "summary" | "experience";

interface ImproveTextRequest {
  text: string;
  type: ImproveTextType;
}

interface ErrorWithMessage {
  message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function getErrorMessage(error: unknown): string {
  if (isErrorWithMessage(error)) {
    return error.message;
  }
  return "Erro desconhecido";
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ImproveTextRequest;
    const { text, type } = body;

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

    const cleanText = improvedText.trim().replace(/^["']|["']$/g, "");

    return NextResponse.json({ improvedText: cleanText });
  } catch (error: unknown) {
    console.error("Erro ao melhorar texto:", error);
    return NextResponse.json(
      {
        error: "Erro ao melhorar texto",
        details: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
