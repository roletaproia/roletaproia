import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download, Smartphone, Monitor, Chrome, ExternalLink, CheckCircle } from "lucide-react";
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Como Instalar a Extensao Roleta Pro I.A.
        </h1>
        <p className="text-gray-400">
          Guia completo para {isMobile ? 'celular (Android)' : 'computador (Desktop)'}
        </p>
      </div>

      {/* Alerta de dispositivo detectado */}
      <Alert className={`mb-6 ${isMobile ? 'bg-blue-900/20 border-blue-700/50' : 'bg-green-900/20 border-green-700/50'}`}>
        <div className="flex items-center gap-2">
          {isMobile ? <Smartphone className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
          <AlertTitle>Dispositivo Detectado</AlertTitle>
        </div>
        <AlertDescription>
          Voce esta usando um {isMobile ? 'celular/tablet' : 'computador'}. 
          Siga as instrucoes abaixo para seu dispositivo.
        </AlertDescription>
      </Alert>

      {/* Banner 1win */}
      <Alert className="mb-6 bg-gradient-to-r from-yellow-900/30 to-red-900/30 border-yellow-600/50">
        <AlertTitle className="text-yellow-400 text-lg font-bold mb-2">
          Nao tem conta na 1win?
        </AlertTitle>
        <AlertDescription>
          <p className="text-gray-200 mb-3">
            O robo funciona exclusivamente com a <strong className="text-yellow-400">Roleta Brasileira da 1win</strong>.
            Crie sua conta agora e ganhe <strong className="text-green-400">bonus de boas-vindas</strong>!
          </p>
          <div className="flex gap-2">
            <Button
              onClick={open1winRegister}
              className="bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-bold"
            >
              Criar Conta na 1win (Com Bonus)
            </Button>
            <Button
              onClick={open1winRoulette}
              variant="outline"
              className="border-yellow-600 text-yellow-400 hover:bg-yellow-900/20"
            >
              Abrir Roleta Brasileira
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Instrucoes Desktop */}
      {!isMobile && (
        <Card className="mb-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Monitor className="h-6 w-6 text-blue-400" />
              <CardTitle className="text-white">Instrucoes para Desktop (PC/Mac)</CardTitle>
            </div>
            <CardDescription>Google Chrome ou Microsoft Edge</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Passo 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Baixar a Extensao</h3>
                <p className="text-gray-400 mb-3">
                  Clique no botao abaixo para baixar o arquivo ZIP da extensao.
                </p>
                <Button onClick={downloadExtension} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Extensao (ZIP)
                </Button>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Extrair o Arquivo</h3>
                <p className="text-gray-400">
                  Clique com o botao direito no arquivo ZIP baixado e selecione "Extrair aqui" ou "Extrair tudo".
                  Voce tera uma pasta chamada <code className="bg-slate-700 px-2 py-1 rounded">chrome-extension</code>.
                </p>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Abrir Extensoes do Chrome</h3>
                <p className="text-gray-400 mb-2">
                  No Google Chrome, digite na barra de endereco:
                </p>
                <code className="block bg-slate-700 px-4 py-2 rounded text-green-400">
                  chrome://extensions/
                </code>
                <p className="text-gray-400 mt-2 text-sm">
                  Ou va em Menu (3 pontinhos) → Mais ferramentas → Extensoes
                </p>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Ativar Modo Desenvolvedor</h3>
                <p className="text-gray-400">
                  No canto superior direito da pagina de extensoes, ative o botao "Modo do desenvolvedor".
                </p>
              </div>
            </div>

            {/* Passo 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Carregar Extensao</h3>
                <p className="text-gray-400">
                  Clique em "Carregar sem compactacao" e selecione a pasta <code className="bg-slate-700 px-2 py-1 rounded">chrome-extension</code> que voce extraiu.
                </p>
              </div>
            </div>

            {/* Passo 6 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Pronto!</h3>
                <p className="text-gray-400 mb-3">
                  A extensao Roleta Pro I.A. foi instalada! Voce vera o icone na barra de ferramentas.
                </p>
                <Button onClick={() => window.location.href = '/betting-robot'} className="bg-green-600 hover:bg-green-700">
                  Ir para o Robo de Apostas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instrucoes Mobile */}
      {isMobile && (
        <Card className="mb-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Smartphone className="h-6 w-6 text-blue-400" />
              <CardTitle className="text-white">Instrucoes para Celular (Android)</CardTitle>
            </div>
            <CardDescription>Yandex Browser - Suporta extensoes Chrome</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Passo 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Instalar Yandex Browser</h3>
                <p className="text-gray-400 mb-3">
                  O Yandex Browser e o unico navegador Android que suporta extensoes Chrome.
                  Baixe gratuitamente na Play Store.
                </p>
                <Button onClick={openYandexStore} className="bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Baixar Yandex Browser
                </Button>
              </div>
            </div>

            {/* Passo 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Baixar a Extensao</h3>
                <p className="text-gray-400 mb-3">
                  Clique no botao abaixo para baixar o arquivo ZIP da extensao.
                </p>
                <Button onClick={downloadExtension} className="bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Extensao (ZIP)
                </Button>
              </div>
            </div>

            {/* Passo 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Extrair o Arquivo</h3>
                <p className="text-gray-400">
                  Use um app de arquivos (como "Arquivos" do Google) para extrair o ZIP.
                  Voce tera uma pasta chamada <code className="bg-slate-700 px-2 py-1 rounded">chrome-extension</code>.
                </p>
              </div>
            </div>

            {/* Passo 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Abrir Extensoes no Yandex</h3>
                <p className="text-gray-400 mb-2">
                  No Yandex Browser, digite na barra de endereco:
                </p>
                <code className="block bg-slate-700 px-4 py-2 rounded text-green-400">
                  browser://extensions/
                </code>
                <p className="text-gray-400 mt-2 text-sm">
                  Ou va em Menu (3 linhas) → Extensoes
                </p>
              </div>
            </div>

            {/* Passo 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                5
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Ativar Modo Desenvolvedor</h3>
                <p className="text-gray-400">
                  Ative o botao "Modo do desenvolvedor" no topo da pagina.
                </p>
              </div>
            </div>

            {/* Passo 6 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                6
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Carregar Extensao</h3>
                <p className="text-gray-400">
                  Toque em "Carregar extensao descompactada" e selecione a pasta <code className="bg-slate-700 px-2 py-1 rounded">chrome-extension</code>.
                </p>
              </div>
            </div>

            {/* Passo 7 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">Pronto!</h3>
                <p className="text-gray-400 mb-3">
                  A extensao Roleta Pro I.A. foi instalada no Yandex Browser!
                </p>
                <Button onClick={() => window.location.href = '/betting-robot'} className="bg-green-600 hover:bg-green-700">
                  Ir para o Robo de Apostas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proximos Passos */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-transparent border-purple-700/30">
        <CardHeader>
          <CardTitle className="text-white">Proximos Passos</CardTitle>
          <CardDescription>Depois de instalar a extensao</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">1. Criar conta na 1win</p>
              <p className="text-gray-400 text-sm">Se ainda nao tem, clique no botao amarelo acima</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">2. Abrir Roleta Brasileira</p>
              <p className="text-gray-400 text-sm">Acesse o jogo Evolution Gaming na 1win</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">3. Configurar estrategia</p>
              <p className="text-gray-400 text-sm">Va em Estrategias e crie sua estrategia de apostas</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">4. Iniciar robo</p>
              <p className="text-gray-400 text-sm">Va em Robo de Apostas e inicie o modo simulacao</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Suporte */}
      <Alert className="mt-6 bg-slate-900/50 border-slate-700">
        <AlertTitle>Precisa de Ajuda?</AlertTitle>
        <AlertDescription>
          <p className="text-gray-400 mb-2">
            Se tiver alguma duvida, entre em contato pelo chat do sistema ou visite nossa documentacao completa.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/chat'}>
            Ir para o Chat
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

