import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Chrome, Gift, ExternalLink, CheckCircle, AlertCircle, Smartphone } from "lucide-react";

export default function ExtensionDownload() {
  const downloadExtension = () => {
    window.location.href = '/api/download/extension';
  };

  const open1winRegister = () => {
    window.open('https://1wyvrz.life/?open=register&p=f5q8', '_blank');
  };

  const open1winRoulette = () => {
    window.open('https://1whfxh.life/casino/play/v_evolution:RoletaAoVivo', '_blank');
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Chrome className="w-20 h-20 mx-auto mb-4 text-blue-400" />
          <h1 className="text-4xl font-bold mb-3 text-yellow-400">
            📥 Download da Extensão Chrome
          </h1>
          <p className="text-xl text-gray-300">
            Baixe e instale a extensão para usar o Robô Automático
          </p>
        </div>

        {/* Banner 1win */}
        <Alert className="mb-8 bg-gradient-to-r from-yellow-900/40 to-red-900/40 border-yellow-600">
          <Gift className="h-6 w-6 text-yellow-400" />
          <AlertTitle className="text-yellow-400 text-xl font-bold">
            🎁 Cadastre-se na 1win Primeiro!
          </AlertTitle>
          <AlertDescription className="text-gray-200 mb-4">
            A extensão funciona exclusivamente com a <strong className="text-yellow-400">Roleta Brasileira da 1win</strong>. 
            Crie sua conta agora e ganhe <strong className="text-green-400">bônus de boas-vindas</strong>!
          </AlertDescription>
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={open1winRegister}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
            >
              <Gift className="mr-2 h-4 w-4" />
              Criar Conta na 1win (Com Bônus)
            </Button>
            <Button 
              onClick={open1winRoulette}
              variant="outline"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Abrir Roleta Brasileira
            </Button>
          </div>
        </Alert>

        {/* Download Button */}
        <Card className="mb-8 bg-gradient-to-br from-blue-900/30 to-blue-950/50 border-blue-600">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-400 text-center">
              📦 Baixar Extensão
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-300 mb-6">
              Clique no botão abaixo para baixar o arquivo ZIP da extensão.
            </p>
            <Button
              onClick={downloadExtension}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 text-lg"
            >
              <Download className="mr-2 h-6 w-6" />
              Baixar roletapro-extension.zip
            </Button>
            <p className="text-sm text-gray-400 mt-4">
              Tamanho: ~14 KB | Versão: 1.0.0
            </p>
          </CardContent>
        </Card>

        {/* Instruções Desktop */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-400 flex items-center gap-2">
              <Chrome className="w-6 h-6" />
              Instalação no Chrome (Desktop)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Baixe o arquivo ZIP</p>
                  <p className="text-gray-400 text-sm">
                    Clique no botão "Baixar" acima e salve o arquivo no seu computador.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Extraia o arquivo ZIP</p>
                  <p className="text-gray-400 text-sm">
                    Clique com o botão direito no arquivo baixado e selecione "Extrair aqui" ou "Extrair tudo".
                    Você terá uma pasta chamada <code className="bg-gray-700 px-1 rounded">chrome-extension</code>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Abra o Chrome</p>
                  <p className="text-gray-400 text-sm">
                    Abra o navegador Google Chrome no seu computador.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Acesse as Extensões</p>
                  <p className="text-gray-400 text-sm mb-2">
                    Digite na barra de endereço:
                  </p>
                  <code className="bg-gray-700 px-3 py-2 rounded block text-yellow-400">
                    chrome://extensions/
                  </code>
                  <p className="text-gray-400 text-sm mt-2">
                    Ou vá em Menu (⋮) → Mais ferramentas → Extensões
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Ative o Modo do Desenvolvedor</p>
                  <p className="text-gray-400 text-sm">
                    No canto superior direito da página de extensões, ative a chave "Modo do desenvolvedor".
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  6
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Carregue a Extensão</p>
                  <p className="text-gray-400 text-sm mb-2">
                    Clique no botão "Carregar sem compactação" que apareceu no topo.
                  </p>
                  <p className="text-gray-400 text-sm">
                    Selecione a pasta <code className="bg-gray-700 px-1 rounded">chrome-extension</code> que você extraiu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Pronto!</p>
                  <p className="text-gray-400 text-sm">
                    A extensão "Roleta Pro I.A. - Bot Automático" aparecerá na lista de extensões instaladas.
                    Agora você pode usar o Robô Automático!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instruções Mobile */}
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-purple-400 flex items-center gap-2">
              <Smartphone className="w-6 h-6" />
              Instalação no Yandex Browser (Mobile)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-purple-900/30 border-purple-600">
              <AlertCircle className="h-5 w-5 text-purple-400" />
              <AlertTitle className="text-purple-400 font-bold">Atenção</AlertTitle>
              <AlertDescription className="text-gray-200">
                No celular, a extensão funciona apenas no <strong>Yandex Browser</strong>, 
                pois o Chrome mobile não suporta extensões.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Instale o Yandex Browser</p>
                  <p className="text-gray-400 text-sm">
                    Baixe o Yandex Browser na Play Store (Android) ou App Store (iOS).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Baixe a extensão</p>
                  <p className="text-gray-400 text-sm">
                    Use o botão de download acima para baixar o ZIP no celular.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Extraia e instale</p>
                  <p className="text-gray-400 text-sm">
                    Use um app de arquivos para extrair o ZIP e siga os mesmos passos do Chrome desktop 
                    (Yandex → Extensões → Modo desenvolvedor → Carregar).
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <Card className="mb-8 bg-gradient-to-br from-green-900/30 to-green-950/50 border-green-600">
          <CardHeader>
            <CardTitle className="text-2xl text-green-400">
              ✅ Após Instalar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold mb-1">1. Abra a Roleta da 1win</p>
                <p className="text-gray-400 text-sm">
                  Acesse a Roleta Brasileira da 1win em uma nova aba.
                </p>
                <Button 
                  onClick={open1winRoulette}
                  size="sm"
                  className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-black"
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Abrir Roleta
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold mb-1">2. Configure o Robô</p>
                <p className="text-gray-400 text-sm">
                  Volte ao Roleta Pro I.A. e vá em "Robô de Apostas" → "Modo Automático" para configurar suas estratégias.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-white font-semibold mb-1">3. Comece a Apostar!</p>
                <p className="text-gray-400 text-sm">
                  O robô começará a analisar os números e fazer apostas automaticamente conforme sua configuração.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl text-yellow-400">
              ❓ Perguntas Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-white font-semibold mb-2">
                Por que preciso ativar o "Modo do desenvolvedor"?
              </p>
              <p className="text-gray-400 text-sm">
                Extensões não publicadas na Chrome Web Store precisam do modo desenvolvedor ativado para serem instaladas. 
                É totalmente seguro e não afeta o funcionamento do navegador.
              </p>
            </div>

            <div>
              <p className="text-white font-semibold mb-2">
                A extensão funciona em outros navegadores?
              </p>
              <p className="text-gray-400 text-sm">
                Sim! Funciona em qualquer navegador baseado em Chromium: Chrome, Edge, Brave, Opera, Vivaldi, etc. 
                No celular, apenas o Yandex Browser suporta extensões.
              </p>
            </div>

            <div>
              <p className="text-white font-semibold mb-2">
                É seguro usar a extensão?
              </p>
              <p className="text-gray-400 text-sm">
                Sim! A extensão é open source e você pode verificar o código no GitHub. 
                Ela apenas lê os números da roleta e envia comandos de aposta, sem acessar dados pessoais.
              </p>
            </div>

            <div>
              <p className="text-white font-semibold mb-2">
                Preciso deixar a extensão sempre ativada?
              </p>
              <p className="text-gray-400 text-sm">
                Sim, para usar o Robô Automático. Mas você pode desativar quando não estiver usando. 
                Para o Modo Manual, a extensão não é necessária.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

