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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, DollarSign, Clock, Building2 } from "lucide-react";
import { VagaMatchAnalysis } from "@/components/vaga-match-analysis";

export default async function VagaDetalhesPage({
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

  const { data: vaga, error } = await supabase
    .from("job_vacancies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !vaga) {
    redirect("/dashboard/vagas");
  }

  const { data: curriculums } = await supabase
    .from("curriculums")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/vagas">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Detalhes da Vaga</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{vaga.title}</CardTitle>
                <CardDescription className="text-lg flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {vaga.company}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-base px-4 py-2">
                {vaga.type}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{vaga.location}</span>
              </div>
              {vaga.salary && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{vaga.salary}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  Publicado em{" "}
                  {new Date(vaga.created_at).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            
            <div>
              <h3 className="font-bold text-lg mb-2">Descrição da Vaga</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {vaga.description}
              </p>
            </div>

            
            <div>
              <h3 className="font-bold text-lg mb-2">Requisitos</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {vaga.requirements}
              </p>
            </div>

            
            <div className="pt-4">
              
                <a href={`mailto:${vaga.contact_email}?subject=Candidatura para ${vaga.title}&body=Olá,%0D%0A%0D%0AGostaria de me candidatar para a vaga de ${vaga.title}.%0D%0A%0D%0AAtenciosamente.`}
                className="block"
              >
                <Button size="lg" className="w-full">
                  Candidatar-se por Email
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        
        {curriculums && curriculums.length > 0 && (
          <VagaMatchAnalysis vaga={vaga} curriculums={curriculums} />
        )}
      </div>
    </div>
  );
}