# 🔧 Troubleshooting - RoletaPro I.A.

## Problema: Componente antigo ainda aparece após deploy

### Sintomas
- ❌ Aparece apenas 1 card de recomendação (não as 3 opções)
- ❌ Banner grande no mobile
- ❌ Cor indefinida (círculo cinza)

### Causa Raiz
O Render estava fazendo cache agressivo do build do frontend, mantendo o componente antigo mesmo após deletar o arquivo.

### Solução Aplicada

#### 1. Deletar arquivo antigo
```bash
rm -f client/src/components/AIRecommendation.tsx
```

#### 2. Limpar cache local
```bash
rm -rf client/node_modules/.vite client/dist
```

#### 3. Forçar rebuild
```bash
echo "force rebuild $(date)" > .rebuild
```

#### 4. Commit e push
```bash
git add -A
git commit -m "fix: remove old AIRecommendation component and render.yaml, force rebuild"
git push origin main
```

#### 5. No Render Dashboard
1. Ir em "Manual Deploy"
2. Clicar em "Clear build cache & deploy"
3. Aguardar 3-5 minutos

### Configuração Correta do Render

**Build Command:**
```bash
pnpm install && pnpm build
```

**Start Command:**
```bash
pnpm start
```

**Environment Variables necessárias:**
- `NODE_ENV=production`
- `DATABASE_URL` (TiDB connection string)
- `JWT_SECRET`
- `VITE_APP_URL` (URL do site)
- `VITE_APP_TITLE=Roleta Pro I.A.`

### Estrutura do Build

O comando `pnpm build` executa:
1. `vite build` → Gera frontend em `dist/public`
2. `esbuild server/_core/index.ts` → Gera backend em `dist/index.js`
3. `tsx run-migration.ts` → Roda migrations do banco

### Verificação

Após deploy, verificar:
- ✅ 3 cards de aposta (Arriscada/Conservadora/Equilibrada)
- ✅ Banner menor no mobile
- ✅ Cores corretas (vermelho/preto, nunca verde para recomendações)
- ✅ Botão 1Win dentro do card "Resultado Atual"

### Se ainda não funcionar

#### Opção 1: Build local e commit do dist
```bash
pnpm build
git add dist -f
git commit -m "chore: add dist folder"
git push origin main
```

#### Opção 2: Verificar logs do Render
1. Ir em "Logs" no dashboard
2. Procurar por erros no build
3. Verificar se o `vite build` foi executado

#### Opção 3: Recriar serviço no Render
1. Deletar serviço atual
2. Criar novo serviço
3. Conectar ao repositório GitHub
4. Configurar build e start commands

### Commits Relacionados
- `3562425` - fix: remove old AIRecommendation component and render.yaml, force rebuild
- `5578c46` - fix: Deletar componente antigo AIRecommendation
- `ccc9b5f` - fix: Reduzir banner 1Win no mobile + Forçar rebuild

### Arquivos Importantes
- `client/src/pages/LiveSignals.tsx` - Usa AIRecommendationMultiple
- `client/src/components/AIRecommendationMultiple.tsx` - Componente com 3 opções
- `package.json` - Configuração de build
- `.rebuild` - Arquivo para forçar rebuild

### Contato
Se o problema persistir, verificar:
1. Logs do Render
2. Console do navegador (F12)
3. Network tab para ver se está carregando arquivos antigos
