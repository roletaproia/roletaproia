import React from 'react';
import { Layout } from '../components/Layout';

const termsOfUseContent = `
# Termos de Uso - RoboRoleta

**Última atualização:** 11 de Novembro de 2025

## 1. Aceitação dos Termos

Ao acessar e utilizar o aplicativo e o site **RoboRoleta** (o "Serviço"), você concorda em cumprir e se obrigar por estes Termos de Uso. Se você não concordar com qualquer parte dos termos, você não deve utilizar o Serviço.

## 2. Natureza do Serviço

O RoboRoleta é uma **ferramenta de análise e suporte estratégico**. O Serviço fornece sinais e análises estatísticas para o jogo de roleta online.

**O RoboRoleta não é uma plataforma de apostas.** Não aceitamos, facilitamos ou realizamos transações financeiras relacionadas a jogos de azar. O uso do Serviço não garante ganhos ou lucros.

## 3. Uso do Serviço

O Serviço destina-se apenas a fins informativos e de entretenimento. Você é o único responsável por suas decisões de jogo e por quaisquer perdas financeiras que possa incorrer.

*   **Idade Mínima:** Você deve ter a idade legal para jogar em sua jurisdição para usar o Serviço.
*   **Risco:** O jogo de azar envolve risco. Use o Serviço por sua conta e risco.

## 4. Propriedade Intelectual

Todo o conteúdo, recursos e funcionalidades do Serviço (incluindo, mas não se limitando a, software, algoritmos, sinais e design) são de propriedade exclusiva do RoboRoleta e são protegidos por leis de direitos autorais.

## 5. Limitação de Responsabilidade

Em nenhuma circunstância o RoboRoleta, seus diretores, funcionários ou afiliados serão responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis, resultantes do seu acesso ou uso do Serviço.

## 6. Alterações aos Termos

Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, faremos esforços razoáveis para fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor.

## 7. Contato

Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco através do e-mail: [SEU E-MAIL DE SUPORTE AQUI]
`;

export default function TermsOfUse() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Termos de Uso
          </h1>
          <p className="text-gray-400 mb-8">
            <strong>Última Atualização:</strong> 11 de Novembro de 2025
          </p>
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: termsOfUseContent }} />
        </div>
      </div>
    </Layout>
  );
}
