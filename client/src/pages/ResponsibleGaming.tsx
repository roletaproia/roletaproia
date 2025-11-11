import React from 'react';
import { Layout } from '../components/Layout';

const responsibleGamingContent = `
# Jogo Responsável - RoboRoleta

**Última atualização:** 11 de Novembro de 2025

## 1. Nosso Compromisso

O **RoboRoleta** é uma ferramenta de análise e suporte, e não uma plataforma de apostas. No entanto, reconhecemos que nosso Serviço está relacionado a atividades de jogo. Por isso, promovemos ativamente o **Jogo Responsável** e incentivamos nossos usuários a manterem o controle sobre seus hábitos de jogo.

## 2. O Jogo Deve Ser Divertido

O jogo deve ser visto como uma forma de entretenimento, e não como uma fonte de renda. Nunca jogue com dinheiro que você não pode perder.

## 3. Dicas para o Jogo Responsável

*   **Estabeleça Limites:** Defina limites de tempo e dinheiro antes de começar a jogar e cumpra-os.
*   **Não Corra Atrás de Prejuízos:** Se você perder dinheiro, não tente recuperá-lo aumentando suas apostas. Isso pode levar a perdas maiores.
*   **Não Jogue Sob Influência:** Evite jogar quando estiver estressado, deprimido ou sob a influência de álcool ou outras substâncias.
*   **Equilíbrio:** Certifique-se de que o jogo não interfira em suas responsabilidades diárias, como trabalho, família ou estudos.

## 4. Busque Ajuda Profissional

Se você ou alguém que você conhece está lutando contra o vício em jogos de azar, existem organizações que podem ajudar.

*   **Jogadores Anônimos (Gamblers Anonymous):** Procure o capítulo mais próximo em sua região.
*   **Linhas de Ajuda Nacionais:** Muitos países oferecem linhas de apoio gratuitas e confidenciais para problemas com jogos de azar.

## 5. Ferramentas de Autoexclusão

Se você sentir que precisa de uma pausa, utilize as ferramentas de autoexclusão e limites de depósito oferecidas pelas plataformas de cassino onde você joga.

## 6. Contato

Se você tiver dúvidas sobre nossa política de Jogo Responsável, entre em contato conosco através do e-mail: champgames@champgames.com.br
`;

export default function ResponsibleGaming() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Jogo Responsável
          </h1>
          <p className="text-gray-400 mb-8">
            <strong>Última Atualização:</strong> 11 de Novembro de 2025
          </p>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: responsibleGamingContent }} />
        </div>
      </div>
    </Layout>
  );
}
