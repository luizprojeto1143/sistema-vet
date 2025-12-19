# Guia de Deploy - VETZ System

## 🚀 Configuração Final para o Render (Backend)

No painel do Render, ao criar o Web Service:
1.  **Root Directory:** Digite `backend` (Isso é muito importante! Ele precisa saber que o código está nessa pasta).
2.  Vá em **Environment** e adicione estas variáveis exatas:

### Copie e Cole (Modo Texto)

Se o Render tiver a opção "Add from .env" ou para facilitar sua cópia:

```env
DATABASE_URL=postgresql://postgres:lUIZ%401143*@db.wjqiefbuutzacyypagdt.supabase.co:5432/postgres
JWT_SECRET=vetz-super-secret-key-2025
PORT=4000
NODE_ENV=production
MP_ACCESS_TOKEN=TEST-8609600527449758-121908-62372c39d2d0d7837572486bfda9aa4b-547482652
MP_PUBLIC_KEY=TEST-ccdd1ef6-0ca9-4179-b7b2-969ac25aa032
```

> **Nota:** A senha do banco já está formatada corretamente na URL acima (o `@` virou `%40`). Pode copiar sem medo!

---

## 🌐 Configuração para o Vercel (Frontend)

No painel do Vercel, ao importar o projeto:
1.  **Root Directory:** Edite e selecione a pasta `frontend`.
2.  Vá em **Environment Variables** e adicione:

| Key (Nome) | Value (Valor) |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `https://seu-backend-no-render.onrender.com` |

> **Importante:** Substitua o valor acima pela URL real que o Render vai gerar para você após o deploy do backend.

---

## 🛠️ Comandos de Build e Start

**Backend (Render):**
*   **Build Command:** `npm install && npm run build`
*   **Start Command:** `npm run start:prod`

**Frontend (Vercel):**
*   **Framework Preset:** Next.js (Automático)
*   **Build Command:** `next build`
