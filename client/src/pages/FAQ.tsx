import React from 'react';
import { Helmet } from 'react-helmet-async';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: 'O que é o Roleta Pro I.A.?',
      answer: 'É um sistema de Inteligência Artificial que analisa a roleta em tempo real e gera sinais com alta probabilidade de acerto, ajudando você a tomar decisões mais inteligentes e aumentar suas chances de ganhar.',
    },
    {
      question: 'Como a Inteligência Artificial funciona?',
      answer: 'Nossa IA analisa os últimos 200 números sorteados, identificando padrões de cores, par/ímpar, dúzias, números quentes/frios e outras tendências complexas. Um sinal só é confirmado quando 3 ou mais de nossas 5 estratégias concordam.',
    },
    {
      question: 'O que é Martingale e como funciona a calculadora?',
      answer: 'Martingale é uma estratégia de apostas onde você dobra o valor da aposta após uma perda. Nossa calculadora integrada faz esse cálculo para você, garantindo que você recupere o valor perdido e obtenha lucro ao acertar. Recomendamos usar no máximo 2 gales.',
    },
    {
      question: 'A vitória é garantida?',
      answer: 'Não. A roleta é um jogo de sorte e é impossível prever o resultado com 100% de certeza. Nossa ferramenta aumenta drasticamente suas chances ao identificar padrões, mas não garante vitórias. Jogue com responsabilidade.',
    },
    {
      question: 'Qual a taxa de acerto da I.A.?',
      answer: 'A taxa de acerto pode variar dependendo das condições do mercado e da roleta. Nosso sistema é projetado para ter uma alta taxa de acerto a longo prazo, mas resultados passados não garantem resultados futuros.',
    },
    {
      question: 'Preciso pagar para usar o sistema?',
      answer: 'Atualmente, o Roleta Pro I.A. é 100% gratuito. Aproveite enquanto está disponível!',
    },
    {
      question: 'Em qual casa de apostas funciona?',
      answer: 'Nossos sinais são baseados na roleta brasileira da 1Win, mas as estratégias podem ser aplicadas em qualquer roleta online. Recomendamos usar a 1Win para maior precisão.',
    },
  ];

  // FAQ Schema for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>FAQ - Perguntas Frequentes | RoboRoleta</title>
        <meta name="description" content="Perguntas frequentes sobre o RoboRoleta - Sistema de IA para análise de roleta. Saiba como funciona, taxa de acerto, estratégias e mais." />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Perguntas Frequentes (FAQ)</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b pb-4">
            <h2 className="text-xl font-semibold text-purple-400">{faq.question}</h2>
            <p className="text-lg mt-2">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default FAQ;
