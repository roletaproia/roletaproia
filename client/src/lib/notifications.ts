/**
 * Serviço de Notificações Push
 * Gerencia permissões e envio de notificações do navegador
 */

export type NotificationType = 'new_signal' | 'high_confidence' | 'pattern_detected' | 'stop_loss' | 'stop_win';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  requireInteraction?: boolean;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private enabled: boolean = false;

  constructor() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
      this.enabled = this.permission === 'granted';
    }
  }

  /**
   * Verifica se as notificações são suportadas pelo navegador
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Verifica se as notificações estão habilitadas
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Solicita permissão para enviar notificações
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.warn('Notificações não são suportadas neste navegador');
      return false;
    }

    if (this.permission === 'granted') {
      this.enabled = true;
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      this.enabled = permission === 'granted';
      
      if (this.enabled) {
        // Salvar preferência no localStorage
        localStorage.setItem('notifications_enabled', 'true');
      }
      
      return this.enabled;
    } catch (error) {
      console.error('Erro ao solicitar permissão de notificação:', error);
      return false;
    }
  }

  /**
   * Envia uma notificação
   */
  async send(options: NotificationOptions): Promise<void> {
    if (!this.isEnabled()) {
      console.warn('Notificações não estão habilitadas');
      return;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/logo.png',
        badge: options.badge || '/logo.png',
        tag: options.tag,
        data: options.data,
        requireInteraction: options.requireInteraction || false,
      });

      // Auto-fechar após 10 segundos se não for requireInteraction
      if (!options.requireInteraction) {
        setTimeout(() => notification.close(), 10000);
      }

      // Evento de clique na notificação
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Navegar para a página relevante se houver dados
        if (options.data?.url) {
          window.location.href = options.data.url;
        }
      };
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
    }
  }

  /**
   * Envia notificação de novo sinal
   */
  async notifyNewSignal(data: {
    number: number;
    color: string;
    confidence: number;
  }): Promise<void> {
    const colorEmoji = data.color === 'red' ? '🔴' : data.color === 'black' ? '⚫' : '🟢';
    
    await this.send({
      title: `${colorEmoji} Novo Sinal Gerado!`,
      body: `Número ${data.number} (${data.color}) - Confiança: ${data.confidence}%`,
      tag: 'new_signal',
      data: { url: '/live-signals' },
      requireInteraction: false,
    });
  }

  /**
   * Envia notificação de alta confiança
   */
  async notifyHighConfidence(data: {
    number: number;
    color: string;
    confidence: number;
    betType: string;
  }): Promise<void> {
    await this.send({
      title: '🔥 Sinal de Alta Confiança!',
      body: `${data.betType} - Número ${data.number} - ${data.confidence}% de confiança`,
      tag: 'high_confidence',
      data: { url: '/live-signals' },
      requireInteraction: true,
    });
  }

  /**
   * Envia notificação de padrão detectado
   */
  async notifyPatternDetected(pattern: string): Promise<void> {
    await this.send({
      title: '📊 Padrão Detectado!',
      body: pattern,
      tag: 'pattern_detected',
      data: { url: '/live-signals' },
      requireInteraction: false,
    });
  }

  /**
   * Envia notificação de stop-loss atingido
   */
  async notifyStopLoss(amount: number): Promise<void> {
    await this.send({
      title: '🚨 Stop-Loss Atingido!',
      body: `Você atingiu seu limite de perda: R$ ${amount.toFixed(2)}. Considere parar de jogar.`,
      tag: 'stop_loss',
      data: { url: '/bankroll' },
      requireInteraction: true,
    });
  }

  /**
   * Envia notificação de stop-win atingido
   */
  async notifyStopWin(amount: number): Promise<void> {
    await this.send({
      title: '🎉 Stop-Win Atingido!',
      body: `Parabéns! Você atingiu sua meta de ganho: R$ ${amount.toFixed(2)}. Considere retirar o lucro.`,
      tag: 'stop_win',
      data: { url: '/bankroll' },
      requireInteraction: true,
    });
  }

  /**
   * Desabilita as notificações
   */
  disable(): void {
    this.enabled = false;
    localStorage.setItem('notifications_enabled', 'false');
  }

  /**
   * Habilita as notificações (se já tiver permissão)
   */
  enable(): void {
    if (this.permission === 'granted') {
      this.enabled = true;
      localStorage.setItem('notifications_enabled', 'true');
    }
  }

  /**
   * Verifica se o usuário já configurou as notificações
   */
  hasConfigured(): boolean {
    return localStorage.getItem('notifications_enabled') !== null;
  }

  /**
   * Obtém a preferência salva do usuário
   */
  getSavedPreference(): boolean {
    return localStorage.getItem('notifications_enabled') === 'true';
  }
}

// Exportar instância singleton
export const notificationService = new NotificationService();

// Hook React para usar o serviço de notificações
export function useNotifications() {
  const [isSupported] = useState(notificationService.isSupported());
  const [isEnabled, setIsEnabled] = useState(notificationService.isEnabled());
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationService.isSupported() ? Notification.permission : 'denied'
  );

  const requestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setIsEnabled(granted);
    setPermission(Notification.permission);
    return granted;
  };

  const enable = () => {
    notificationService.enable();
    setIsEnabled(true);
  };

  const disable = () => {
    notificationService.disable();
    setIsEnabled(false);
  };

  return {
    isSupported,
    isEnabled,
    permission,
    requestPermission,
    enable,
    disable,
    notifyNewSignal: notificationService.notifyNewSignal.bind(notificationService),
    notifyHighConfidence: notificationService.notifyHighConfidence.bind(notificationService),
    notifyPatternDetected: notificationService.notifyPatternDetected.bind(notificationService),
    notifyStopLoss: notificationService.notifyStopLoss.bind(notificationService),
    notifyStopWin: notificationService.notifyStopWin.bind(notificationService),
  };
}

// Adicionar import do useState
import { useState } from 'react';
