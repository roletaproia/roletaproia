import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRoute, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, BookOpen } from "lucide-react";
import { relatedArticles } from "@/data/relatedArticles";

export default function BlogArticle() {
  const [, params] = useRoute("/blog/:slug");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [metadata, setMetadata] = useState<{
    title: string;
    description: string;
    date: string;
    readTime: string;
  } | null>(null);

  useEffect(() => {
    if (!params?.slug) return;

    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(false);

        // Tentar carregar o arquivo markdown
        const response = await fetch(`/blog/${params.slug}.md`);
        
        if (!response.ok) {
          throw new Error("Artigo não encontrado");
        }

        const text = await response.text();
        
        // Extrair metadados do conteúdo
        const lines = text.split("\n");
        let title = "";
        let description = "";
        let articleContent = text;

        // Procurar pelo título (primeira linha com #)
        const titleLine = lines.find(line => line.startsWith("# "));
        if (titleLine) {
          title = titleLine.replace("# ", "");
        }

        // Procurar pela meta descrição no final do arquivo
        const metaDescIndex = lines.findIndex(line => line.includes("**Meta Descrição:"));
        if (metaDescIndex !== -1 && lines[metaDescIndex + 1]) {
          description = lines[metaDescIndex + 1].trim();
        }

        // Calcular tempo de leitura (aproximadamente 200 palavras por minuto)
        const wordCount = text.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);

        setMetadata({
          title: title || params.slug.replace(/-/g, " "),
          description: description || "",
          date: new Date().toLocaleDateString("pt-BR"),
          readTime: `${readTime} min de leitura`,
        });

        setContent(articleContent);
      } catch (err) {
        console.error("Erro ao carregar artigo:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [params?.slug]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !content) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Artigo não encontrado</h1>
              <p className="text-gray-600 mb-8">
                O artigo que você está procurando não existe ou foi removido.
              </p>
              <Link href="/blog">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Schema Markup para SEO
  const schemaMarkup = metadata ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": metadata.title,
    "description": metadata.description,
    "datePublished": new Date().toISOString(),
    "dateModified": new Date().toISOString(),
    "author": [{
      "@type": "Organization",
      "name": "RoboRoleta",
      "url": "https://roboroleta.com.br"
    }],
    "publisher": {
      "@type": "Organization",
      "name": "RoboRoleta",
      "logo": {
        "@type": "ImageObject",
        "url": "https://roboroleta.com.br/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://roboroleta.com.br/blog/${params?.slug}`
    },
    "image": "https://roboroleta.com.br/og-image.png"
  } : null;

  const currentUrl = `https://roboroleta.com.br/blog/${params?.slug}`;
  const ogImage = "https://roboroleta.com.br/og-image.png";

  // Breadcrumbs Schema
  const breadcrumbSchema = metadata ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://roboroleta.com.br"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://roboroleta.com.br/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": metadata.title,
        "item": currentUrl
      }
    ]
  } : null;

  return (
    <Layout>
      {/* Meta tags para SEO, Open Graph e Twitter Cards */}
      {metadata && (
        <Helmet>
          {/* Meta tags básicas */}
          <title>{metadata.title} | RoboRoleta Blog</title>
          <meta name="description" content={metadata.description} />
          <link rel="canonical" href={currentUrl} />
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="article" />
          <meta property="og:title" content={metadata.title} />
          <meta property="og:description" content={metadata.description} />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:site_name" content="RoboRoleta" />
          <meta property="og:locale" content="pt_BR" />
          <meta property="article:published_time" content={new Date().toISOString()} />
          <meta property="article:author" content="RoboRoleta" />
          <meta property="article:section" content="Apostas e IA" />
          
          {/* Twitter Cards */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metadata.title} />
          <meta name="twitter:description" content={metadata.description} />
          <meta name="twitter:image" content={ogImage} />
          <meta name="twitter:site" content="@roboroleta" />
          <meta name="twitter:creator" content="@roboroleta" />
        </Helmet>
      )}
      
      {/* Schema Markup para SEO */}
      {schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      )}
      
      {/* Breadcrumbs Schema */}
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Botão Voltar */}
            <Link href="/blog">
              <Button variant="ghost" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o Blog
              </Button>
            </Link>

            {/* Cabeçalho do Artigo */}
            {metadata && (
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {metadata.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{metadata.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{metadata.readTime}</span>
                  </div>
                </div>

                {metadata.description && (
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    {metadata.description}
                  </p>
                )}
              </div>
            )}

            {/* Conteúdo do Artigo */}
            <article className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-p:mb-6 prose-p:leading-relaxed prose-strong:text-white prose-li:text-gray-300 prose-blockquote:text-gray-400 prose-blockquote:border-purple-500 prose-h2:mt-12 prose-h2:mb-6 prose-h3:mt-8 prose-h3:mb-4 prose-ul:my-6 prose-ol:my-6 prose-table:my-8">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  // Customizar renderização de links
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      className="text-purple-600 hover:text-purple-700 underline"
                      target={props.href?.startsWith("http") ? "_blank" : undefined}
                      rel={props.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                    />
                  ),
                  // Customizar renderização de tabelas
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-8">
                      <table {...props} className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" />
                    </div>
                  ),
                  // Customizar renderização de código
                  code: ({ node, inline, ...props }) => (
                    inline ? (
                      <code {...props} className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm" />
                    ) : (
                      <code {...props} className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto" />
                    )
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </article>

            {/* Artigos Relacionados */}
            {params?.slug && relatedArticles[params.slug] && (
              <div className="mt-12 p-8 bg-gray-800/50 rounded-2xl border border-gray-700">
                <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-purple-500" />
                  Artigos Relacionados
                </h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {relatedArticles[params.slug].map((article) => (
                    <Link key={article.slug} href={`/blog/${article.slug}`}>
                      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-all cursor-pointer group">
                        <h4 className="text-white font-semibold group-hover:text-purple-400 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-400 mt-2">Leia mais →</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA no final do artigo */}
            <div className="mt-12 p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white text-center">
              <h3 className="text-2xl font-bold mb-4">
                Pronto para usar a Inteligência Artificial a seu favor?
              </h3>
              <p className="mb-6 text-purple-100">
                Cadastre-se agora no RoboRoleta e comece a receber sinais inteligentes em tempo real!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    Começar Agora Grátis
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/30">
                    Ler Mais Artigos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
