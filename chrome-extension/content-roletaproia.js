/**
 * Content Script para Roleta Pro I.A.
 * Comunica com a página do robô e envia comandos para a 1win
 */

console.log('[Roleta Pro I.A.] Extensão carregada no Roleta Pro I.A.!');

// Injetar script na página para acessar variáveis do React
function injectPageScript() {
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      console.log('[Roleta Pro I.A.] Script injetado na página!');
      
      // Criar canal de comunicação com a extensão
      window.roletaProExtension = {
        isInstalled: true,
        version: '1.0.0',
        
        // Enviar comando para a extensão
        sendCommand: function(command, data) {
          window.postMessage({
            source: 'roletaproia-page',
            type: command,
            data: data
          }, '*');
        },
        
        // Iniciar monitoramento
        startMonitoring: function() {
          this.sendCommand('START_MONITORING', {});
        },
        
        // Parar monitoramento
        stopMonitoring: function() {
          this.sendCommand('STOP_MONITORING', {});
        },
        
        // Executar aposta
        placeBet: function(betData) {
          this.sendCommand('PLACE_BET', betData);
        },
        
        // Obter status
        getStatus: function() {
          return new Promise((resolve) => {
            const handler = (event) => {
              if (event.data.source === 'roletaproia-extension' && event.data.type === 'STATUS_RESPONSE') {
                window.removeEventListener('message', handler);
                resolve(event.data.data);
              }
            };
            window.addEventListener('message', handler);
            this.sendCommand('GET_STATUS', {});
          });
        }
      };
      
      // Notificar que a extensão está pronta
      window.dispatchEvent(new CustomEvent('roletaproia-extension-ready'));
    })();
  `;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

// Escutar mensagens da página
window.addEventListener('message', (event) => {
  if (event.data.source === 'roletaproia-page') {
    console.log('[Roleta Pro I.A.] Mensagem da página:', event.data);
    
    // Repassar para o background script
    chrome.runtime.sendMessage({
      type: event.data.type,
      data: event.data.data
    }, (response) => {
      // Enviar resposta de volta para a página
      window.postMessage({
        source: 'roletaproia-extension',
        type: event.data.type + '_RESPONSE',
        data: response
      }, '*');
    });
  }
});

// Escutar mensagens do background (números novos da 1win)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Roleta Pro I.A.] Mensagem do background:', message);
  
  if (message.type === 'NEW_NUMBER') {
    // Enviar para a página
    window.postMessage({
      source: 'roletaproia-extension',
      type: 'NEW_NUMBER',
      data: message.data
    }, '*');
  }
  
  sendResponse({ received: true });
});

// Injetar script
injectPageScript();

console.log('[Roleta Pro I.A.] Comunicação estabelecida!');

