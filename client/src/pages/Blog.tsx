import React from 'react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const articles = [
    {
      title: '5 Estratégias Comprovadas para Ganhar na Roleta Online',
      slug: '5-estrategias-para-ganhar-na-roleta',
      excerpt: 'Descubra as 5 estratégias mais eficazes para aumentar suas chances de ganhar na roleta, desde o sistema Martingale até a estratégia de Fibonacci...',
    },
    {
      title: 'O Guia Definitivo do Sistema Martingale na Roleta',
      slug: 'guia-definitivo-martingale-roleta',
      excerpt: 'Entenda em detalhes como funciona o sistema Martingale, seus prós e contras, e como aplicá-lo de forma segura para maximizar seus lucros e minimizar riscos...',
    },
    {
      title: 'Psicologia do Jogo: Como Manter a Calma e Ganhar na Roleta',
      slug: 'psicologia-do-jogo-roleta',
      excerpt: 'Aprenda a controlar suas emoções, gerenciar sua banca com sabedoria e evitar os erros mais comuns que levam a grandes perdas na roleta...',
    },
    {
      title: 'Análise de Padrões: A Ciência por Trás dos Sinais da Roleta',
      slug: 'analise-de-padroes-roleta',
      excerpt: 'Descubra como nossa I.A. analisa padrões de cores, dúzias, par/ímpar e números quentes/frios para gerar sinais com alta probabilidade de acerto...',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Blog - Dicas e Estratégias para Roleta</h1>
      <div className="space-y-6">
        {articles.map((article, index) => (
          <div key={index} className="border-b pb-4">
            <h2 className="text-2xl font-semibold text-purple-400 hover:text-purple-300">
              <Link to={`/blog/${article.slug}`}>{article.title}</Link>
            </h2>
            <p className="text-lg mt-2">{article.excerpt}</p>
            <Link to={`/blog/${article.slug}`} className="text-blue-400 hover:underline mt-2 inline-block">
              Leia mais &rarr;
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
