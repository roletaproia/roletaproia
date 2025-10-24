# 🚀 Instruções de Deploy - Roleta Pro I.A.

## ✅ Status Atual

- ✅ Código no GitHub: https://github.com/roletaproia/roletaproia
- ✅ Banco de Dados TiDB Cloud configurado
- ✅ Migrações aplicadas
- ✅ Sistema de autenticação Email/Senha implementado

## 📋 Variáveis de Ambiente para o Render

### Backend Service

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://2LGcir6VrQMQDuf.root:tOLtIbmzvBuzfFO9@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/roleta_pro?ssl={"rejectUnauthorized":true}
JWT_SECRET=roleta-pro-jwt-secret-production-2024-ultra-secure-key
VITE_APP_TITLE=Roleta Pro I.A.
VITE_APP_URL=https://roletaproia.onrender.com
VITE_APP_LOGO=https://roletaproia.onrender.com/robot-roulette.png
```

### Frontend Service (se separado)

```env
NODE_ENV=production
VITE_APP_TITLE=Roleta Pro I.A.
VITE_APP_URL=https://roletaproia.onrender.com
VITE_APP_LOGO=https://roletaproia.onrender.com/robot-roulette.png
```

## 🔧 Configuração do Render

### Opção 1: Deploy Unificado (Recomendado)

**Nome:** roleta-pro-ia  
**Tipo:** Web Service  
**Repositório:** https://github.com/roletaproia/roletaproia  
**Branch:** main  
**Runtime:** Node  
**Build Command:** `pnpm install && pnpm build`  
**Start Command:** `pnpm start`  

### Opção 2: Deploy Separado

#### Backend
**Nome:** roleta-pro-backend  
**Build Command:** `pnpm install && pnpm build`  
**Start Command:** `node dist/index.js`  

#### Frontend  
**Nome:** roleta-pro-frontend  
**Build Command:** `pnpm install && pnpm build`  
**Start Command:** `pnpm start`  
**Static Publish Path:** `dist/public`  

## 🎯 Próximos Passos

1. Acessar https://dashboard.render.com
2. Criar novo Web Service
3. Conectar ao repositório GitHub
4. Configurar variáveis de ambiente
5. Deploy!

## 🔐 Primeiro Usuário Admin

Após o deploy, criar o primeiro usuário admin diretamente no banco de dados:

```sql
INSERT INTO users (name, email, password, role) 
VALUES ('Admin', 'admin@roletapro.com', '$2b$10$HASH_AQUI', 'admin');
```

Ou usar o endpoint de registro e depois atualizar o role manualmente.

