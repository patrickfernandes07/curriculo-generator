# 📘 Guia de Configuração do Supabase

Este guia vai te ajudar a recriar o banco de dados no Supabase para o projeto Currículo Generator.

## 🚀 Passo a Passo

### 1️⃣ Criar Projeto no Supabase

1. Acesse [https://supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: `curriculo-generator` (ou o nome que preferir)
   - **Database Password**: Escolha uma senha forte e **ANOTE**
   - **Region**: Escolha a mais próxima (ex: South America - São Paulo)
5. Clique em **"Create new project"**
6. Aguarde alguns minutos até o projeto ser criado

### 2️⃣ Executar o Script SQL

1. No painel do Supabase, vá em **SQL Editor** (ícone de código no menu lateral)
2. Clique em **"+ New query"**
3. Abra o arquivo `supabase-setup.sql` que está na raiz do projeto
4. **Copie TODO o conteúdo** do arquivo
5. **Cole** no editor SQL do Supabase
6. Clique em **"Run"** (ou pressione Ctrl+Enter)
7. Aguarde a execução - você verá "Success. No rows returned"

### 3️⃣ Verificar se Criou Corretamente

1. Vá em **Table Editor** no menu lateral
2. Você deve ver duas tabelas:
   - ✅ `curriculums`
   - ✅ `job_vacancies`
3. Clique em `job_vacancies` - deve ter **4 vagas de exemplo** já cadastradas

### 4️⃣ Configurar Autenticação

1. Vá em **Authentication** > **Providers**
2. Certifique-se que **Email** está habilitado
3. Em **Auth Settings**, deixe:
   - ✅ Enable email confirmations: **DESABILITADO** (para facilitar testes)
   - ✅ Enable email signups: **HABILITADO**

### 5️⃣ Copiar Credenciais

1. Vá em **Project Settings** (ícone de engrenagem no menu)
2. Clique em **API**
3. Copie os seguintes valores:

   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 6️⃣ Configurar Variáveis de Ambiente

1. Na raiz do projeto, crie o arquivo `.env.local` se não existir
2. Adicione as seguintes variáveis:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# Google Gemini AI
GEMINI_API_KEY=sua-chave-do-gemini-aqui
```

### 7️⃣ Obter Chave da API Gemini (para análise de IA)

1. Acesse [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em **"Create API Key"**
4. Copie a chave e cole no `.env.local` na variável `GEMINI_API_KEY`

### 8️⃣ Testar a Aplicação

1. Instale as dependências (se ainda não fez):
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Abra [http://localhost:3000](http://localhost:3000)

4. **Teste o fluxo completo**:
   - ✅ Criar uma conta (Register)
   - ✅ Fazer login
   - ✅ Criar um novo currículo
   - ✅ Preencher informações
   - ✅ Salvar no banco
   - ✅ Ver vagas disponíveis
   - ✅ Analisar compatibilidade com IA

## 🎬 Preparação para Gravação do Vídeo

### Checklist antes de gravar:

- [ ] Banco de dados criado e funcionando
- [ ] 4 vagas de exemplo aparecendo
- [ ] Consegue criar conta e fazer login
- [ ] Consegue criar e salvar currículo
- [ ] Preview do currículo funciona
- [ ] Exportar PDF funciona
- [ ] Análise de IA com vaga funciona
- [ ] Interface está bonita e responsiva

### Sugestão de Roteiro de Demonstração:

1. **Tela Inicial** (10s)
   - Mostrar landing page
   - Explicar o propósito do projeto

2. **Cadastro/Login** (20s)
   - Criar uma conta rapidamente
   - Fazer login

3. **Criar Currículo** (60s)
   - Preencher dados pessoais
   - Adicionar experiência
   - Adicionar formação
   - Adicionar habilidades
   - Mostrar preview em tempo real

4. **Análise de IA** (30s)
   - Mostrar o score gerado pela IA
   - Mostrar sugestões de melhoria

5. **Salvar e Exportar** (20s)
   - Salvar no banco
   - Exportar PDF

6. **Portal de Vagas** (30s)
   - Navegar pelas vagas
   - Abrir detalhes de uma vaga
   - Fazer análise de compatibilidade com IA
   - Mostrar score de match

7. **Conclusão** (10s)
   - Resumir funcionalidades
   - Tecnologias utilizadas

**Tempo total**: ~3 minutos

## ❓ Problemas Comuns

### "ERROR: relation does not exist"
- Execute novamente o script SQL completo
- Verifique se está usando o projeto correto no Supabase

### "Invalid API key" ou erro 401
- Verifique se copiou as chaves corretas do Supabase
- Certifique-se que o arquivo `.env.local` está na raiz do projeto
- Reinicie o servidor após criar/modificar `.env.local`

### Análise de IA não funciona
- Verifique se a `GEMINI_API_KEY` está correta
- Teste a chave em [https://aistudio.google.com](https://aistudio.google.com)
- Verifique se tem créditos disponíveis na API

### Não consegue fazer login
- Vá em Authentication > Providers e habilite Email
- Desabilite "Enable email confirmations" para facilitar testes

## 🎉 Pronto!

Agora seu projeto está configurado e pronto para a demonstração. Boa sorte com o vídeo! 🚀

---

**Tecnologias Utilizadas no Projeto:**
- Next.js 16 (React)
- TypeScript
- Supabase (Autenticação + Banco de Dados PostgreSQL)
- Google Gemini AI
- Tailwind CSS
- Radix UI
- PDF Generation (jsPDF + html2canvas)
