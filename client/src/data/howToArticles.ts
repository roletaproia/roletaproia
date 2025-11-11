// Artigos que contêm tutoriais passo a passo e devem ter How-To Schema

export const howToArticles: Record<string, {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
  }>;
}> = {
  "como-funciona-o-sistema-roboroleta-e-por-que-ele-esta-fazendo-sucesso": {
    name: "Como Usar o Sistema RoboRoleta",
    description: "Aprenda a usar o sistema RoboRoleta passo a passo para maximizar suas chances de ganhar na roleta online.",
    steps: [
      {

      {

      {
        name: "Acesse o Dashboard",
        text: "Acesse o dashboard do RoboRoleta. Lá você verá os sinais em tempo real gerados pela IA."
      },
      {
        name: "Aguarde um sinal de confluência",
        text: "Não aposte em todos os sinais. Aguarde um sinal de alta confiança, onde múltiplas estratégias concordam (confluência)."
      },
      {
        name: "Execute a aposta recomendada",
        text: "Quando o sinal aparecer, execute a aposta exatamente como recomendado pelo sistema (cor, dúzia, coluna, etc.)."
      },
      {
        name: "Gerencie sua banca",
        text: "Use a calculadora de Martingale integrada para gerenciar sua banca. Nunca arrisque mais de 5% do seu capital em uma única sequência."
      },
      {
        name: "Registre seus resultados",
        text: "Acompanhe suas vitórias e derrotas no painel de estatísticas. Isso ajudará a refinar sua estratégia ao longo do tempo."
      }
    ]
  },
  "guia-completo-de-gerenciamento-de-banca-com-inteligencia-artificial": {
    name: "Como Gerenciar Sua Banca com IA",
    description: "Guia completo passo a passo para gerenciar sua banca de apostas usando inteligência artificial.",
    steps: [
      {
        name: "Defina seu capital inicial",
        text: "Determine quanto dinheiro você pode investir sem comprometer suas finanças pessoais. Este será seu capital de apostas."
      },
      {
        name: "Estabeleça a regra dos 5%",
        text: "Nunca arrisque mais de 5% do seu capital total em uma única sequência de apostas. Isso protege sua banca de perdas catastróficas."
      },
      {
        name: "Configure a IA para sua banca",
        text: "No RoboRoleta, configure o sistema para calcular automaticamente o tamanho ideal das apostas baseado no seu capital."
      },
      {
        name: "Use a calculadora de Martingale",
        text: "Utilize a calculadora integrada para determinar quanto apostar em cada gale, garantindo que você recupere as perdas ao vencer."
      },
      {
        name: "Estabeleça metas de stop-loss e stop-win",
        text: "Defina limites diários de perda (ex: -20%) e ganho (ex: +30%). Quando atingir qualquer um deles, pare de jogar."
      },
      {
        name: "Monitore suas estatísticas",
        text: "Acompanhe diariamente suas métricas no painel: taxa de acerto, ROI, maior sequência de vitórias/derrotas."
      },
      {
        name: "Ajuste sua estratégia",
        text: "Com base nos dados coletados, ajuste o tamanho das apostas e a agressividade da estratégia para otimizar resultados."
      }
    ]
  }
};
