import { Layout } from '@/components/Layout';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Política de Privacidade
          </h1>
          
          <p className="text-gray-400 mb-8">
            <strong>Última Atualização:</strong> 04 de Novembro de 2025
          </p>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              A <strong>Roleta Pro I.A.</strong> ("nós", "nosso" ou "a Empresa") está comprometida em proteger a privacidade 
              dos seus usuários ("você" ou "Usuário"). Esta Política de Privacidade descreve como coletamos, usamos, processamos 
              e compartilhamos suas informações pessoais ao utilizar nosso aplicativo móvel e serviços relacionados ("Serviço").
            </p>
            <p className="text-gray-300 mb-6">
              Ao utilizar o Serviço, você concorda com a coleta e uso de informações de acordo com esta política.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              1. Informações Coletadas
            </h2>
            <p className="text-gray-300 mb-6">
              Coletamos diferentes tipos de informações para fornecer e melhorar nosso Serviço.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              1.1. Dados Fornecidos Diretamente pelo Usuário
            </h3>
            <p className="text-gray-300 mb-4">
              São os dados que você nos fornece ativamente ao se registrar ou utilizar o Serviço:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-600">
                    <th className="py-3 px-4 font-semibold text-white">Categoria de Dado</th>
                    <th className="py-3 px-4 font-semibold text-white">Exemplos de Dados Coletados</th>
                    <th className="py-3 px-4 font-semibold text-white">Finalidade da Coleta</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 font-semibold">Dados de Identificação</td>
                    <td className="py-3 px-4">Nome de usuário, endereço de e-mail (para login e recuperação de conta).</td>
                    <td className="py-3 px-4">Criação e gestão de conta, comunicação de serviço.</td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 px-4 font-semibold">Dados de Contato</td>
                    <td className="py-3 px-4">Número de telefone (se fornecido para suporte ou verificação).</td>
                    <td className="py-3 px-4">Suporte ao cliente e comunicação direta.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">Dados de Uso</td>
                    <td className="py-3 px-4">Preferências de notificação, configurações de estratégia, dados de gerenciamento de banca (inseridos pelo usuário).</td>
                    <td className="py-3 px-4">Personalização do Serviço e fornecimento de funcionalidades.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              1.2. Dados Coletados Automaticamente (Dados de Uso)
            </h3>
            <p className="text-gray-300 mb-4">
              Coletamos automaticamente informações sobre como o Serviço é acessado e utilizado. Estes Dados de Uso podem incluir:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li><strong>Informações do Dispositivo:</strong> Tipo de dispositivo móvel, sistema operacional, identificadores exclusivos de dispositivo, endereço IP.</li>
              <li><strong>Dados de Interação:</strong> Páginas visitadas, tempo gasto nessas páginas, recursos utilizados, frequência de uso do aplicativo.</li>
              <li><strong>Dados de Desempenho:</strong> Relatórios de falhas e erros do aplicativo.</li>
            </ul>
            <p className="text-gray-300 mb-6">
              <strong>Finalidade:</strong> Monitorar e analisar o uso do Serviço, manter a segurança, melhorar a funcionalidade e o desempenho do aplicativo.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              1.3. Dados de Sinais (Informações Não Pessoais)
            </h3>
            <p className="text-gray-300 mb-6">
              O Serviço coleta dados de resultados de jogos de roleta (número, cor, horário) de fontes públicas (como a API da CasinoScores) 
              para gerar as recomendações da I.A. <strong className="text-yellow-400">Estes dados são públicos e não são considerados informações pessoais do Usuário.</strong>
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              2. Uso das Informações
            </h2>
            <p className="text-gray-300 mb-2">
              A <strong>Roleta Pro I.A.</strong> utiliza os dados coletados para diversas finalidades:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li><strong>Fornecer e Manter o Serviço:</strong> Incluindo monitorar o uso e resolver problemas técnicos.</li>
              <li><strong>Gerenciar sua Conta:</strong> Gerenciar seu registro como usuário e fornecer acesso às diferentes funcionalidades.</li>
              <li><strong>Comunicação:</strong> Enviar notificações sobre o Serviço, atualizações de segurança e informações de suporte.</li>
              <li><strong>Melhoria do Serviço:</strong> Analisar tendências e feedback para desenvolver novos recursos e melhorar a experiência do usuário.</li>
              <li><strong>Segurança:</strong> Detectar, prevenir e resolver fraudes ou problemas técnicos.</li>
            </ul>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              3. Compartilhamento de Informações
            </h2>
            <p className="text-gray-300 mb-2">
              Não vendemos ou alugamos suas informações pessoais. Podemos compartilhar seus dados nas seguintes situações:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li><strong>Com Provedores de Serviço:</strong> Podemos empregar empresas e indivíduos terceirizados para facilitar nosso Serviço (ex: serviços de hospedagem, análise de dados). Estes terceiros têm acesso aos seus Dados Pessoais apenas para realizar essas tarefas em nosso nome e são obrigados a não divulgá-los ou usá-los para qualquer outra finalidade.</li>
              <li><strong>Para Conformidade Legal:</strong> Se exigido por lei ou em resposta a solicitações válidas de autoridades públicas (ex: ordem judicial).</li>
              <li><strong>Com Consentimento:</strong> Podemos divulgar suas informações para qualquer outra finalidade com o seu consentimento.</li>
            </ul>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              4. Segurança dos Dados
            </h2>
            <p className="text-gray-300 mb-4">
              A segurança dos seus dados é de extrema importância para nós. Empregamos medidas de segurança técnicas e organizacionais 
              avançadas para proteger suas informações pessoais contra acesso, alteração, divulgação ou destruição não autorizados.
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
              <li><strong>Criptografia:</strong> Todas as senhas de acesso são armazenadas de forma criptografada (hashing unidirecional) e não podem ser recuperadas em texto simples. A comunicação entre o seu dispositivo e nossos servidores é protegida por criptografia SSL/TLS.</li>
              <li><strong>Armazenamento:</strong> Os dados de login e informações de conta são armazenados em servidores seguros, com acesso restrito e monitorado.</li>
            </ul>
            <p className="text-gray-300 mb-6">
              <strong className="text-yellow-400">Atenção:</strong> Lembre-se que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro. Você é responsável por manter a confidencialidade de sua senha.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              5. Ausência de Compras e Reembolso
            </h2>
            <p className="text-gray-300 mb-6">
              O Serviço <strong>Roleta Pro I.A.</strong> é oferecido de forma gratuita. Não realizamos vendas diretas, compras in-app ou assinaturas. Portanto, a Política de Reembolso não se aplica.
            </p>

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              6. Retenção de Dados
            </h2>
            <p className="text-gray-300 mb-6">
              Reteremos seus Dados Pessoais apenas pelo tempo necessário para os fins estabelecidos nesta Política de Privacidade. 
              Reteremos e usaremos seus dados na medida necessária para cumprir nossas obrigações legais (por exemplo, se formos obrigados 
              a reter seus dados para cumprir as leis aplicáveis), resolver disputas e fazer cumprir nossos acordos e políticas legais.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              7. Seus Direitos de Privacidade
            </h2>
            <p className="text-gray-300 mb-2">
              Você tem o direito de:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li><strong>Acessar</strong> os dados pessoais que mantemos sobre você.</li>
              <li><strong>Solicitar a correção</strong> de quaisquer dados incompletos ou imprecisos.</li>
              <li><strong>Solicitar a exclusão</strong> dos seus dados pessoais (Direito ao Esquecimento), sujeito a certas obrigações legais.</li>
            </ul>
            <p className="text-gray-300 mb-6">
              Para exercer esses direitos, entre em contato conosco através dos canais listados na Seção 9.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              8. Alterações a Esta Política de Privacidade
            </h2>
            <p className="text-gray-300 mb-6">
              Podemos atualizar nossa Política de Privacidade periodicamente. Notificaremos você sobre quaisquer alterações publicando 
              a nova Política de Privacidade nesta página. Aconselhamos que você revise esta Política de Privacidade periodicamente 
              para quaisquer alterações.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              9. Contato
            </h2>
            <p className="text-gray-300 mb-4">
              Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco:
            </p>
            
            <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
              <table className="w-full text-left">
                <tbody>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 pr-4 font-semibold text-white">E-mail de Suporte</td>
                    <td className="py-3">
                      <a href="mailto:manus20261@gmail.com" className="text-blue-400 hover:text-blue-300">
                        manus20261@gmail.com
                      </a>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-700">
                    <td className="py-3 pr-4 font-semibold text-white">Suporte Telegram</td>
                    <td className="py-3">
                      <a href="https://t.me/roletaproia" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                        https://t.me/roletaproia
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-semibold text-white">Telefone</td>
                    <td className="py-3 text-gray-300">+55 19 98936-0509</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center text-gray-400 font-semibold mt-8">
              FIM DA POLÍTICA DE PRIVACIDADE
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
