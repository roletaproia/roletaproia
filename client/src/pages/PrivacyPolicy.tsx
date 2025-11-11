import { Layout } from '@/components/Layout';
import { Markdown } from '@/components/Markdown';

const privacyPolicyContent = `
# Política de Privacidade - RoboRoleta

**Última atualização:** 11 de novembro de 2025

Esta Política de Privacidade descreve como o RoboRoleta ("nós", "nosso") coleta, usa e protege as informações dos usuários. Ao usar nosso aplicativo, você concorda com a coleta e uso de informações de acordo com esta política.

## 1. Coleta e Uso de Informações

O RoboRoleta é uma ferramenta de análise e não coleta informações de identificação pessoal (PII) dos seus usuários. Não solicitamos nome, e-mail, endereço ou número de telefone.

As únicas informações que podemos coletar são dados anônimos de uso do aplicativo, como:

- Interações com a interface (cliques em botões, telas visitadas)
- Dados de performance (tempo de carregamento, erros)
- Informações do dispositivo (modelo, sistema operacional)

Esses dados são usados exclusivamente para melhorar a experiência do usuário, corrigir bugs e otimizar o desempenho do aplicativo.

## 2. Segurança

A segurança dos seus dados é importante para nós, mas lembre-se que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis para proteger seus dados, não podemos garantir sua segurança absoluta.

## 3. Links para Outros Sites

Nosso aplicativo pode conter links para outros sites que não são operados por nós. Se você clicar em um link de terceiros, será direcionado para o site desse terceiro. Aconselhamos vivamente que reveja a Política de Privacidade de todos os sites que visita.

Não temos controle e não assumimos qualquer responsabilidade pelo conteúdo, políticas de privacidade ou práticas de quaisquer sites ou serviços de terceiros.

## 4. Alterações a Esta Política de Privacidade

Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos sobre quaisquer alterações publicando a nova Política de Privacidade nesta página.

## 5. Contato

Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco pelo e-mail: \`manus20261@gmail.com\`
`;

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Política de Privacidade
          </h1>
          <p className="text-gray-400 mb-8">
            <strong>Última Atualização:</strong> 11 de Novembro de 2025
          </p>
          <Markdown content={privacyPolicyContent} />
        </div>
      </div>
    </Layout>
  );
}
