# ✅ Checklist de Deploy - Sistema de Sinais Inteligentes

## 📋 Pré-Deploy

### **1. Banco de Dados**
- [ ] Acessar TiDB Cloud Console
- [ ] Executar migration `002_add_live_signals_system.sql`
- [ ] Verificar se tabelas foram criadas:
  - [ ] `signals`
  - [ ] `recommendations`
  - [ ] `captureSessions`

### **2. Backend**
- [ ] Verificar se `server/routers/signals.ts` está criado
- [ ] Verificar se router está registrado em `server/routers.ts`
- [ ] Verificar se schema está atualizado em `drizzle/schema.ts`
- [ ] Testar endpoints localmente (opcional)

### **3. Frontend**
- [ ] Verificar se `client/src/pages/LiveSignals.tsx` está criado
- [ ] Verificar se rota está registrada em `App.tsx`
- [ ] Verificar se link está no menu em `Sidebar.tsx`
- [ ] Testar página localmente (opcional)

### **4. Scripts**
- [ ] Verificar se `scripts/capture-roulette.ts` está criado
- [ ] Verificar se `scripts/test-signals.ts` está criado
- [ ] Instalar dependências: `npm install puppeteer dotenv`

---

## 🚀 Deploy

### **1. Commit e Push**

```bash
git add .
git commit -m "feat: Sistema de Sinais Inteligentes implementado"
git push origin main
```

### **2. Verificar Deploy Automático**

- [ ] Acessar Render.com Dashboard
- [ ] Verificar se deploy foi iniciado automaticamente
- [ ] Aguardar conclusão do deploy (~5-10 minutos)
- [ ] Verificar logs para erros

### **3. Aplicar Migration no Banco**

**Via TiDB Cloud Console:**

1. Acesse: https://tidbcloud.com
2. Selecione seu cluster
3. Vá em **SQL Editor**
4. Copie e cole o conteúdo de `migrations/002_add_live_signals_system.sql`
5. Execute o SQL
6. Verifique se as tabelas foram criadas:

```sql
SHOW TABLES LIKE '%signal%';
SHOW TABLES LIKE '%recommendation%';
SHOW TABLES LIKE '%captureSession%';
```

---

## 🧪 Testes Pós-Deploy

### **1. Testar Backend**

**Verificar se endpoints estão respondendo:**

```bash
# Substitua SEU_TOKEN_JWT pelo token de admin
curl -X POST https://roletaproia.onrender.com/api/trpc/signals.getLatestSignals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"limit": 10}'
```

**Resposta esperada:**
```json
{
  "result": {
    "data": []
  }
}
```

### **2. Testar Frontend**

- [ ] Acessar: https://roletaproia.onrender.com/live-signals
- [ ] Verificar se página carrega sem erros
- [ ] Verificar se mostra "Aguardando sinal ao vivo..."
- [ ] Abrir Console do navegador (F12) e verificar se não há erros

### **3. Testar Envio de Sinais**

**Opção A: Script de Teste (Recomendado)**

1. Configure `.env` local:
```env
BACKEND_URL=https://roletaproia.onrender.com
ADMIN_AUTH_TOKEN=seu_token_jwt_aqui
```

2. Execute:
```bash
npx tsx scripts/test-signals.ts
```

3. Abra `/live-signals` no navegador e veja os sinais aparecendo

**Opção B: Manualmente via cURL**

```bash
# 1. Iniciar sessão
curl -X POST https://roletaproia.onrender.com/api/trpc/signals.startCaptureSession \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT"

# Copie o sessionId retornado

# 2. Enviar número
curl -X POST https://roletaproia.onrender.com/api/trpc/signals.sendSignal \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{"number": 17, "sessionId": "SEU_SESSION_ID"}'

# 3. Verificar se apareceu no frontend
# Abra /live-signals e veja o número 17
```

---

## 🤖 Configurar Captura Automática

### **Opção 1: Rodar Localmente (Teste)**

1. Configure `.env`:
```env
ROULETTE_URL=https://1wyvrz.life/
BACKEND_URL=https://roletaproia.onrender.com
ADMIN_AUTH_TOKEN=seu_token_jwt_aqui
HEADLESS=false
```

2. Execute:
```bash
npx tsx scripts/capture-roulette.ts
```

3. Faça login na 1win manualmente
4. Navegue até a Roleta Brasileira
5. Script começará a capturar automaticamente

### **Opção 2: VPS (Produção 24/7)**

**Recomendado: DigitalOcean, Vultr, Linode**

1. Criar Droplet/VPS (Ubuntu 22.04)
2. Conectar via SSH
3. Instalar Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git
```

4. Clonar projeto:
```bash
git clone https://github.com/seu-usuario/roletaproia.git
cd roletaproia
npm install
```

5. Configurar `.env`:
```bash
nano .env
# Cole as configurações
# Ctrl+X, Y, Enter para salvar
```

6. Instalar PM2:
```bash
npm install -g pm2
```

7. Rodar script com PM2:
```bash
pm2 start scripts/capture-roulette.ts --name roulette-capture --interpreter=npx --interpreter-args="tsx"
pm2 save
pm2 startup
```

8. Verificar logs:
```bash
pm2 logs roulette-capture
```

---

## 📊 Monitoramento

### **1. Verificar Sinais no Banco**

```sql
-- Ver últimos 10 sinais
SELECT * FROM signals ORDER BY timestamp DESC LIMIT 10;

-- Ver recomendações
SELECT * FROM recommendations ORDER BY createdAt DESC LIMIT 10;

-- Ver sessões ativas
SELECT * FROM captureSessions WHERE status = 'active';
```

### **2. Verificar Logs do Backend**

- Acessar Render.com Dashboard
- Ir em **Logs**
- Filtrar por "signals" para ver atividade

### **3. Verificar Estatísticas**

- Acessar `/live-signals` como admin
- Verificar:
  - Total de sinais recebidos
  - Taxa de acerto (winrate)
  - Lucro estimado
  - Sequência atual

---

## 🔧 Troubleshooting

### **Problema: Página /live-signals não carrega**

**Solução:**
1. Verificar se deploy foi concluído
2. Limpar cache do navegador (Ctrl+Shift+R)
3. Verificar Console do navegador para erros
4. Verificar se rota está registrada em `App.tsx`

---

### **Problema: Sinais não aparecem no frontend**

**Solução:**
1. Verificar se script de captura está rodando
2. Verificar logs do backend no Render
3. Verificar se migration foi aplicada no banco
4. Testar endpoint manualmente com cURL

---

### **Problema: Script Puppeteer não detecta números**

**Solução:**
1. Rodar em modo não-headless (`HEADLESS=false`)
2. Verificar se você fez login na 1win
3. Verificar se navegou até a Roleta Brasileira
4. Inspecionar página e atualizar seletores CSS

---

### **Problema: "ADMIN_AUTH_TOKEN inválido"**

**Solução:**
1. Fazer login novamente na plataforma
2. Abrir Console (F12) → Application → Local Storage
3. Copiar novo token JWT
4. Atualizar `.env`

---

## ✅ Checklist Final

- [ ] Migration aplicada no banco
- [ ] Deploy concluído no Render
- [ ] Página `/live-signals` acessível
- [ ] Script de teste executado com sucesso
- [ ] Sinais aparecendo no frontend
- [ ] Estatísticas atualizando
- [ ] Script de captura configurado (local ou VPS)
- [ ] Documentação lida e compreendida

---

## 🎉 Sistema Pronto!

Parabéns! O sistema de **Sinais Inteligentes** está funcionando!

**Próximos passos:**
1. Rodar script de captura 24/7 (VPS recomendado)
2. Monitorar performance e ajustar estratégias
3. Coletar feedback dos usuários
4. Implementar melhorias (WebSocket, ML, etc.)

**Lembre-se:**
- ⚠️ Aposte com responsabilidade
- 📊 Monitore estatísticas regularmente
- 🔧 Mantenha script de captura rodando
- 📱 Teste em diferentes dispositivos

---

**Desenvolvido com ❤️ para Roleta Pro I.A.**

