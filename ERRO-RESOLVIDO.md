# ✅ Como Resolver o Erro "fetch failed"

O erro que você está vendo acontece porque as **variáveis de ambiente do Supabase não estão configuradas**.

## 📝 Passo a Passo para Resolver

### 1️⃣ Configurar o Supabase

1. Acesse https://supabase.com e faça login
2. Clique em **"New Project"** (ou use um existente)
3. Preencha:
   - Nome: `curriculo-generator`
   - Database Password: Escolha uma senha (anote!)
   - Region: South America (São Paulo)
4. Aguarde ~2 minutos até criar

### 2️⃣ Executar o Script SQL

1. No painel do Supabase, vá em **SQL Editor** (menu lateral esquerdo)
2. Clique em **"New query"**
3. Abra o arquivo `supabase-setup.sql` que está na raiz do projeto
4. **Copie TODO o conteúdo**
5. Cole no editor e clique em **"Run"**
6. Deve aparecer: "Success. No rows returned"

### 3️⃣ Copiar as Credenciais

1. No Supabase, vá em **Project Settings** (ícone de engrenagem)
2. Clique em **API**
3. Você verá duas informações importantes:
   - **Project URL** (algo como: `https://abcdefgh.supabase.co`)
   - **anon public** key (uma chave longa)

### 4️⃣ Configurar o .env.local

1. Abra o arquivo `.env.local` que acabei de criar
2. Substitua os valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co  ← Cole sua URL aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1N... ← Cole sua anon key aqui
GEMINI_API_KEY=AIzaSyA... ← Cole sua chave do Gemini aqui
```

### 5️⃣ Obter Chave do Gemini (para IA)

1. Acesse https://aistudio.google.com/app/apikey
2. Faça login com Google
3. Clique em **"Create API Key"**
4. Copie e cole no `.env.local`

### 6️⃣ Reiniciar o Servidor

Depois de configurar o `.env.local`:

```bash
# Se estiver rodando, pare o servidor (Ctrl+C)

# Delete a pasta .next para forçar rebuild
rm -rf .next

# Inicie novamente
npm run dev
```

## 🎯 Verificação Rápida

Depois de configurar, teste:

1. Abra http://localhost:3000
2. **NÃO deve mais aparecer os erros "fetch failed"**
3. Clique em "Entrar" ou "Cadastrar"
4. Tente criar uma conta
5. Se conseguir criar conta = ESTÁ FUNCIONANDO! ✅

## ❌ Se Ainda Der Erro

### Erro persiste?

Verifique:
- ✅ O arquivo `.env.local` está na **raiz do projeto** (mesmo nível que `package.json`)
- ✅ As variáveis estão **sem espaços** antes ou depois do `=`
- ✅ A URL do Supabase está **correta e completa** (com https://)
- ✅ A chave anon está **completa** (é bem longa!)
- ✅ Você **reiniciou o servidor** após criar o `.env.local`

### Ainda não funciona?

Me mande:
1. As primeiras letras da sua URL do Supabase (ex: `https://abc...`)
2. Print do erro que ainda aparece

## 📹 Para o Vídeo

Depois que funcionar:

1. **Teste o fluxo completo**:
   - ✅ Criar conta
   - ✅ Fazer login
   - ✅ Criar currículo
   - ✅ Salvar no banco
   - ✅ Ver vagas
   - ✅ Testar análise de compatibilidade com IA

2. **Se der erro na IA**: Verifique se a `GEMINI_API_KEY` está correta

3. **Dica para gravação**: Feche todas as abas do navegador relacionadas ao projeto antes de gravar para não ter cookies antigos causando problemas

Boa sorte com o vídeo! 🚀
