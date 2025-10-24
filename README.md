# 🎰 Roleta Pro I.A. - Plataforma de Apostas Inteligente

Uma aplicação full-stack moderna para gerenciamento de estratégias de apostas, com chat em tempo real, robô de apostas automatizado e integração com casas de aposta.

## ✨ Características Principais

- **🤖 Robô de Apostas Inteligente** - Automatize suas estratégias de apostas
- **💬 Chat em Tempo Real** - Comunique-se com outros usuários via WebSocket
- **📊 Gerenciamento de Banca** - Controle seu saldo e limites de apostas
- **🎯 Estratégias Personalizadas** - Crie e gerencie suas próprias estratégias
- **👤 Perfil de Usuário** - Edite informações e upload de avatar
- **🛡️ Painel de Administração** - Gerencie usuários e permissões
- **🔐 Autenticação OAuth** - Login seguro via Manus OAuth
- **📱 Responsivo** - Funciona perfeitamente em desktop e mobile

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - UI library moderna
- **Tailwind CSS 4** - Styling utility-first
- **TypeScript** - Type safety
- **tRPC** - Type-safe RPC framework
- **Wouter** - Lightweight router
- **Shadcn/UI** - Componentes reutilizáveis

### Backend
- **Express 4** - Web framework
- **tRPC 11** - Type-safe API
- **Node.js** - Runtime
- **Helmet.js** - Security middleware
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL** - Banco de dados relacional
- **Drizzle ORM** - Type-safe ORM
- **TiDB** - MySQL compatible (recomendado)

### Comunicação em Tempo Real
- **WebSocket** - Chat em tempo real
- **ws** - WebSocket library

### Processamento de Arquivos
- **Multer** - File upload middleware
- **Sharp** - Image processing

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- pnpm 10+
- MySQL 8+ ou TiDB

### Setup Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/roleta-pro-ia.git
cd roleta-pro-ia/roleta-pro-v3

# Instale dependências
pnpm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas configurações

# Execute migrações do banco
pnpm db:push

# Inicie o servidor de desenvolvimento
pnpm dev
```

O aplicativo estará disponível em `http://localhost:5173` (frontend) e `http://localhost:3000` (backend).

## 🚀 Deploy

Veja [DEPLOYMENT.md](./DEPLOYMENT.md) para instruções detalhadas de deploy em:
- **Vercel** (Frontend)
- **Render** (Backend)

## 📁 Estrutura do Projeto

```
roleta-pro-v3/
├── client/                    # Frontend (React)
│   ├── src/
│   │   ├── pages/            # Páginas principais
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── contexts/         # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Utilitários
│   │   ├── App.tsx           # Rotas principais
│   │   └── main.tsx          # Entry point
│   └── public/               # Assets estáticos
├── server/                    # Backend (Express + tRPC)
│   ├── routers/              # tRPC routers
│   │   ├── auth.ts           # Autenticação
│   │   ├── strategies.ts     # Gerenciamento de estratégias
│   │   ├── bankroll.ts       # Gerenciamento de banca
│   │   ├── bets.ts           # Apostas
│   │   ├── chat.ts           # Chat
│   │   ├── profile.ts        # Perfil do usuário
│   │   ├── admin.ts          # Painel admin
│   │   └── bookmaker.ts      # Integração com casas de aposta
│   ├── _core/                # Core utilities
│   │   ├── index.ts          # Server entry point
│   │   ├── context.ts        # tRPC context
│   │   ├── trpc.ts           # tRPC setup
│   │   ├── websocket.ts      # WebSocket server
│   │   ├── fileUpload.ts     # File upload handling
│   │   └── oauth.ts          # OAuth integration
│   └── db.ts                 # Database helpers
├── drizzle/                   # Database schema
│   ├── schema.ts             # Definição das tabelas
│   └── migrations/           # Migrações SQL
├── shared/                    # Código compartilhado
│   ├── types.ts              # Tipos compartilhados
│   └── const.ts              # Constantes
└── package.json              # Dependências
```

## 🔑 Variáveis de Ambiente

```env
# Application
VITE_APP_ID=seu-app-id
VITE_APP_TITLE=Roleta Pro I.A.
VITE_APP_LOGO=seu-logo-url
VITE_APP_URL=https://seu-backend-url.com

# OAuth
VITE_OAUTH_PORTAL_URL=seu-oauth-portal
OAUTH_SERVER_URL=seu-oauth-server
OWNER_OPEN_ID=seu-owner-id
OWNER_NAME=Seu Nome

# Database
DATABASE_URL=mysql://user:password@host:3306/database

# Security
JWT_SECRET=sua-chave-secreta

# Infrastructure
NODE_ENV=production
PORT=3000
```

## 📚 Documentação da API

### Autenticação

```typescript
// Get current user
trpc.auth.me.query()

// Logout
trpc.auth.logout.mutate()
```

### Estratégias

```typescript
// List strategies
trpc.strategies.list.query()

// Create strategy
trpc.strategies.create.mutate({ name, type, config })

// Update strategy
trpc.strategies.update.mutate({ id, ...updates })

// Delete strategy
trpc.strategies.delete.mutate({ id })
```

### Chat

```typescript
// Get messages
trpc.chat.getMessages.query({ limit: 100 })

// Send message
trpc.chat.send.mutate({ message: "Olá!" })

// Delete message
trpc.chat.deleteMessage.mutate({ messageId: 123 })
```

### Perfil

```typescript
// Get profile
trpc.profile.getProfile.query()

// Update profile
trpc.profile.updateProfile.mutate({ name, email, avatarUrl })

// Delete avatar
trpc.profile.deleteAvatar.mutate()
```

### Casas de Aposta

```typescript
// Get available providers
trpc.bookmaker.getAvailableProviders.query()

// Configure provider
trpc.bookmaker.configureProvider.mutate({ providerId, apiKey, baseUrl })

// Get balance
trpc.bookmaker.getBalance.query({ providerId })

// Get odds
trpc.bookmaker.getOdds.query({ providerId, eventType })

// Place bet
trpc.bookmaker.placeBet.mutate({ providerId, eventId, oddId, amount })
```

## 🎯 Funcionalidades Implementadas

### ✅ Completas

- [x] Landing page
- [x] Dashboard com estatísticas
- [x] Robô de apostas (simulação)
- [x] Gerenciamento de estratégias (CRUD)
- [x] Gerenciamento de banca
- [x] Chat com moderação
- [x] Perfil de usuário
- [x] Painel de administração
- [x] Sistema de permissões (3 níveis)
- [x] Autenticação OAuth
- [x] Upload de avatar
- [x] WebSocket para chat em tempo real
- [x] Integração com casas de aposta (abstração)
- [x] Segurança (Helmet, CORS)

### ⏳ Planejadas

- [ ] Testes automatizados (Unit, Integration, E2E)
- [ ] Documentação completa (OpenAPI/Swagger)
- [ ] Rate limiting nas APIs
- [ ] Sanitização de HTML no chat
- [ ] Validação avançada de input
- [ ] Cache no frontend
- [ ] Otimização de queries
- [ ] Paginação nas listas
- [ ] Integração real com casas de aposta
- [ ] Autenticação de dois fatores (2FA)

## 🔐 Sistema de Permissões

### 👑 Admin
- Acesso total ao painel de administração
- Pode promover/remover sub-admins
- Pode moderar chat
- Pode gerenciar usuários

### 🔐 Sub-Admin
- Pode moderar chat
- Pode gerenciar usuários
- **Não pode** promover/remover admins

### 👤 Usuário
- Acesso básico ao sistema
- Pode usar robô de apostas
- Pode gerenciar suas estratégias
- Pode participar do chat

## 🧪 Desenvolvimento

### Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Produção
pnpm start

# Type checking
pnpm check

# Formatação
pnpm format

# Testes
pnpm test

# Migrações do banco
pnpm db:push
```

### Adicionando Novas Funcionalidades

1. **Criar novo router** em `server/routers/`
2. **Definir schema** em `drizzle/schema.ts` (se necessário)
3. **Adicionar ao appRouter** em `server/routers.ts`
4. **Criar página** em `client/src/pages/` (se necessário)
5. **Usar tRPC** no frontend com `trpc.seu-router.seu-metodo`

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Erro: "Database connection failed"

- Verifique `DATABASE_URL`
- Confirme que o MySQL está rodando
- Verifique credenciais de acesso

### Erro: "OAuth failed"

- Verifique `VITE_APP_ID` e `OAUTH_SERVER_URL`
- Confirme que as URLs estão corretas
- Verifique callback URLs

## 📊 Performance

- Frontend otimizado com lazy loading
- Backend com middlewares de compressão
- Database com índices nas colunas principais
- WebSocket com heartbeat para detectar desconexões
- Imagens processadas e comprimidas com Sharp

## 🔒 Segurança

- ✅ Helmet.js para proteção de headers
- ✅ CORS configurado com whitelist
- ✅ JWT para autenticação
- ✅ Validação de input com Zod
- ✅ Proteção contra XSS
- ✅ Proteção contra CSRF
- ✅ Rate limiting (recomendado em produção)

## 📝 Licença

MIT License - veja [LICENSE](./LICENSE) para detalhes

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do chat do aplicativo.

## 🙏 Agradecimentos

- Manus por fornecer a plataforma de desenvolvimento
- Comunidade open-source por ferramentas incríveis
- Todos os contribuidores

---

**Desenvolvido com ❤️ em 2025**

**Status:** Pronto para Deploy ✅

**Última Atualização:** 24 de Outubro de 2025

