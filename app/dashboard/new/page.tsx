"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { CurriculumForm } from "@/components/curriculum-form";
import { curriculumToDb } from "@/types/curriculum";
import type { CurriculumData } from "@/types/curriculum";

export default function NewCurriculumPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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