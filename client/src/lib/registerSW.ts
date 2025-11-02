/**
 * Registro do Service Worker para PWA
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Verificar se Service Workers são suportados
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers não são suportados neste navegador');
    return null;
  }

  try {
    // Registrar Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    console.log('Service Worker registrado com sucesso:', registration.scope);

    // Verificar atualizações
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nova versão disponível
            console.log('Nova versão disponível! Recarregue a página para atualizar.');
            
            // Mostrar notificação ao usuário (opcional)
            if (window.confirm('Nova versão disponível! Deseja atualizar agora?')) {
              window.location.reload();
            }
          }
        });
      }
    });

    // Verificar atualizações periodicamente (a cada hora)
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);

    return registration;
  } catch (error) {
    console.error('Erro ao registrar Service Worker:', error);
    return null;
  }
}

/**
 * Desregistra o Service Worker
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const success = await registration.unregister();
    
    if (success) {
      console.log('Service Worker desregistrado com sucesso');
    }
    
    return success;
  } catch (error) {
    console.error('Erro ao desregistrar Service Worker:', error);
    return false;
  }
}

/**
 * Verifica se o app está rodando em modo standalone (instalado)
 */
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/**
 * Verifica se o app pode ser instalado
 */
export function canInstall(): boolean {
  return 'BeforeInstallPromptEvent' in window;
}

/**
 * Prompt de instalação do PWA
 */
let deferredPrompt: any = null;

export function setupInstallPrompt(callback?: (canInstall: boolean) => void): void {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir o prompt automático
    e.preventDefault();
    
    // Guardar o evento para usar depois
    deferredPrompt = e;
    
    // Notificar que o app pode ser instalado
    if (callback) {
      callback(true);
    }
    
    console.log('App pode ser instalado');
  });

  window.addEventListener('appinstalled', () => {
    console.log('App instalado com sucesso');
    deferredPrompt = null;
    
    if (callback) {
      callback(false);
    }
  });
}

/**
 * Mostra o prompt de instalação
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn('Prompt de instalação não está disponível');
    return false;
  }

  try {
    // Mostrar o prompt
    deferredPrompt.prompt();

    // Aguardar escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} instalar o app`);

    // Limpar o prompt
    deferredPrompt = null;

    return outcome === 'accepted';
  } catch (error) {
    console.error('Erro ao mostrar prompt de instalação:', error);
    return false;
  }
}
