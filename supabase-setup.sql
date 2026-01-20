-- =====================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS - CURRÍCULO GENERATOR
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABELA: curriculums
-- =====================================================
CREATE TABLE IF NOT EXISTS public.curriculums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Dados pessoais
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  linkedin TEXT,
  portfolio TEXT,
  summary TEXT NOT NULL,
  photo TEXT,

  -- Dados estruturados (JSON)
  experiences JSONB DEFAULT '[]'::JSONB,
  education JSONB DEFAULT '[]'::JSONB,
  skills JSONB DEFAULT '[]'::JSONB,

  -- Configurações
  template_id TEXT DEFAULT 'default',
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,

  -- Análise de IA
  ai_score NUMERIC(5,2),
  ai_suggestions JSONB,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_curriculums_user_id ON public.curriculums(user_id);
CREATE INDEX IF NOT EXISTS idx_curriculums_share_token ON public.curriculums(share_token);
CREATE INDEX IF NOT EXISTS idx_curriculums_updated_at ON public.curriculums(updated_at DESC);

-- =====================================================
-- TABELA: job_vacancies
-- =====================================================
CREATE TABLE IF NOT EXISTS public.job_vacancies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Informações da vaga
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT,
  type TEXT NOT NULL, -- Ex: CLT, PJ, Estágio, etc.
  contact_email TEXT NOT NULL,

  -- Status
  is_active BOOLEAN DEFAULT true,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_job_vacancies_is_active ON public.job_vacancies(is_active);
CREATE INDEX IF NOT EXISTS idx_job_vacancies_created_at ON public.job_vacancies(created_at DESC);

-- =====================================================
-- FUNÇÃO: Atualizar updated_at automaticamente
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
DROP TRIGGER IF EXISTS set_updated_at_curriculums ON public.curriculums;
CREATE TRIGGER set_updated_at_curriculums
  BEFORE UPDATE ON public.curriculums
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_job_vacancies ON public.job_vacancies;
CREATE TRIGGER set_updated_at_job_vacancies
  BEFORE UPDATE ON public.job_vacancies
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS nas tabelas
ALTER TABLE public.curriculums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_vacancies ENABLE ROW LEVEL SECURITY;

-- Políticas para curriculums
-- Usuários podem ver apenas seus próprios currículos
DROP POLICY IF EXISTS "Users can view own curriculums" ON public.curriculums;
CREATE POLICY "Users can view own curriculums"
  ON public.curriculums
  FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários podem inserir seus próprios currículos
DROP POLICY IF EXISTS "Users can insert own curriculums" ON public.curriculums;
CREATE POLICY "Users can insert own curriculums"
  ON public.curriculums
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem atualizar seus próprios currículos
DROP POLICY IF EXISTS "Users can update own curriculums" ON public.curriculums;
CREATE POLICY "Users can update own curriculums"
  ON public.curriculums
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuários podem deletar seus próprios currículos
DROP POLICY IF EXISTS "Users can delete own curriculums" ON public.curriculums;
CREATE POLICY "Users can delete own curriculums"
  ON public.curriculums
  FOR DELETE
  USING (auth.uid() = user_id);

-- Currículos públicos podem ser vistos por qualquer um (via share_token)
DROP POLICY IF EXISTS "Public curriculums are viewable by share_token" ON public.curriculums;
CREATE POLICY "Public curriculums are viewable by share_token"
  ON public.curriculums
  FOR SELECT
  USING (is_public = true AND share_token IS NOT NULL);

-- Políticas para job_vacancies
-- Todos usuários autenticados podem ver vagas ativas
DROP POLICY IF EXISTS "Authenticated users can view active jobs" ON public.job_vacancies;
CREATE POLICY "Authenticated users can view active jobs"
  ON public.job_vacancies
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND is_active = true);

-- Apenas admins podem inserir vagas (você pode ajustar isso depois)
-- Por enquanto, qualquer usuário autenticado pode inserir (para testes)
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON public.job_vacancies;
CREATE POLICY "Authenticated users can insert jobs"
  ON public.job_vacancies
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- DADOS DE EXEMPLO - VAGAS
-- =====================================================
-- Inserir algumas vagas de exemplo para demonstração

INSERT INTO public.job_vacancies (title, company, description, requirements, location, salary, type, contact_email, is_active)
VALUES
(
  'Desenvolvedor Full Stack',
  'Tech Solutions LTDA',
  'Buscamos desenvolvedor Full Stack para atuar em projetos inovadores usando React, Node.js e PostgreSQL. Ambiente colaborativo e oportunidade de crescimento.',
  '- 2+ anos de experiência com JavaScript/TypeScript
- Conhecimento em React e Next.js
- Experiência com Node.js e APIs REST
- Conhecimento em bancos de dados SQL
- Git e metodologias ágeis',
  'São Paulo, SP (Híbrido)',
  'R$ 6.000 - R$ 9.000',
  'CLT',
  'vagas@techsolutions.com.br',
  true
),
(
  'Analista de Dados Jr',
  'DataCorp Analytics',
  'Oportunidade para analista júnior trabalhar com análise de dados, criação de dashboards e relatórios. Excelente chance para iniciar carreira em dados.',
  '- Conhecimento em SQL
- Excel avançado
- Power BI ou Tableau (diferencial)
- Python básico (diferencial)
- Formação em áreas correlatas',
  'Rio de Janeiro, RJ (Remoto)',
  'R$ 3.500 - R$ 5.000',
  'CLT',
  'rh@datacorp.com.br',
  true
),
(
  'Estágio em Desenvolvimento',
  'StartupXYZ',
  'Vaga de estágio para estudantes de Ciência da Computação, Sistemas de Informação ou áreas afins. Trabalhe com tecnologias modernas em um ambiente dinâmico.',
  '- Cursando Ciência da Computação ou similar
- Conhecimento básico em programação
- Vontade de aprender
- Disponibilidade de 6 horas diárias',
  'Belo Horizonte, MG (Presencial)',
  'R$ 1.500 + Benefícios',
  'Estágio',
  'estagios@startupxyz.com.br',
  true
),
(
  'Engenheiro de Software Sênior',
  'MegaSoft Corporation',
  'Procuramos engenheiro sênior para liderar equipe técnica e arquitetar soluções escaláveis. Projeto de transformação digital em grande empresa.',
  '- 5+ anos de experiência em desenvolvimento
- Experiência com arquitetura de sistemas
- Liderança técnica de equipes
- Cloud (AWS, Azure ou GCP)
- Microserviços e containers',
  'São Paulo, SP (Presencial)',
  'R$ 12.000 - R$ 18.000',
  'CLT',
  'talentos@megasoft.com.br',
  true
);

-- =====================================================
-- FIM DO SCRIPT
-- =====================================================

-- Para verificar se tudo foi criado corretamente:
-- SELECT * FROM public.curriculums LIMIT 1;
-- SELECT * FROM public.job_vacancies LIMIT 1;
