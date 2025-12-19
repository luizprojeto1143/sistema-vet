# Guia de Deploy - VETZ System

Este guia explica como configurar as variáveis de ambiente necessárias para o deploy no Render (Backend) e Vercel (Frontend).

## 1. Backend (Render)

Ao criar o Web Service no Render, configure as seguintes variáveis em **Environment**:

| Variável | Valor Exemplo | Descrição |
| :--- | :--- | :--- |
| `DATABASE_URL` | `file:./dev.db` | Caminho do banco de dados (SQLite). **Atenção:** SQLite perde dados a cada deploy no Render se não usar um disco persistente. Para produção real, use PostgreSQL. |
| `JWT_SECRET` | `sua-chave-secreta-super-segura` | Chave para assinar tokens de login. |
| `PORT` | `4000` | Porta do servidor (Render define isso automaticamente, mas bom ter). |
| `NODE_ENV` | `production` | Define ambiente de produção. |

**Comando de Build:** `npm install && npm run build`
**Comando de Start:** `npm run start:prod`

---

## 2. Frontend (Vercel)

Ao importar o projeto no Vercel, configure as seguintes variáveis em **Environment Variables**:

| Variável | Valor Exemplo | Descrição |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://seu-backend-no-render.onrender.com` | URL do seu backend no Render (sem a barra final `/`). |

**Importante:**
1. Primeiro faça o deploy do **Backend** no Render.
2. Copie a URL gerada pelo Render (ex: `https://vetz-backend.onrender.com`).
3. Cole essa URL na variável `NEXT_PUBLIC_API_URL` no Vercel.
4. Faça o deploy do Frontend.

## 3. Observação sobre Banco de Dados (SQLite)

Como estamos usando SQLite (`file:./dev.db`), o banco de dados é um arquivo local.
- No **Render**, o sistema de arquivos é efêmero. Isso significa que **toda vez que você fizer um novo deploy, o banco de dados será resetado**.
- Para evitar isso no Render, você precisaria adicionar um **Persistent Disk** e configurar o caminho do banco para esse disco, OU migrar para um banco PostgreSQL (recomendado para produção).

Se precisar de ajuda para migrar para PostgreSQL, me avise!
