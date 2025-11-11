import { Layout } from '@/components/Layout';

export default function TermsOfService() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-white mb-4">
            Termos de Uso (Termos de Serviço)
          </h1>
          
          <p className="text-gray-400 mb-8">
            <strong>Última Atualização:</strong> 11 de Novembro de 2025
          </p>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              Bem-vindo à <strong>Roleta Pro I.A.</strong> ("Serviço", "nós", "nosso"). 
              Estes Termos de Uso ("Termos") regem o uso do nosso aplicativo móvel e serviços relacionados. 
              Ao acessar ou usar o Serviço, você concorda em ficar vinculado a estes Termos.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              1. Aceitação dos Termos
            </h2>
            <p className="text-gray-300 mb-6">
Ao acessar ou usar o Serviço, você declara que leu, entendeu e concorda em cumprir estes Termos. 
	              O Serviço não requer a criação de conta. Se você não concordar com qualquer parte destes Termos, você não deve usar o Serviço.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              2. Natureza do Serviço e Isenção de Responsabilidade
            </h2>
            
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              2.1. Serviço de Análise e Recomendação
            </h3>
            <p className="text-gray-300 mb-6">
              O Serviço <strong>Roleta Pro I.A.</strong> fornece análises estatísticas e recomendações de apostas 
              baseadas em algoritmos de Inteligência Artificial (I.A.) que processam dados de resultados de jogos de roleta.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">
              2.2. Isenção de Responsabilidade Financeira
            </h3>
            <p className="text-gray-300 mb-4">
              <strong className="text-yellow-400">O Serviço não garante lucros ou resultados financeiros.</strong> 
              {' '}O jogo de roleta, incluindo a Lightning Roulette, é um jogo de azar e envolve risco de perda financeira.
            </p>
            <p className="text-gray-300 mb-2">
              <strong>Ao usar o Serviço, você reconhece e concorda que:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>As recomendações da I.A. são apenas sugestões baseadas em probabilidade e padrões estatísticos.</li>
              <li>Você é o único responsável por todas as decisões de aposta e por quaisquer perdas financeiras incorridas.</li>
              <li>A <strong>Roleta Pro I.A.</strong> não se responsabiliza por quaisquer perdas ou danos resultantes do uso das informações ou recomendações fornecidas.</li>
            </ul>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              3. Direitos de Propriedade Intelectual
            </h2>
            <p className="text-gray-300 mb-4">
              Todo o conteúdo, recursos e funcionalidades do Serviço (incluindo, mas não se limitando a software, algoritmos, 
              design, textos, gráficos e logotipos) são de propriedade exclusiva da <strong>Roleta Pro I.A.</strong> e são 
              protegidos por leis de direitos autorais e propriedade intelectual.
            </p>
            <p className="text-gray-300 mb-6">
              <strong>Licença de Uso (EULA):</strong> Você recebe uma licença limitada, não exclusiva e intransferível para 
              usar o Serviço apenas para seu uso pessoal e não comercial, de acordo com estes Termos. Você não pode copiar, 
              modificar, distribuir, vender ou alugar qualquer parte do nosso Serviço.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              4. Conduta do Usuário
            </h2>
            <p className="text-gray-300 mb-2">
              Você concorda em não usar o Serviço para:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
              <li>Violar qualquer lei ou regulamento aplicável.</li>
              <li>Realizar engenharia reversa, descompilar ou tentar extrair o código-fonte do aplicativo.</li>
              <li>Interferir ou interromper a integridade ou o desempenho do Serviço.</li>
              <li>Tentar obter acesso não autorizado a qualquer parte do Serviço ou sistemas relacionados.</li>
            </ul>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              5. Gratuidade do Serviço
            </h2>
            <p className="text-gray-300 mb-6">
              O Serviço <strong>Roleta Pro I.A.</strong> é oferecido de forma <strong className="text-green-400">totalmente gratuita</strong>. 
              Não há cobrança de taxas, assinaturas ou compras in-app para o uso das funcionalidades básicas de análise e recomendação. 
              Reservamo-nos o direito de introduzir recursos premium no futuro, mediante aviso prévio e aceitação de novos termos de serviço.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              6. Alterações no Serviço
            </h2>
            <p className="text-gray-300 mb-6">
O Serviço pode ser alterado, suspenso ou descontinuado a qualquer momento, sem aviso prévio ou responsabilidade. 
	              O acesso ao Serviço pode ser suspenso se você violar estes Termos.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              7. Limitação de Responsabilidade
            </h2>
            <p className="text-gray-300 mb-6">
              Em nenhuma circunstância a <strong>Roleta Pro I.A.</strong>, seus diretores, funcionários ou afiliados serão 
              responsáveis por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo, 
              sem limitação, perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis, resultantes do seu 
              acesso ou uso do Serviço.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              8. Alterações aos Termos
            </h2>
            <p className="text-gray-300 mb-6">
              Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, 
              faremos esforços razoáveis para fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer 
              novos termos entrem em vigor.
            </p>

            <hr className="border-gray-700 my-8" />

            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              9. Contato
            </h2>
            <p className="text-gray-300 mb-4">
              Se você tiver alguma dúvida sobre estes Termos de Uso, entre em contato conosco:
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
	                      <a href="https://t.me/roboroleta_suporte" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
	                        https://t.me/roboroleta_suporte
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
              FIM DOS TERMOS DE USO
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
