# 🚀 Guia de Deploy - Roleta Pro I.A.

Este documento fornece instruções passo a passo para fazer o deploy do projeto em **Vercel** (frontend) e **Render** (backend).

## 📋 Pré-requisitos

- Conta no GitHub (para versionamento)
- Conta no Vercel (https://vercel.com)
- Conta no Render (https://render.com)
- MySQL database (TiDB ou outro provedor compatível)
- Node.js 18+ instalado localmente

## 🔧 Preparação Local

### 1. Instalar Dependências

```bash
cd roleta-pro-v3
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas configurações:

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/database

# OAuth
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=sua-oauth-url
VITE_OAUTH_PORTAL_URL=seu-oauth-portal

# Security
JWT_SECRET=sua-chave-secreta-super-segura

# URLs
VITE_APP_URL=https://seu-backend-url.com
```

### 3. Testar Localmente

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Produção
pnpm start
```

## 📤 Deploy no GitHub

### 1. Criar Repositório

```bash
# Inicializar git
git init
git add .
git commit -m "Initial commit: Roleta Pro I.A. v1.0"

# Criar repositório no GitHub e fazer push
git remote add origin https://github.com/seu-usuario/roleta-pro-ia.git
git branch -M main
git push -u origin main
```

## 🌐 Deploy no Vercel (Frontend)

### 1. Conectar Repositório

1. Acesse https://vercel.com/dashboard
2. Clique em "Add New..." → "Project"
3. Selecione seu repositório GitHub
4. Configure as variáveis de ambiente:

```
VITE_APP_ID=seu-app-id
VITE_OAUTH_PORTAL_URL=seu-oauth-portal
VITE_APP_TITLE=Roleta Pro I.A.
VITE_APP_LOGO=seu-logo-url
VITE_APP_URL=https://seu-backend-render.onrender.com (será ajustado)
```

### 2. Configurar Build

- **Framework**: Other
- **Build Command**: `pnpm build`
- **Output Directory**: `dist/public`
- **Install Command**: `pnpm install`

### 3. Deploy

Clique em "Deploy" e aguarde a conclusão.

## 🎯 Deploy no Render (Backend)

### 1. Conectar Repositório

1. Acesse https://dashboard.render.com
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub

### 2. Configurar Serviço

**Configurações Básicas:**
- **Name**: roleta-pro-backend
- **Environment**: Node
- **Build Command**: `pnpm install && pnpm build`
- **Start Command**: `node dist/index.js`

**Variáveis de Ambiente:**

```
NODE_ENV=production
PORT=3000
DATABASE_URL=sua-database-url
JWT_SECRET=sua-chave-secreta
VITE_APP_ID=seu-app-id
OAUTH_SERVER_URL=seu-oauth-server
VITE_OAUTH_PORTAL_URL=seu-oauth-portal
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=Seu Nome
VITE_APP_TITLE=Roleta Pro I.A.
VITE_APP_LOGO=seu-logo-url
VITE_APP_URL=https://seu-backend-url.onrender.com
BUILT_IN_FORGE_API_URL=https://api.manus.computer
BUILT_IN_FORGE_API_KEY=sua-chave-manus
```

### 3. Deploy

Clique em "Create Web Service" e aguarde a conclusão.

## 🔄 Atualizar URLs Após Deploy

Após o deploy no Render, você receberá uma URL como `https://roleta-pro-backend.onrender.com`.

### Atualizar Vercel

1. Vá para "Settings" → "Environment Variables" no Vercel
2. Atualize `VITE_APP_URL` com a URL do Render
3. Redeploy o projeto

### Atualizar Render (se necessário)

1. Vá para "Settings" → "Environment" no Render
2. Atualize `VITE_APP_URL` com a URL do seu serviço
3. Redeploy o projeto

## 🧪 Testar Deploy

### 1. Verificar Frontend

Acesse a URL do Vercel e verifique:
- [ ] Landing page carrega corretamente
- [ ] Login/OAuth funciona
- [ ] Dashboard carrega após login

### 2. Verificar Backend

```bash
# Testar API
curl https://seu-backend-url.com/api/trpc/auth.me

# Testar WebSocket (se implementado)
wscat -c wss://seu-backend-url.com/ws/chat
```

### 3. Verificar Banco de Dados

- [ ] Usuários são salvos corretamente
- [ ] Estratégias são criadas e recuperadas
- [ ] Chat funciona em tempo real

## 🔐 Segurança em Produção

### 1. Variáveis de Ambiente

- ✅ Nunca commit `.env.local`
- ✅ Use variáveis de ambiente do Vercel/Render
- ✅ Altere `JWT_SECRET` para uma chave forte

### 2. CORS

O CORS está configurado para aceitar apenas a origem do frontend. Verifique:

```typescript
// server/_core/index.ts
const allowedOrigins = [process.env.VITE_APP_URL];
```

### 3. Helmet.js

Proteção contra vulnerabilidades comuns está ativada:
- XSS Protection
- Clickjacking Protection
- HSTS
- Content Security Policy

### 4. Rate Limiting (Recomendado)

Considere adicionar rate limiting para APIs críticas:

```bash
pnpm add express-rate-limit
```

## 📊 Monitoramento

### Vercel

- Dashboard mostra logs de build e runtime
- Alertas automáticos para erros

### Render

- Logs em tempo real disponíveis no dashboard
- Métricas de CPU e memória

## 🆘 Troubleshooting

### Erro: "Cannot find module"

```bash
# Limpar cache e reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build
```

### Erro: "Database connection failed"

- Verifique `DATABASE_URL`
- Confirme que o banco está acessível
- Verifique firewall/whitelist de IPs

### Erro: "OAuth failed"

- Verifique `VITE_APP_ID` e `OAUTH_SERVER_URL`
- Confirme que as URLs estão corretas
- Verifique callback URLs no OAuth provider

### WebSocket não funciona

- Verifique se o Render suporta WebSocket (suporta)
- Verifique logs do servidor
- Teste com `wscat` ou ferramentas similares

## 📚 Recursos Adicionais

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Express Docs](https://expressjs.com)
- [tRPC Docs](https://trpc.io)

## 🎉 Próximos Passos

Após o deploy bem-sucedido:

1. Configurar domínio customizado
2. Implementar CI/CD automático
3. Adicionar testes automatizados
4. Configurar monitoramento e alertas
5. Implementar backup automático do banco

---

**Última Atualização:** 24 de Outubro de 2025
**Status:** Pronto para Deploy ✅

