import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, FileText, Briefcase } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: curriculums, error } = await supabase
    .from("curriculums")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Meus Currículos</h1>
          <div className="flex gap-2">
            <Link href="/dashboard/vagas">
              <Button variant="outline">
                <Briefcase className="w-4 h-4 mr-2" />
                Vagas
              </Button>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Olá, {user.user_metadata?.name || user.email}! 👋
          </h2>
          <p className="text-gray-600">
            Gerencie seus currículos e encontre oportunidades
          </p>
        </div>

        
        <div className="mb-6">
          <Link href="/dashboard/new">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Criar Novo Currículo
            </Button>
          </Link>
        </div>

        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md mb-6">
            Erro ao carregar currículos: {error.message}
          </div>
        )}

        {curriculums && curriculums.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum currículo ainda
              </h3>
              <p className="text-gray-600 mb-4">
                Crie seu primeiro currículo profissional agora!
              </p>
              <Link href="/dashboard/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Currículo
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculums?.map((curriculum) => (
              <Card key={curriculum.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {curriculum.full_name}
                  </CardTitle>
                  <CardDescription>
                    Atualizado em{" "}
                    {new Date(curriculum.updated_at).toLocaleDateString("pt-BR")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {curriculum.ai_score && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Score IA:</span>
                        <span className="text-lg font-bold text-primary">
                          {curriculum.ai_score}/100
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Link href={`/dashboard/${curriculum.id}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          Editar
                        </Button>
                      </Link>
                      <Link href={`/dashboard/${curriculum.id}/preview`} className="flex-1">
                        <Button className="w-full">Ver/Baixar</Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}