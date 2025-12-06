import { NextResponse } from "next/server";
import { callGemini } from "@/lib/gemini";

interface SuccessResponse {
  success: true;
  message: string;
  response: string;
}

interface ErrorResponse {
  success: false;
  error: string;
}

type TestResponse = SuccessResponse | ErrorResponse;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Erro desconhecido";
}

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      const response: ErrorResponse = {
        success: false,
        error: "GEMINI_API_KEY não encontrada no .env.local",
      };
      return NextResponse.json(response);
    }

    const result = await callGemini("Responda apenas: OK");

    const response: SuccessResponse = {
      success: true,
      message: "API Gemini funcionando!",
      response: result,
    };

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("Erro ao testar Gemini:", error);

    const response: ErrorResponse = {
      success: false,
      error: getErrorMessage(error),
    };

    return NextResponse.json(response, { status: 500 });
  }
}
