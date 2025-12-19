# Guia de Configuração - Supabase (PostgreSQL)

Você escolheu usar o **Supabase**! Ótima escolha. Ele vai garantir que seus dados fiquem salvos para sempre.

## Passo 1: Criar o Banco de Dados

1.  Acesse [supabase.com](https://supabase.com) e clique em **"Start your project"**.
2.  Faça login (pode usar o GitHub).
3.  Clique em **"New Project"**.
4.  Preencha:
    *   **Name:** `vetz-system` (ou o que preferir).
    *   **Database Password:** Crie uma senha forte e **GUARDE ELA** (você vai precisar já já).
    *   **Region:** Escolha `Sao Paulo` (South America) para ficar rápido.
5.  Clique em **"Create new project"**.

## Passo 2: Pegar a URL de Conexão

1.  Espere o projeto terminar de criar (leva uns minutos).
2.  No menu lateral, clique em **Project Settings** (ícone de engrenagem ⚙️).
3.  Vá em **Database**.
4.  Role até a seção **Connection String**.
5.  Clique na aba **URI**.
6.  Copie a URL que aparece. Ela se parece com isso:
    `postgresql://postgres.xxyyzz:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`

## Passo 3: Configurar no Render (Backend)

1.  Vá no seu painel do **Render**.
2.  Entre no seu serviço do Backend.
3.  Vá em **Environment**.
4.  Edite a variável `DATABASE_URL`.
5.  Cole a URL que você copiou do Supabase.
6.  **IMPORTANTE:** Substitua `[YOUR-PASSWORD]` pela senha que você criou no Passo 1.
    *   Exemplo final: `postgresql://postgres.abcd:minhasenha123@aws...`

## Passo 4: Configurar no Computador (Opcional)

Se quiser rodar o projeto no seu computador usando o banco do Supabase:
1.  Abra o arquivo `.env` na pasta `backend`.
2.  Mude `DATABASE_URL` para a URL do Supabase.
3.  Rode `npx prisma db push` para criar as tabelas no Supabase.

Pronto! Agora seu sistema VETZ está rodando com um banco de dados profissional na nuvem. 🚀
