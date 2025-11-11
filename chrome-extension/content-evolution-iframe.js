/**
 * Content Script para injetar no iframe da Evolution Gaming
 * Captura números da roleta usando o método descoberto no fórum
 */

console.log('[Roleta Pro I.A.] Script injetado no iframe da Evolution!');

// Função para extrair números da roleta
function extractRouletteNumbers() {
  try {
    let numbers = [];
    
    // Método 1: Tentar pegar dos elementos de estatísticas
    for (let i = 492; i > 0; i--) {
      try {
        const element = document.querySelector(`div[data-role='statistics']:nth-child(${i})`);
        if (element && element.textContent) {
          const num = parseInt(element.textContent.trim());
          if (!isNaN(num) && num >= 0 && num <= 36) {
            numbers.push(num);
          }
        }
      } catch (e) {}
    }
    
    // Método 2: Tentar pegar dos números recentes
    for (let i = 15; i > 0; i--) {
      try {
        const element = document.querySelector(`div[data-role='recent-number']:nth-child(${i})`);
        if (element && element.textContent) {
          const num = parseInt(element.textContent.trim());
          if (!isNaN(num) && num >= 0 && num <= 36) {
            numbers.push(num);
          }
        }
      } catch (e) {}
    }
    
    // Método 3: Procurar por qualquer elemento com data-role contendo número
    const allElements = document.querySelectorAll('[data-role*="number"], [data-role*="result"], [class*="number"], [class*="result"]');
    allElements.forEach(el => {
      const text = el.textContent.trim();
      const num = parseInt(text);
      if (!isNaN(num) && num >= 0 && num <= 36 && !numbers.includes(num)) {
        numbers.push(num);
      }
    });
    
    return numbers;
  } catch (error) {
    console.error('[Roleta Pro I.A.] Erro ao extrair números:', error);
    return [];
  }
}

// Função para detectar o último número que saiu
function detectLatestNumber() {
  try {
    // Método 1: Procurar pelo span.value dentro de div[data-role="recent-number"]
    const recentNumberDiv = document.querySelector('div[data-role="recent-number"]');
    if (recentNumberDiv) {
      const valueSpan = recentNumberDiv.querySelector('span[class*="value"]');
      if (valueSpan) {
        const num = parseInt(valueSpan.textContent.trim());
        if (!isNaN(num) && num >= 0 && num <= 36) {
          console.log(`[Roleta Pro I.A.] Número detectado via span.value: ${num}`);
          return num;
        }
      }
    }
    
    // Método 2: Procurar por data-role="number-X" onde X é o número
    const numberDivs = document.querySelectorAll('div[data-role^="number-"]');
    if (numberDivs.length > 0) {
      // Pegar o primeiro (mais recente)
      const dataRole = numberDivs[0].getAttribute('data-role');
      const match = dataRole.match(/number-(\d+)/);
      if (match) {
        const num = parseInt(match[1]);
        if (!isNaN(num) && num >= 0 && num <= 36) {
          console.log(`[Roleta Pro I.A.] Número detectado via data-role: ${num}`);
          return num;
        }
      }
    }
    
    // Método 3: Procurar por qualquer span com classe value
    const valueSpans = document.querySelectorAll('span[class*="value"]');
    for (const span of valueSpans) {
      const num = parseInt(span.textContent.trim());
      if (!isNaN(num) && num >= 0 && num <= 36) {
        console.log(`[Roleta Pro I.A.] Número detectado via span genérico: ${num}`);
        return num;
      }
    }
    
    return null;
  } catch (error) {
    console.error('[Roleta Pro I.A.] Erro ao detectar último número:', error);
    return null;
  }
}

// Estado
let lastDetectedNumber = null;
let isMonitoring = false;

// Função de monitoramento
function startMonitoring() {
  console.log('[Roleta Pro I.A.] Iniciando monitoramento...');
  isMonitoring = true;
  
  setInterval(() => {
    if (!isMonitoring) return;
    
    const currentNumber = detectLatestNumber();
    
    if (currentNumber !== null && currentNumber !== lastDetectedNumber) {
      console.log(`[Roleta Pro I.A.] Novo número detectado: ${currentNumber}`);
      lastDetectedNumber = currentNumber;
      
       // Enviar para o parent window (página da plataforma)
      try {
         // Tentar enviar para várias origens possíveis da plataforma
        const possibleOrigins = [
          window.location.ancestorOrigins?.[0], // Origem do parent
          'https://1wyvrz.life',
          'https://1whfxh.life',


        ].filter(Boolean);
        
        possibleOrigins.forEach(origin => {
          try {
            window.parent.postMessage({
              type: 'ROULETTE_NUMBER',
              number: currentNumber,
              timestamp: Date.now(),
              source: 'evolution-gaming'
            }, origin);
          } catch (e) {}
        });
      } catch (e) {
        console.error('[Roleta Pro I.A.] Erro ao enviar mensagem:', e);
      }
    }
  }, 1000); // Verificar a cada 1 segundo
}

// Escutar mensagens do parent
window.addEventListener('message', (event) => {
  if (event.data.type === 'START_MONITORING') {
    startMonitoring();
  } else if (event.data.type === 'STOP_MONITORING') {
    isMonitoring = false;
  } else if (event.data.type === 'GET_NUMBERS') {
    const numbers = extractRouletteNumbers();
    window.parent.postMessage({
      type: 'ROULETTE_NUMBERS',
      numbers: numbers,
      timestamp: Date.now()
    }, '*');
  }
});

// Iniciar automaticamente
setTimeout(() => {
  startMonitoring();
}, 2000); // Aguardar 2 segundos para a página carregar

console.log('[Roleta Pro I.A.] Script pronto! Aguardando comandos...');

