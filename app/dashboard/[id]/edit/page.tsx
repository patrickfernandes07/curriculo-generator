import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { EditCurriculumForm } from "@/components/edit-curriculum-form";
import { dbToCurriculum } from "@/types/curriculum";

export default async function EditCurriculumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Buscar currículo
  const { data: curriculum, error } = await supabase
    .from("curriculums")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !curriculum) {
    redirect("/dashboard");
  }

  // Converter para formato do formulário
  const curriculumData = dbToCurriculum(curriculum);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Editar Currículo</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <EditCurriculumForm curriculumId={id} initialData={curriculumData} />
      </div>
    </div>
  );
}