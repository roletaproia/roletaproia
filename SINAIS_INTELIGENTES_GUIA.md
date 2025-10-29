# 🤖 Sinais Inteligentes - Guia Completo

## 📋 Visão Geral

O sistema de **Sinais Inteligentes** permite que você (admin) capture números da roleta 1win automaticamente e transmita para todos os usuários da plataforma em tempo real, junto com recomendações de apostas geradas por Inteligência Artificial.

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────┐
│  SEU COMPUTADOR/SERVIDOR                        │
│  ┌───────────────────────────────────────────┐ │
│  │ Script Puppeteer (capture-roulette.ts)    │ │
│  │ - Abre navegador automaticamente          │ │
│  │ - Monitora roleta 1win                    │ │
│  │ - Detecta números automaticamente         │ │
│  └───────────────────────────────────────────┘ │
│              ↓ HTTP POST (tRPC)                 │
└─────────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────┐
│  BACKEND (Roleta Pro I.A. - Render.com)         │
│  ┌───────────────────────────────────────────┐ │
│  │ Router signals.ts                         │ │
│  │ - Recebe número do Puppeteer              │ │
│  │ - Armazena no banco de dados              │ │
│  │ - Gera recomendação com I.A.              │ │
│  │ - Disponibiliza via tRPC                  │ │
│  └───────────────────────────────────────────┘ │
│              ↓ tRPC Polling (2s)                │
└─────────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────┐
│  FRONTEND (Usuários)                            │
│  ┌───────────────────────────────────────────┐ │
│  │ Página /live-signals                      │ │
│  │ - Atualiza a cada 2 segundos              │ │
│  │ - Mostra número atual e anterior          │ │
│  │ - Exibe recomendação da I.A.              │ │
│  │ - Histórico e estatísticas                │ │
│  └───────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Instalação e Configuração

### **Passo 1: Aplicar Migration no Banco de Dados**

Antes de usar o sistema, você precisa criar as tabelas no banco de dados.

1. Acesse o **TiDB Cloud Console**: https://tidbcloud.com
2. Vá em seu cluster → **SQL Editor**
3. Execute o SQL do arquivo: `/migrations/002_add_live_signals_system.sql`

```sql
-- Copie e cole o conteúdo do arquivo 002_add_live_signals_system.sql
-- Ele criará as tabelas: signals, recommendations, captureSessions
```

### **Passo 2: Instalar Dependências do Script**

No seu computador/servidor onde rodará o script de captura:

```bash
cd /caminho/para/roletaproia
npm install puppeteer dotenv
```

### **Passo 3: Configurar Variáveis de Ambiente**

Crie/edite o arquivo `.env` na raiz do projeto:

```env
# URL da roleta 1win (ajuste conforme necessário)
ROULETTE_URL=https://1wyvrz.life/

# URL do backend (produção)
BACKEND_URL=https://roletaproia.onrender.com

# Token JWT do admin (obtenha fazendo login como admin)
ADMIN_AUTH_TOKEN=seu_token_jwt_aqui

# Modo headless (true = sem interface, false = com interface)
HEADLESS=false
```

**Como obter o ADMIN_AUTH_TOKEN:**

1. Faça login na plataforma como admin
2. Abra o Console do navegador (F12)
3. Vá em **Application** → **Local Storage** → `https://roletaproia.onrender.com`
4. Copie o valor de `auth_token` ou `jwt_token`
5. Cole no `.env` como `ADMIN_AUTH_TOKEN`

### **Passo 4: Executar o Script de Captura**

```bash
npx tsx scripts/capture-roulette.ts
```

**O que acontece:**

1. ✅ Script inicia sessão de captura no backend
2. ✅ Abre navegador Chrome automaticamente
3. ✅ Navega para a 1win
4. ⏸️ **AGUARDA 30 SEGUNDOS** para você fazer login manualmente
5. ✅ Você deve navegar até a **Roleta Brasileira**
6. ✅ Script começa a monitorar números automaticamente
7. ✅ Cada número detectado é enviado para o backend
8. ✅ Backend gera recomendação e disponibiliza para usuários

---

## 📊 Como os Usuários Veem os Sinais

1. Usuário acessa a plataforma: `https://roletaproia.onrender.com`
2. Clica em **"Sinais Inteligentes"** no menu lateral
3. Vê a página `/live-signals` com:
   - 📊 Resultado anterior
   - 🎯 Resultado atual (atualiza a cada 2 segundos)
   - 🔮 Próxima recomendação da I.A. (cor, confiança %, valor sugerido)
   - 📈 Histórico dos últimos 10 números
   - 📊 Estatísticas de performance (winrate, lucro estimado, sequência)

---

## 🤖 Como Funciona a Recomendação da I.A.

Atualmente, a I.A. usa a estratégia **"Equalização de Cores"**:

1. Analisa os últimos 10 números
2. Conta quantos foram **vermelhos** e quantos foram **pretos**
3. Recomenda apostar na cor que saiu **menos vezes** (tendência de equalização)
4. Calcula confiança baseada na diferença:
   - Diferença grande = confiança alta
   - Diferença pequena = confiança baixa

**Exemplo:**
- Últimos 10: 7 vermelhos, 3 pretos
- Recomendação: **Aposte em PRETO**
- Confiança: **70%**

**Futuras melhorias:**
- Martingale automático
- Fibonacci
- Análise de padrões avançados
- Machine Learning

---

## 🔧 Solução de Problemas

### **Erro: "ADMIN_AUTH_TOKEN não configurado"**

**Solução:** Configure o token JWT no arquivo `.env` conforme Passo 3.

---

### **Erro: "Falha ao iniciar sessão de captura"**

**Possíveis causas:**
1. Backend não está rodando
2. Token JWT inválido ou expirado
3. Usuário não é admin

**Solução:**
1. Verifique se o backend está online: `https://roletaproia.onrender.com`
2. Faça login novamente e obtenha novo token JWT
3. Verifique se seu usuário tem `role: "admin"` no banco

---

### **Script não detecta números**

**Possíveis causas:**
1. Seletores CSS da 1win mudaram
2. Você não navegou até a roleta
3. Iframe da Evolution Gaming bloqueou acesso

**Solução:**
1. Abra o navegador em modo **não-headless** (`HEADLESS=false`)
2. Inspecione a página da roleta e encontre o seletor correto do número
3. Edite `scripts/capture-roulette.ts` e atualize os seletores:

```typescript
const selectors = [
  '.seu-novo-seletor-aqui',  // Adicione aqui
  '.roulette-result__number',
  '.last-result',
  // ...
];
```

---

### **Usuários não veem sinais atualizando**

**Possíveis causas:**
1. Script de captura não está rodando
2. Backend não está recebendo sinais
3. Frontend não está fazendo polling

**Solução:**
1. Verifique se o script está rodando: `npx tsx scripts/capture-roulette.ts`
2. Verifique logs do backend no Render.com
3. Abra Console do navegador (F12) e veja se há erros de rede

---

## 📱 Recursos da Interface

### **Indicador "AO VIVO"**
- 🔴 Vermelho piscando = Conectado e recebendo sinais
- ⚪ Branco = Aguardando primeiro sinal

### **Resultado Anterior**
- Mostra o número que saiu antes do atual
- Exibe cor (vermelho/preto/verde)
- Mostra há quanto tempo saiu

### **Resultado Atual**
- Número que acabou de sair
- Destaque visual maior
- Badge "Agora mesmo"

### **Recomendação da I.A.**
- Tipo de aposta (VERMELHO, PRETO, etc.)
- Confiança da I.A. (0-100%)
- Valor sugerido (R$)
- Estratégia usada

### **Histórico**
- Últimos 10 números em círculos coloridos
- Clique para ver detalhes (futuro)

### **Estatísticas**
- ✅ Acertos e ❌ Erros
- 💰 Lucro estimado
- 🎯 Taxa de acerto (winrate)
- 🔥 Sequência atual (wins/losses)
- 📡 Total de sinais recebidos

---

## 🔐 Segurança

### **Autenticação**
- Apenas admins podem enviar sinais
- Token JWT obrigatório
- Sessões de captura rastreadas

### **Rate Limiting**
- Backend pode limitar requisições por IP
- Evita spam de sinais falsos

### **Validação**
- Números validados (0-36)
- Timestamps verificados
- Sessões controladas

---

## 🚀 Rodando 24/7

### **Opção 1: Sua Máquina Local**
- ✅ Grátis
- ❌ Precisa ficar ligado 24/7
- ❌ Não é escalável

**Como fazer:**
```bash
# Linux/Mac
nohup npx tsx scripts/capture-roulette.ts > capture.log 2>&1 &

# Windows
start /B npx tsx scripts/capture-roulette.ts
```

### **Opção 2: VPS (Recomendado)**
- ✅ Roda 24/7 automaticamente
- ✅ IP dedicado
- ✅ Mais estável
- ❌ Custo ~$5-10/mês

**Provedores recomendados:**
- DigitalOcean
- Vultr
- Linode
- Hetzner

**Setup no VPS:**
```bash
# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clonar projeto
git clone https://github.com/seu-usuario/roletaproia.git
cd roletaproia

# Instalar dependências
npm install

# Configurar .env
nano .env

# Rodar com PM2 (gerenciador de processos)
npm install -g pm2
pm2 start scripts/capture-roulette.ts --interpreter=npx --interpreter-args="tsx"
pm2 save
pm2 startup
```

### **Opção 3: Render.com (Experimental)**
- ✅ Grátis (com limitações)
- ❌ Pode hibernar após 15min inativo
- ❌ Render bloqueia Puppeteer em alguns casos

---

## 📈 Próximos Passos

### **Melhorias Futuras:**

1. **WebSocket Real-Time**
   - Substituir polling por WebSocket
   - Latência menor (< 100ms)
   - Menos carga no servidor

2. **Estratégias Avançadas**
   - Martingale automático
   - Fibonacci
   - D'Alembert
   - Machine Learning

3. **Múltiplas Mesas**
   - Capturar de várias roletas simultaneamente
   - Usuário escolhe qual mesa seguir

4. **Notificações Push**
   - Alertas quando novo número sai
   - Notificações de alta confiança

5. **Histórico Completo**
   - Gráficos de tendências
   - Análise de padrões
   - Exportar dados

6. **Modo Automático**
   - Executar apostas automaticamente (via API da casa)
   - Gerenciamento de banca automático
   - Stop loss/win automático

---

## 📞 Suporte

Se tiver problemas, verifique:

1. ✅ Migration aplicada no banco
2. ✅ Dependências instaladas (`puppeteer`, `dotenv`)
3. ✅ Variáveis de ambiente configuradas
4. ✅ Token JWT válido
5. ✅ Backend rodando
6. ✅ Script de captura rodando

---

## ⚠️ Avisos Legais

- Este sistema é apenas para fins educacionais
- Não incentivamos apostas irresponsáveis
- Verifique as leis locais sobre apostas online
- Use com moderação e responsabilidade
- A casa sempre tem vantagem matemática

---

**Desenvolvido com ❤️ para Roleta Pro I.A.**

🎰 Boa sorte e aposte com responsabilidade! 🍀

