import React from 'react';
import { Link } from 'wouter';
import { FileText, TrendingUp, Brain, Target, Zap, Shield, Clock, Sparkles, BarChart3, Award } from 'lucide-react';

const Blog: React.FC = () => {
  const articles = [
    {
      title: 'Como a Inteligência Artificial Está Mudando o Jogo da Roleta',
      slug: 'como-a-inteligencia-artificial-esta-mudando-o-jogo-da-roleta',
      excerpt: 'Descubra como a IA analisa dados, remove o fator emocional e aplica múltiplas estratégias para transformar a forma como você joga roleta online.',
      icon: Brain,
      date: '07 Nov 2025',
    },
    {
      title: 'Martingale, Fibonacci e D\'Alembert: Qual Estratégia Funciona Melhor com IA?',
      slug: 'martingale-fibonacci-dalembert-qual-estrategia-funciona-melhor-com-ia',
      excerpt: 'Análise profunda das três estratégias mais famosas e como o RoboRoleta resolve seus problemas através da estratégia de confluência.',
      icon: TrendingUp,
      date: '07 Nov 2025',
    },
    {
      title: 'Guia Completo de Gerenciamento de Banca com Inteligência Artificial',
      slug: 'guia-completo-de-gerenciamento-de-banca-com-inteligencia-artificial',
      excerpt: 'Aprenda a proteger seu capital e maximizar seus lucros na roleta com um gerenciamento de banca eficaz automatizado pela IA.',
      icon: Shield,
      date: '07 Nov 2025',
    },
    {
      title: 'A Mentalidade do Jogador Inteligente: Como a IA Corrige Decisões Impulsivas',
      slug: 'a-mentalidade-do-jogador-inteligente-como-a-ia-corrige-decisoes-impulsivas',
      excerpt: 'Explore a psicologia por trás das apostas e veja como a IA do RoboRoleta atua como um antídoto contra decisões impulsivas.',
      icon: Target,
      date: '07 Nov 2025',
    },
    {
      title: 'Probabilidades na Roleta: Como a IA Calcula Padrões que Seus Olhos Não Veem',
      slug: 'probabilidades-na-roleta-como-a-ia-calcula-padroes-que-seus-olhos-nao-veem',
      excerpt: 'Entenda a matemática por trás da roleta e como a IA processa milhares de dados para encontrar padrões invisíveis ao olho humano.',
      icon: BarChart3,
      date: '07 Nov 2025',
    },
    {
      title: 'Como Funciona o Sistema RoboRoleta e Por Que Ele Está Fazendo Sucesso',
      slug: 'como-funciona-o-sistema-roboroleta-e-por-que-ele-esta-fazendo-sucesso',
      excerpt: 'Um mergulho profundo no RoboRoleta, sua tecnologia de confluência, seus benefícios e por que ele é a ferramenta que faltava.',
      icon: Zap,
      date: '07 Nov 2025',
    },
    {
      title: 'A Melhor Hora para Apostar na Roleta, Segundo a Inteligência Artificial',
      slug: 'a-melhor-hora-para-apostar-na-roleta-segundo-a-inteligencia-artificial',
      excerpt: 'Descubra que, em apostas, o "quando" é tão importante quanto o "onde". Aprenda como a IA identifica os momentos de maior probabilidade.',
      icon: Clock,
      date: '07 Nov 2025',
    },
    {
      title: 'O Futuro das Apostas: Como a IA e o Big Data Estão Nivelando o Jogo Contra os Cassinos',
      slug: 'o-futuro-das-apostas-como-a-ia-e-o-big-data-estao-nivelando-o-jogo-contra-os-cassinos',
      excerpt: 'Explore como a Inteligência Artificial e o Big Data estão democratizando o acesso à análise de dados e capacitando jogadores comuns.',
      icon: Sparkles,
      date: '07 Nov 2025',
    },
    {
      title: '5 Sinais de Roleta que Você Nunca Deve Ignorar, Segundo a IA',
      slug: '5-sinais-de-roleta-que-voce-nunca-deve-ignorar-segundo-a-ia',
      excerpt: 'Aprenda a pensar como um algoritmo. Este guia prático revela 5 dos mais poderosos sinais que a IA procura antes de recomendar uma aposta.',
      icon: FileText,
      date: '07 Nov 2025',
    },
    {
      title: 'RoboRoleta vs. Outras Ferramentas: Por Que a Análise por Confluência Vence',
      slug: 'roboroleta-vs-outras-ferramentas-por-que-a-analise-por-confluencia-vence',
      excerpt: 'Um comparativo direto entre o RoboRoleta e outras ferramentas de apostas. Entenda por que a análise por confluência é superior.',
      icon: Award,
      date: '07 Nov 2025',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            📚 Artigos e Estratégias
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Aprenda com nossos guias completos sobre estratégias de roleta, gerenciamento de banca, 
            psicologia do jogo e como a Inteligência Artificial está revolucionando as apostas online.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, index) => {
            const Icon = article.icon;
            return (
              <Link 
                key={index} 
                href={`/blog/${article.slug}`}
                className="block"
              >
                <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer h-full">
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-500/20 p-3 rounded-lg">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-400 mb-2">{article.date}</div>
                      <h2 className="text-xl font-semibold text-white mb-3 hover:text-purple-400 transition-colors">
                        {article.title}
                      </h2>
                      <p className="text-gray-300 leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="mt-4 text-purple-400 font-medium flex items-center gap-2">
                        Ler artigo completo
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        
      </div>
    </div>
  );
};

export default Blog;
