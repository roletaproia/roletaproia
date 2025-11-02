import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, BellOff, CheckCircle, AlertTriangle } from "lucide-react";
import { useNotifications } from "@/lib/notifications";
import { toast } from "sonner";

export default function NotificationSettings() {
  const {
    isSupported,
    isEnabled,
    permission,
    requestPermission,
    enable,
    disable,
    notifyNewSignal,
  } = useNotifications();

  const [notifyNewSignals, setNotifyNewSignals] = useState(true);
  const [notifyHighConfidence, setNotifyHighConfidence] = useState(true);
  const [notifyPatterns, setNotifyPatterns] = useState(true);
  const [notifyStopLoss, setNotifyStopLoss] = useState(true);
  const [notifyStopWin, setNotifyStopWin] = useState(true);

  // Carregar preferências do localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('notification_preferences');
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setNotifyNewSignals(prefs.newSignals ?? true);
      setNotifyHighConfidence(prefs.highConfidence ?? true);
      setNotifyPatterns(prefs.patterns ?? true);
      setNotifyStopLoss(prefs.stopLoss ?? true);
      setNotifyStopWin(prefs.stopWin ?? true);
    }
  }, []);

  // Salvar preferências no localStorage
  const savePreferences = () => {
    const prefs = {
      newSignals: notifyNewSignals,
      highConfidence: notifyHighConfidence,
      patterns: notifyPatterns,
      stopLoss: notifyStopLoss,
      stopWin: notifyStopWin,
    };
    localStorage.setItem('notification_preferences', JSON.stringify(prefs));
  };

  useEffect(() => {
    savePreferences();
  }, [notifyNewSignals, notifyHighConfidence, notifyPatterns, notifyStopLoss, notifyStopWin]);

  const handleEnableNotifications = async () => {
    if (permission === 'denied') {
      toast.error('Notificações bloqueadas', {
        description: 'Você bloqueou as notificações. Habilite-as nas configurações do navegador.',
      });
      return;
    }

    if (permission === 'default') {
      const granted = await requestPermission();
      if (granted) {
        toast.success('Notificações habilitadas!', {
          description: 'Você receberá alertas sobre novos sinais e recomendações.',
        });
        // Enviar notificação de teste
        setTimeout(() => {
          notifyNewSignal({
            number: 17,
            color: 'red',
            confidence: 75,
          });
        }, 1000);
      } else {
        toast.error('Permissão negada', {
          description: 'Você negou a permissão para notificações.',
        });
      }
    } else {
      enable();
      toast.success('Notificações habilitadas!');
    }
  };

  const handleDisableNotifications = () => {
    disable();
    toast.info('Notificações desabilitadas');
  };

  if (!isSupported) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BellOff className="h-5 w-5 text-gray-500" />
            Notificações Não Suportadas
          </CardTitle>
          <CardDescription>
            Seu navegador não suporta notificações push.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-500" />
          Notificações Push
        </CardTitle>
        <CardDescription>
          Receba alertas sobre novos sinais e recomendações importantes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Status das Notificações */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3">
            {isEnabled ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            )}
            <div>
              <div className="font-medium text-white">
                {isEnabled ? 'Notificações Ativadas' : 'Notificações Desativadas'}
              </div>
              <div className="text-sm text-gray-400">
                {isEnabled
                  ? 'Você receberá alertas em tempo real'
                  : 'Habilite para receber alertas'}
              </div>
            </div>
          </div>
          {isEnabled ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisableNotifications}
              className="border-red-700 text-red-400 hover:bg-red-900/20"
            >
              Desativar
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleEnableNotifications}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Ativar
            </Button>
          )}
        </div>

        {/* Configurações de Notificações */}
        {isEnabled && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Tipos de Notificações</h4>
            
            <div className="space-y-3">
              {/* Novos Sinais */}
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="notify-signals" className="text-white cursor-pointer">
                    Novos Sinais
                  </Label>
                  <p className="text-xs text-gray-400 mt-1">
                    Notificar quando um novo sinal for gerado
                  </p>
                </div>
                <Switch
                  id="notify-signals"
                  checked={notifyNewSignals}
                  onCheckedChange={setNotifyNewSignals}
                />
              </div>

              {/* Alta Confiança */}
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="notify-confidence" className="text-white cursor-pointer">
                    Alta Confiança (≥80%)
                  </Label>
                  <p className="text-xs text-gray-400 mt-1">
                    Alertas especiais para sinais de alta confiança
                  </p>
                </div>
                <Switch
                  id="notify-confidence"
                  checked={notifyHighConfidence}
                  onCheckedChange={setNotifyHighConfidence}
                />
              </div>

              {/* Padrões Detectados */}
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="notify-patterns" className="text-white cursor-pointer">
                    Padrões Detectados
                  </Label>
                  <p className="text-xs text-gray-400 mt-1">
                    Notificar sobre padrões estatísticos importantes
                  </p>
                </div>
                <Switch
                  id="notify-patterns"
                  checked={notifyPatterns}
                  onCheckedChange={setNotifyPatterns}
                />
              </div>

              {/* Stop-Loss */}
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="notify-stoploss" className="text-white cursor-pointer">
                    Alerta de Stop-Loss
                  </Label>
                  <p className="text-xs text-gray-400 mt-1">
                    Avisar quando atingir o limite de perda
                  </p>
                </div>
                <Switch
                  id="notify-stoploss"
                  checked={notifyStopLoss}
                  onCheckedChange={setNotifyStopLoss}
                />
              </div>

              {/* Stop-Win */}
              <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="notify-stopwin" className="text-white cursor-pointer">
                    Alerta de Stop-Win
                  </Label>
                  <p className="text-xs text-gray-400 mt-1">
                    Avisar quando atingir a meta de ganho
                  </p>
                </div>
                <Switch
                  id="notify-stopwin"
                  checked={notifyStopWin}
                  onCheckedChange={setNotifyStopWin}
                />
              </div>
            </div>
          </div>
        )}

        {/* Informação sobre Permissões */}
        {permission === 'denied' && (
          <div className="p-4 bg-red-900/20 border border-red-700 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="text-sm text-red-300">
                <p className="font-medium mb-1">Notificações Bloqueadas</p>
                <p className="text-red-400">
                  Você bloqueou as notificações para este site. Para reativar:
                </p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-red-400">
                  <li>Clique no ícone de cadeado na barra de endereço</li>
                  <li>Encontre "Notificações" nas permissões</li>
                  <li>Altere para "Permitir"</li>
                  <li>Recarregue a página</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
