# 8 Técnicas Avançadas do Google Search Console

Fonte: https://www.lemonadestand.org/eight-google-search-console-features-you-might-be-missing/

## 1. **Find Long-Tail Keywords with Regex** ⭐⭐⭐
- Usar regex no relatório de Performance para descobrir long-tail keywords
- Exemplo: `^(what)` para encontrar queries com "what"
- **Status:** NÃO IMPLEMENTADO
- **Ação:** Podemos fazer isso manualmente no GSC

## 2. **Identify Infrequently Crawled Pages** ⭐⭐
- Ver quais páginas não foram rastreadas recentemente
- Ir em Indexing > Pages > Last Crawled
- **Status:** NÃO IMPLEMENTADO
- **Ação:** Verificar e solicitar rastreamento manual

## 3. **Identify Schema Issues** ⭐⭐⭐
- Ir em Enhancements > Schema type (FAQ, Breadcrumbs, etc.)
- Verificar erros e avisos
- **Status:** PARCIALMENTE IMPLEMENTADO (schemas adicionados, mas não verificados)
- **Ação:** Verificar se há erros nos schemas

## 4. **Remove URLs from Search Results** ⭐
- Remover URLs temporariamente dos resultados
- Ir em Removals > New Request
- **Status:** NÃO NECESSÁRIO (não temos URLs para remover)

## 5. **Remove Unused Verification Tokens** ⭐
- Limpar tokens de verificação antigos
- Settings > Users and Permissions > Ownership Tokens
- **Status:** NÃO VERIFICADO
- **Ação:** Verificar se há tokens desnecessários

## 6. **Find Underperforming Pages** ⭐⭐⭐
- Performance report > Sort by impressions and clicks
- Encontrar páginas com alto impressions mas baixo CTR
- **Status:** NÃO IMPLEMENTADO
- **Ação:** Analisar quando houver dados (24-48h)

## 7. **Optimize Link Profile** ⭐⭐
- Links report > Top linked pages and top linking sites
- Verificar perfil de links internos e externos
- **Status:** NÃO IMPLEMENTADO
- **Ação:** Analisar quando houver dados

## 8. **Find Keyword Gems** ⭐⭐⭐
- Performance report > Filter queries
- Encontrar keywords com impressions mas posição baixa
- **Status:** NÃO IMPLEMENTADO
- **Ação:** Analisar quando houver dados (24-48h)

---

## TÉCNICAS QUE PODEMOS IMPLEMENTAR AGORA:

### ✅ **Alta Prioridade (Fazer AGORA):**

1. **Verificar Schema Issues** (Técnica #3)
   - Acessar GSC > Enhancements
   - Verificar se há erros nos schemas que implementamos

2. **Remove Unused Verification Tokens** (Técnica #5)
   - Limpar tokens antigos para segurança

### ⏳ **Aguardar Dados (24-48h):**

3. **Find Long-Tail Keywords with Regex** (Técnica #1)
4. **Identify Infrequently Crawled Pages** (Técnica #2)
5. **Find Underperforming Pages** (Técnica #6)
6. **Optimize Link Profile** (Técnica #7)
7. **Find Keyword Gems** (Técnica #8)


---

## CORE WEB VITALS (Google Search Console)

Fonte: https://developers.google.com/search/docs/appearance/core-web-vitals

### **O que são Core Web Vitals?**
Métricas que medem a experiência real do usuário em:
- **Carregamento** (Loading performance)
- **Interatividade** (Interactivity)
- **Estabilidade visual** (Visual stability)

### **3 Métricas Principais:**

1. **LCP - Largest Contentful Paint** ⭐⭐⭐
   - Mede performance de carregamento
   - Meta: **< 2.5 segundos**
   - **Status Atual:** Não verificado no GSC (aguardando dados)

2. **INP - Interaction To Next Paint** ⭐⭐⭐
   - Mede responsividade
   - Meta: **< 200 milissegundos**
   - **Status Atual:** Não verificado no GSC (aguardando dados)

3. **CLS - Cumulative Layout Shift** ⭐⭐⭐
   - Mede estabilidade visual
   - Meta: **< 0.1**
   - **Status Atual:** Implementamos width/height nas imagens (ajuda no CLS!)

### **Como Verificar no Google Search Console:**
- Ir em **Core Web Vitals report** no GSC
- Ver como as páginas performam baseado em dados reais de usuários
- **Status:** AGUARDANDO DADOS (24-48h após indexação)

### **Ação Necessária:**
✅ Verificar o relatório de Core Web Vitals no GSC quando houver dados suficientes
✅ Já implementamos otimizações de imagens que ajudam no LCP e CLS

---

## RESUMO DAS TÉCNICAS QUE PODEMOS FAZER AGORA:

### ✅ **IMPLEMENTAR AGORA (No Google Search Console):**

1. **Verificar Schema Issues**
   - Enhancements > FAQ, Article, Breadcrumbs, How-To
   - Verificar se há erros nos schemas implementados

2. **Remove Unused Verification Tokens**
   - Settings > Users and Permissions > Ownership Tokens
   - Limpar tokens antigos para segurança

3. **Verificar Core Web Vitals** (quando houver dados)
   - Core Web Vitals report
   - Ver LCP, INP e CLS

4. **Solicitar Indexação Manual dos Artigos**
   - URL Inspection tool
   - Solicitar indexação de cada artigo individualmente

### ⏳ **AGUARDAR DADOS (24-48h após indexação):**

5. **Find Long-Tail Keywords with Regex**
6. **Identify Infrequently Crawled Pages**
7. **Find Underperforming Pages**
8. **Optimize Link Profile**
9. **Find Keyword Gems**
