import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se já estiver logado, redireciona pro dashboard
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">
          Gerador de Currículo Profissional
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Crie currículos profissionais com análise de IA, templates modernos e
          muito mais. Conecte-se com empresas locais e encontre sua próxima
          oportunidade.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">
              Começar Gratuitamente
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="text-lg px-8">
              Entrar
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-bold text-lg mb-2">Análise com IA</h3>
            <p className="text-gray-600 text-sm">
              Receba sugestões inteligentes para melhorar seu currículo e
              aumentar suas chances
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">💼</div>
            <h3 className="font-bold text-lg mb-2">Portal de Vagas</h3>
            <p className="text-gray-600 text-sm">
              Acesse vagas locais e veja o match automático com seu perfil
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">📄</div>
            <h3 className="font-bold text-lg mb-2">Templates Modernos</h3>
            <p className="text-gray-600 text-sm">
              Escolha entre diversos templates profissionais e personalize
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}