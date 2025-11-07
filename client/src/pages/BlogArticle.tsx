import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

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
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
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
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
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

  return (
    <Layout>
      {/* Schema Markup para SEO */}
      {schemaMarkup && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      )}
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
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
            <article className="prose prose-lg dark:prose-invert max-w-none">
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
