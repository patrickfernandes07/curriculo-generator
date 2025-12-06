import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { dbToCurriculum } from "@/types/curriculum";
import { PreviewCurriculum } from "@/components/preview-curriculum";

export default async function PreviewCurriculumPage({
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

  return <PreviewCurriculum data={curriculumData} />;
}