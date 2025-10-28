import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Smartphone, Monitor, Chrome, ExternalLink, CheckCircle, AlertCircle, Gift, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function ExtensionGuide() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  const downloadExtension = () => {
    window.open('/roletapro-extension.zip', '_blank');
  };

  const openYandexStore = () => {
    window.open('https://play.google.com/store/apps/details?id=com.yandex.browser', '_blank');
  };

  const open1winRegister = () => {
    window.open('https://1wyvrz.life/?open=register&p=f5q8', '_blank');
  };

  const open1winRoulette = () => {
    window.open('https://1whfxh.life/casino/play/v_evolution:RoletaAoVivo', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-3">
            📦 Como Instalar a Extensão
          </h1>
          <p className="text-xl text-gray-300">
            Guia completo para {isMobile ? '📱 Celular (Android)' : '💻 Computador (Desktop)'}
          </p>
        </div>

        {/* Alerta de dispositivo detectado */}
        <Alert className={`mb-6 ${isMobile ? 'bg-blue-900/30 border-blue-600' : 'bg-green-900/30 border-green-600'}`}>
          <div className="flex items-center gap-3">
            {isMobile ? <Smartphone className="h-6 w-6 text-blue-400" /> : <Monitor className="h-6 w-6 text-green-400" />}
            <div>
              <AlertTitle className="text-white text-lg font-bold">✅ Dispositivo Detectado</AlertTitle>
              <AlertDescription className="text-gray-200">
                Você está usando um {isMobile ? 'celular Android' : 'computador'}. Siga as instruções abaixo para seu dispositivo.
              </AlertDescription>
            </div>
          </div>
        </Alert>

        {/* Banner 1win */}
        <Alert className="mb-8 bg-gradient-to-r from-yellow-900/40 to-red-900/40 border-yellow-600">
          <Gift className="h-6 w-6 text-yellow-400" />
          <AlertTitle className="text-yellow-400 text-xl font-bold">🎁 Não tem conta na 1win?</AlertTitle>
          <AlertDescription className="text-gray-200 mb-4">
            O robô funciona exclusivamente com a <strong className="text-yellow-400">Roleta Brasileira da 1win</strong>. 
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

        {/* Instruções Desktop */}
        {!isMobile && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="h-8 w-8 text-blue-400" />
              <h2 className="text-2xl font-bold text-blue-400">Instruções para Desktop (PC/Mac)</h2>
            </div>
            <p className="text-gray-300 mb-6 flex items-center gap-2">
              <Chrome className="h-5 w-5" />
              Google Chrome ou Microsoft Edge
            </p>

            <div className="space-y-6">
              {/* Passo 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Baixar a Extensão</h3>
                  <p className="text-gray-300 mb-3">
                    Clique no botão abaixo para baixar o arquivo ZIP da extensão.
                  </p>
                  <Button 
                    onClick={downloadExtension}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Extensão (ZIP)
                  </Button>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Extrair o Arquivo</h3>
                  <p className="text-gray-300">
                    Clique com o botão direito no arquivo ZIP baixado e selecione <strong className="text-yellow-400">"Extrair aqui"</strong> ou <strong className="text-yellow-400">"Extrair tudo"</strong>. 
                    Você terá uma pasta chamada <code className="bg-slate-800 px-2 py-1 rounded text-green-400">chrome-extension</code>.
                  </p>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Abrir Extensões do Chrome</h3>
                  <p className="text-gray-300 mb-2">
                    No Google Chrome, digite na barra de endereço:
                  </p>
                  <code className="block bg-slate-800 px-4 py-3 rounded text-green-400 font-mono mb-2">
                    chrome://extensions/
                  </code>
                  <p className="text-gray-400 text-sm">
                    Ou vá em Menu (⋮) → Mais ferramentas → Extensões
                  </p>
                </div>
              </div>

              {/* Passo 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Ativar Modo Desenvolvedor</h3>
                  <p className="text-gray-300">
                    No canto superior direito da página de extensões, ative o botão <strong className="text-yellow-400">"Modo do desenvolvedor"</strong>.
                  </p>
                </div>
              </div>

              {/* Passo 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Carregar Extensão</h3>
                  <p className="text-gray-300">
                    Clique em <strong className="text-yellow-400">"Carregar sem compactação"</strong> e selecione a pasta <code className="bg-slate-800 px-2 py-1 rounded text-green-400">chrome-extension</code> que você extraiu.
                  </p>
                </div>
              </div>

              {/* Sucesso */}
              <Alert className="bg-green-900/30 border-green-600">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <AlertTitle className="text-green-400 text-lg font-bold">✅ Pronto!</AlertTitle>
                <AlertDescription className="text-gray-200">
                  A extensão Roleta Pro I.A. foi instalada! Você verá o ícone na barra de ferramentas.
                </AlertDescription>
              </Alert>
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={() => window.location.href = '/betting-robot'}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold text-lg px-8 py-6"
              >
                <Zap className="mr-2 h-5 w-5" />
                Ir para o Robô de Apostas
              </Button>
            </div>
          </div>
        )}

        {/* Instruções Mobile */}
        {isMobile && (
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Smartphone className="h-8 w-8 text-blue-400" />
              <h2 className="text-2xl font-bold text-blue-400">Instruções para Mobile (Android)</h2>
            </div>
            <p className="text-gray-300 mb-6">
              ⚠️ Chrome Mobile não suporta extensões. Use o <strong className="text-yellow-400">Yandex Browser</strong>!
            </p>

            <div className="space-y-6">
              {/* Passo 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Instalar Yandex Browser</h3>
                  <p className="text-gray-300 mb-3">
                    Baixe o Yandex Browser da Play Store (único navegador Android que suporta extensões Chrome).
                  </p>
                  <Button 
                    onClick={openYandexStore}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Yandex Browser
                  </Button>
                </div>
              </div>

              {/* Passo 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Baixar a Extensão</h3>
                  <p className="text-gray-300 mb-3">
                    Abra o Yandex Browser e baixe o arquivo ZIP da extensão.
                  </p>
                  <Button 
                    onClick={downloadExtension}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Extensão (ZIP)
                  </Button>
                </div>
              </div>

              {/* Passo 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Extrair o Arquivo</h3>
                  <p className="text-gray-300">
                    Use um app de arquivos (como <strong className="text-yellow-400">ZArchiver</strong>) para extrair o ZIP. 
                    Você terá uma pasta <code className="bg-slate-800 px-2 py-1 rounded text-green-400">chrome-extension</code>.
                  </p>
                </div>
              </div>

              {/* Passo 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Abrir Extensões no Yandex</h3>
                  <p className="text-gray-300 mb-2">
                    No Yandex Browser, digite na barra de endereço:
                  </p>
                  <code className="block bg-slate-800 px-4 py-3 rounded text-green-400 font-mono">
                    browser://extensions/
                  </code>
                </div>
              </div>

              {/* Passo 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Ativar Modo Desenvolvedor</h3>
                  <p className="text-gray-300">
                    Ative o botão <strong className="text-yellow-400">"Modo do desenvolvedor"</strong> no topo da página.
                  </p>
                </div>
              </div>

              {/* Passo 6 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  6
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Carregar Extensão</h3>
                  <p className="text-gray-300">
                    Toque em <strong className="text-yellow-400">"Carregar extensão descompactada"</strong> e selecione a pasta <code className="bg-slate-800 px-2 py-1 rounded text-green-400">chrome-extension</code>.
                  </p>
                </div>
              </div>

              {/* Sucesso */}
              <Alert className="bg-green-900/30 border-green-600">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <AlertTitle className="text-green-400 text-lg font-bold">✅ Pronto!</AlertTitle>
                <AlertDescription className="text-gray-200">
                  A extensão Roleta Pro I.A. foi instalada no seu celular!
                </AlertDescription>
              </Alert>
            </div>

            <div className="mt-6 text-center">
              <Button 
                onClick={() => window.location.href = '/betting-robot'}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold text-lg px-8 py-6"
              >
                <Zap className="mr-2 h-5 w-5" />
                Ir para o Robô de Apostas
              </Button>
            </div>
          </div>
        )}

        {/* Próximos Passos */}
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4">🚀 Próximos Passos</h2>
          <p className="text-gray-300 mb-4">Depois de instalar a extensão:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-black font-bold">1</div>
                <h3 className="font-bold text-white">Criar conta na 1win</h3>
              </div>
              <p className="text-gray-400 text-sm">Se ainda não tem, clique no botão amarelo acima</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-black font-bold">2</div>
                <h3 className="font-bold text-white">Abrir Roleta Brasileira</h3>
              </div>
              <p className="text-gray-400 text-sm">Acesse o jogo Evolution Gaming na 1win</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-black font-bold">3</div>
                <h3 className="font-bold text-white">Configurar estratégia</h3>
              </div>
              <p className="text-gray-400 text-sm">Vá em Estratégias e crie sua estratégia de apostas</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-black font-bold">4</div>
                <h3 className="font-bold text-white">Iniciar robô</h3>
              </div>
              <p className="text-gray-400 text-sm">Vá em Robô de Apostas e inicie o modo simulação</p>
            </div>
          </div>
        </div>

        {/* Ajuda */}
        <Alert className="mt-6 bg-blue-900/30 border-blue-600">
          <AlertCircle className="h-5 w-5 text-blue-400" />
          <AlertTitle className="text-blue-400 text-lg font-bold">💬 Precisa de Ajuda?</AlertTitle>
          <AlertDescription className="text-gray-200">
            Se tiver alguma dúvida, entre em contato pelo chat do sistema ou visite nossa documentação completa.
          </AlertDescription>
          <Button 
            onClick={() => window.location.href = '/chat'}
            variant="outline"
            className="mt-3 border-blue-600 text-blue-400 hover:bg-blue-900/20"
          >
            Ir para o Chat
          </Button>
        </Alert>
      </div>
    </div>
  );
}

