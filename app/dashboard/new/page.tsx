"use client";

import { useRouter } from "next/navigation";
import { CurriculumForm } from "@/components/curriculum-form";

export default function NewCurriculumPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </button>
            <h1 className="text-2xl font-bold">Novo Currículo</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <CurriculumFormWrapper />
      </div>
    </div>
  );
}

function CurriculumFormWrapper() {
  return <CurriculumForm />;
}