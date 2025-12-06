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
import { ArrowLeft, Briefcase, MapPin, DollarSign, Clock } from "lucide-react";

export default async function VagasPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: vagas, error } = await supabase
    .from("job_vacancies")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Portal de Vagas</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Encontre sua próxima oportunidade 💼
          </h2>
          <p className="text-gray-600">
            Vagas disponíveis na sua região
          </p>
        </div>

        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md mb-6">
            Erro ao carregar vagas: {error.message}
          </div>
        )}

        {vagas && vagas.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma vaga disponível no momento
              </h3>
              <p className="text-gray-600 mb-4">
                Novas oportunidades serão publicadas em breve!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {vagas?.map((vaga) => (
              <Card key={vaga.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {vaga.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {vaga.company}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{vaga.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    
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

                    
                    <div>
                      <h4 className="font-semibold mb-1">Descrição:</h4>
                      <p className="text-gray-700 text-sm">
                        {vaga.description}
                      </p>
                    </div>

                    
                    <div>
                      <h4 className="font-semibold mb-1">Requisitos:</h4>
                      <p className="text-gray-700 text-sm">
                        {vaga.requirements}
                      </p>
                    </div>

                    
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/dashboard/vagas/${vaga.id}`}
                        className="flex-1"
                      >
                        <Button className="w-full">Ver Detalhes</Button>
                      </Link>
                      
                       <a href={`mailto:${vaga.contact_email}?subject=Candidatura para ${vaga.title}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full">
                          Candidatar-se
                        </Button>
                      </a>
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