import React from 'react';

const HowItWorks: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Como Funciona o Roleta Pro I.A.</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Análise Avançada com Inteligência Artificial</h2>
        <p className="text-lg">
          Nosso sistema utiliza um algoritmo de Inteligência Artificial (IA) de última geração para analisar os últimos <strong>200 números</strong> sorteados na roleta em tempo real. A IA busca por padrões, tendências, anomalias estatísticas e a frequência de números, cores, dúzias e par/ímpar.
        </p>
        <p className="text-lg mt-2">
          Com base nessa análise profunda, o sistema identifica oportunidades e gera recomendações com um alto grau de precisão, aumentando significativamente suas chances de ganhar na roleta.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">5 Estratégias de Análise Simultâneas</h2>
        <p className="text-lg">
          Para garantir a melhor recomendação possível, nossa IA utiliza <strong>5 estratégias de análise</strong> simultaneamente:
        </p>
        <ul className="list-disc list-inside text-lg mt-2">
          <li><strong>Análise de Cores:</strong> Identifica sequências e tendências de cores (vermelho/preto).</li>
          <li><strong>Análise de Par/Ímpar:</strong> Busca por padrões em números pares e ímpares.</li>
          <li><strong>Análise de Dúzias:</strong> Verifica a frequência e o atraso de cada uma das três dúzias.</li>
          <li><strong>Análise de Números Quentes e Frios:</strong> Identifica os números que mais e menos saíram recentemente.</li>
          <li><strong>Análise de Padrões Complexos:</strong> Utiliza machine learning para encontrar correlações complexas que não são visíveis a olho nu.</li>
        </ul>
        <p className="text-lg mt-2">
          Um sinal só é confirmado quando <strong>3 ou mais estratégias</strong> concordam, garantindo uma recomendação com alta probabilidade de acerto.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Calculadora Martingale Integrada</h2>
        <p className="text-lg">
          Para otimizar sua gestão de banca, oferecemos uma <strong>calculadora Martingale</strong> integrada. Ela calcula automaticamente o valor da sua próxima aposta em caso de perda, garantindo que você recupere o valor perdido e ainda obtenha lucro ao acertar.
        </p>
        <p className="text-lg mt-2">
          Recomendamos o uso de no máximo <strong>2 gales</strong> para uma gestão de banca segura e sustentável a longo prazo.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Como Usar os Sinais</h2>
        <ol className="list-decimal list-inside text-lg mt-2">
          <li><strong>Aguarde um Sinal Confirmado:</strong> Fique de olho no card "RECOMENDAÇÃO I.A.". Quando aparecer um sinal com "SINAL CONFIRMADO", é hora de agir.</li>
          <li><strong>Faça sua Aposta:</strong> Aposte no número, cor, par/ímpar ou dúzia recomendada.</li>
          <li><strong>Use a Calculadora Martingale:</strong> Se errar, use a calculadora para saber o valor da próxima aposta (Gale 1). Se errar novamente, use o Gale 2.</li>
          <li><strong>Pare após 2 Gales:</strong> Se errar no Gale 2, pare e aguarde um novo sinal. Não arrisque sua banca.</li>
          <li><strong>Acertei, e agora?</strong> Ao acertar, volte para sua aposta inicial e aguarde um novo sinal.</li>
        </ol>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Aviso de Responsabilidade</h2>
        <p className="text-lg text-yellow-500">
          Lembre-se: a roleta é um jogo de sorte. Nossa IA é uma ferramenta poderosa para aumentar suas chances, mas <strong>não garante vitórias</strong>. Jogue com responsabilidade e gerencie sua banca com sabedoria.
        </p>
      </section>
    </div>
  );
};

  );
};

export default HowItWorks;
