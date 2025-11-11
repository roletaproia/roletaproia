/**
 * Content Script para Plataforma de Apostas
 * Captura números da roleta Evolution e envia para o Roleta Pro I.A.
 */

console.log('[Roleta Pro I.A.] Extensão carregada na plataforma de apostas!');

// Estado da extensão
let isActive = false;
let lastNumber = null;
let numbersHistory = [];

// Configuração
const CONFIG = {
  API_URL: 'https://roletaproia.onrender.com',
  CHECK_INTERVAL: 1000, // Verificar a cada 1 segundo
  MAX_HISTORY: 50
};

/**
 * Detecta o número atual da roleta
 */
function detectCurrentNumber() {
  try {
    // Método 1: Procurar por elementos com o número
    const numberElements = document.querySelectorAll('[class*="number"], [class*="result"], [class*="winning"]');
    
    for (const el of numberElements) {
      const text = el.textContent.trim();
      const number = parseInt(text);
      
      if (!isNaN(number) && number >= 0 && number <= 36) {
        return number;
      }
    }
    
    // Método 2: Procurar no histórico visual
    const historyElements = document.querySelectorAll('[class*="history"] [class*="number"]');
    if (historyElements.length > 0) {
      const firstNumber = parseInt(historyElements[0].textContent.trim());
      if (!isNaN(firstNumber) && firstNumber >= 0 && firstNumber <= 36) {
        return firstNumber;
      }
    }
    
    return null;
  } catch (error) {
    console.error('[Roleta Pro I.A.] Erro ao detectar número:', error);
    return null;
  }
}

/**
 * Envia número para o backend
 */
async function sendNumberToBackend(number) {
  try {
    // Enviar via chrome.runtime para o background script
    chrome.runtime.sendMessage({
      type: 'NEW_NUMBER',
      data: {
        number: number,
        timestamp: Date.now(),
        source: 'betting_platform'
      }
    });
    
    console.log(`[Roleta Pro I.A.] Número ${number} enviado!`);
  } catch (error) {
    console.error('[Roleta Pro I.A.] Erro ao enviar número:', error);
  }
}

/**
 * Monitora novos números
 */
function monitorNumbers() {
  const currentNumber = detectCurrentNumber();
  
  if (currentNumber !== null && currentNumber !== lastNumber) {
    console.log(`[Roleta Pro I.A.] Novo número detectado: ${currentNumber}`);
    
    lastNumber = currentNumber;
    numbersHistory.unshift(currentNumber);
    
    if (numbersHistory.length > CONFIG.MAX_HISTORY) {
      numbersHistory = numbersHistory.slice(0, CONFIG.MAX_HISTORY);
    }
    
    sendNumberToBackend(currentNumber);
    
    // Salvar no storage
    chrome.storage.local.set({
      lastNumber: currentNumber,
      numbersHistory: numbersHistory
    });
  }
}

/**
 * Executa aposta na mesa
 */
async function placeBet(betData) {
  try {
    console.log('[Roleta Pro I.A.] Executando aposta:', betData);
    
    // TODO: Implementar clique nos botões da roleta
    // Isso requer análise mais detalhada da interface
    
    const { betType, betValue, amount } = betData;
    
    // Por enquanto, apenas loga
    console.log(`[Roleta Pro I.A.] Aposta: ${betType} = ${betValue}, Valor: R$ ${amount/100}`);
    
    // Simular sucesso
    return {
      success: true,
      message: 'Aposta registrada (simulação)'
    };
    
  } catch (error) {
    console.error('[Roleta Pro I.A.] Erro ao executar aposta:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Inicializa o monitoramento
 */
function init() {
  console.log('[Roleta Pro I.A.] Inicializando monitoramento...');
  
  // Carregar estado do storage
  chrome.storage.local.get(['isActive', 'lastNumber', 'numbersHistory'], (result) => {
    isActive = result.isActive || false;
    lastNumber = result.lastNumber || null;
    numbersHistory = result.numbersHistory || [];
    
    console.log('[Roleta Pro I.A.] Estado carregado:', { isActive, lastNumber, historySize: numbersHistory.length });
  });
  
  // Iniciar monitoramento
  setInterval(() => {
    if (isActive) {
      monitorNumbers();
    }
  }, CONFIG.CHECK_INTERVAL);
  
  // Escutar mensagens do background
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[Roleta Pro I.A.] Mensagem recebida:', message);
    
    if (message.type === 'START_MONITORING') {
      isActive = true;
      chrome.storage.local.set({ isActive: true });
      sendResponse({ success: true });
    }
    
    if (message.type === 'STOP_MONITORING') {
      isActive = false;
      chrome.storage.local.set({ isActive: false });
      sendResponse({ success: true });
    }
    
    if (message.type === 'PLACE_BET') {
      placeBet(message.data).then(sendResponse);
      return true; // Async response
    }
    
    if (message.type === 'GET_STATUS') {
      sendResponse({
        isActive,
        lastNumber,
        numbersHistory: numbersHistory.slice(0, 10)
      });
    }
  });
}

// Escutar mensagens do iframe da Evolution
window.addEventListener('message', (event) => {
  console.log('[Roleta Pro I.A.] Mensagem recebida do iframe:', event.data);
  
  if (event.data.type === 'ROULETTE_NUMBER') {
    const number = event.data.number;
    console.log(`[Roleta Pro I.A.] Número recebido do iframe: ${number}`);
    
    if (number !== lastNumber) {
      lastNumber = number;
      numbersHistory.unshift(number);
      
      if (numbersHistory.length > CONFIG.MAX_HISTORY) {
        numbersHistory = numbersHistory.slice(0, CONFIG.MAX_HISTORY);
      }
      
      sendNumberToBackend(number);
      
      chrome.storage.local.set({
        lastNumber: number,
        numbersHistory: numbersHistory
      });
    }
  }
});

// Função para enviar mensagem para todos os iframes
function sendMessageToIframes(message) {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      iframe.contentWindow.postMessage(message, '*');
    } catch (e) {
      console.error('[Roleta Pro I.A.] Erro ao enviar mensagem para iframe:', e);
    }
  });
}

// Enviar mensagem HELLO para o background saber que a aba existe
chrome.runtime.sendMessage({
  type: 'HELLO',
  source: 'betting_platform'
});

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Enviar comando de início para iframes após 3 segundos
setTimeout(() => {
  console.log('[Roleta Pro I.A.] Enviando comando START_MONITORING para iframes...');
  sendMessageToIframes({ type: 'START_MONITORING' });
}, 3000);

