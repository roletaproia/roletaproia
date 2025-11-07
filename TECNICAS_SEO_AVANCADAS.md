# Técnicas Avançadas de SEO para Implementar no RoboRoleta

## 1. Schema Markup (Dados Estruturados) - PRIORIDADE MÁXIMA

### O que é:
Schema Markup é código JSON-LD que ajuda o Google a entender melhor o conteúdo das páginas e exibir "Rich Snippets" (resultados enriquecidos) nos resultados de busca.

### Benefícios:
- ✅ **Aumenta CTR (Click-Through Rate)** em até 30%
- ✅ **Destaque visual** nos resultados de busca (estrelas, imagens, datas, autor)
- ✅ **Melhor compreensão** do Google sobre o conteúdo
- ✅ **Elegível para Google News** e outros recursos especiais

### Implementação para Artigos do Blog:

Cada artigo precisa ter um bloco JSON-LD no `<head>` com:

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Título do Artigo",
  "image": [
    "https://roboroleta.com.br/images/article-1x1.jpg",
    "https://roboroleta.com.br/images/article-4x3.jpg",
    "https://roboroleta.com.br/images/article-16x9.jpg"
  ],
  "datePublished": "2025-11-07T10:00:00-03:00",
  "dateModified": "2025-11-07T10:00:00-03:00",
  "author": [{
    "@type": "Person",
    "name": "Equipe RoboRoleta",
    "url": "https://roboroleta.com.br/sobre"
  }],
  "publisher": {
    "@type": "Organization",
    "name": "RoboRoleta",
    "logo": {
      "@type": "ImageObject",
      "url": "https://roboroleta.com.br/logo.png"
    }
  },
  "description": "Meta descrição do artigo"
}
```

### Campos Recomendados (Google):
- ✅ `headline` - Título do artigo
- ✅ `image` - Imagens em 3 formatos (1x1, 4x3, 16x9)
- ✅ `datePublished` - Data de publicação
- ✅ `dateModified` - Data de modificação
- ✅ `author` - Autor(es) do artigo
- ✅ `publisher` - Organização publicadora
- ✅ `description` - Descrição breve

---

## 2. Open Graph e Twitter Cards

### O que é:
Meta tags que controlam como o conteúdo aparece quando compartilhado em redes sociais.

### Implementação:

```html
<!-- Open Graph (Facebook, LinkedIn, WhatsApp) -->
<meta property="og:title" content="Título do Artigo" />
<meta property="og:description" content="Descrição do artigo" />
<meta property="og:image" content="https://roboroleta.com.br/images/article-share.jpg" />
<meta property="og:url" content="https://roboroleta.com.br/blog/artigo" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="RoboRoleta" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Título do Artigo" />
<meta name="twitter:description" content="Descrição do artigo" />
<meta name="twitter:image" content="https://roboroleta.com.br/images/article-share.jpg" />
```

### Benefícios:
- ✅ Aumenta compartilhamentos sociais
- ✅ Melhora aparência em WhatsApp, Facebook, Twitter, LinkedIn
- ✅ Aumenta tráfego de referência

---

## 3. Breadcrumbs (Migalhas de Pão)

### O que é:
Navegação hierárquica que mostra o caminho do usuário no site.

### Implementação:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://roboroleta.com.br"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "Blog",
    "item": "https://roboroleta.com.br/blog"
  },{
    "@type": "ListItem",
    "position": 3,
    "name": "Título do Artigo"
  }]
}
```

### Benefícios:
- ✅ Aparece nos resultados do Google
- ✅ Melhora navegação do usuário
- ✅ Reduz taxa de rejeição

---

## 4. FAQ Schema

### O que é:
Markup para páginas de perguntas frequentes que pode exibir as respostas diretamente no Google.

### Implementação:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "O que é o RoboRoleta?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "RoboRoleta é um sistema de IA que analisa padrões na roleta..."
    }
  }]
}
```

### Benefícios:
- ✅ Ocupa MUITO espaço nos resultados de busca
- ✅ Aumenta CTR drasticamente
- ✅ Posiciona como autoridade

---

## 5. Canonical Tags (Já implementado, mas verificar)

### O que é:
Tag que indica qual é a URL "oficial" de uma página quando há duplicatas.

### Implementação:

```html
<link rel="canonical" href="https://roboroleta.com.br/blog/artigo" />
```

---

## 6. Internal Linking (Links Internos Estratégicos)

### Estratégia:
- Cada artigo deve linkar para 2-3 outros artigos relacionados
- Criar "pillar pages" (páginas pilar) que agregam vários artigos
- Usar anchor text descritivo (não "clique aqui")

### Benefícios:
- ✅ Distribui "link juice" (autoridade)
- ✅ Aumenta tempo no site
- ✅ Melhora crawling do Google

---

## 7. Google Search Console - Configurações Avançadas

### A fazer:
1. ✅ **Submeter sitemap** (já feito)
2. ✅ **Solicitar indexação manual** dos novos artigos
3. ✅ **Monitorar "Coverage"** para erros de indexação
4. ✅ **Verificar "Core Web Vitals"** (velocidade, interatividade)
5. ✅ **Analisar "Search Analytics"** para otimizar palavras-chave

---

## 8. Velocidade e Core Web Vitals

### Métricas Críticas:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Otimizações:
- Comprimir imagens (WebP)
- Lazy loading de imagens
- Minificar CSS/JS
- Usar CDN

---

## 9. Imagens Otimizadas

### Checklist:
- ✅ Formato WebP ou AVIF
- ✅ Alt text descritivo com palavras-chave
- ✅ Nome de arquivo descritivo (ex: "como-ganhar-roleta-ia.webp")
- ✅ Tamanho otimizado (< 200KB)
- ✅ Dimensões corretas (1200x630 para compartilhamento social)

---

## 10. Mobile-First

### Garantir:
- ✅ Design responsivo
- ✅ Texto legível sem zoom
- ✅ Botões clicáveis (mínimo 48x48px)
- ✅ Sem pop-ups intrusivos

---

## Prioridades de Implementação

### 🔴 URGENTE (Implementar HOJE):
1. Schema Markup (BlogPosting) em todos os artigos
2. Open Graph tags
3. Solicitar indexação manual no Search Console

### 🟡 IMPORTANTE (Implementar esta semana):
4. Breadcrumbs
5. Internal linking entre artigos
6. Otimizar imagens

### 🟢 MÉDIO PRAZO:
7. FAQ Schema na página de FAQ
8. Core Web Vitals optimization
9. Monitoramento contínuo no Search Console

---

## Ferramentas para Validação

1. **Rich Results Test**: https://search.google.com/test/rich-results
2. **Schema Validator**: https://validator.schema.org/
3. **PageSpeed Insights**: https://pagespeed.web.dev/
4. **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly

---

## Estimativa de Impacto

Com todas essas implementações:
- **+30-50% CTR** (Schema Markup + Open Graph)
- **+20-40% tráfego orgânico** (melhor indexação)
- **+15-25% tempo no site** (internal linking)
- **Melhor posicionamento** (sinais de qualidade para o Google)

**Tempo estimado para ver resultados:** 2-4 semanas após implementação completa.
