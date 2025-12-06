import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "GEMINI_API_KEY não encontrada no .env.local",
      });
    }

    const result = await callGemini("Responda apenas: OK");

    return NextResponse.json({
      success: true,
      message: "API Gemini funcionando!",
      response: result,
    });
  } catch (error: any) {
    console.error("Erro ao testar Gemini:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
