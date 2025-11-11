/**
 * Background Service Worker
 * Gerencia comunicação entre a Plataforma de Apostas e o Roleta Pro I.A.
 */

console.log('[Roleta Pro I.A.] Background script iniciado!');

// Estado global
let state = {
  isMonitoring: false,
  lastNumber: null,
  numbersHistory: [],
  roletaProTabId: null,
  bettingPlatformTabId: null
};

/**
 * Encontra aba da Plataforma de Apostas
 */
async function findBettingPlatformTab() {
  const tabs = await chrome.tabs.query({});
  const tab = tabs.find(t => t.url && (t.url.includes('.life')));
  return tab?.id || null;
}

/**
 * Encontra aba do Roleta Pro I.A.
 */
async function findRoletaProTab() {
  const tabs = await chrome.tabs.query({});
  const tab = tabs.find(t => t.url && t.url.includes('roletaproia.onrender.com/betting-robot'));
  return tab?.id || null;
}

/**
 * Envia mensagem para uma aba
 */
async function sendToTab(tabId, message) {
  if (!tabId) return;
  
  try {
    await chrome.tabs.sendMessage(tabId, message);
  } catch (error) {
    console.error('[Roleta Pro I.A.] Erro ao enviar mensagem para aba:', error);
  }
}

/**
 * Processa novo número da roleta
 */
async function handleNewNumber(number, timestamp) {
  console.log(`[Roleta Pro I.A.] Novo número recebido: ${number}`);
  
  state.lastNumber = number;
  state.numbersHistory.unshift({ number, timestamp });
  
  if (state.numbersHistory.length > 50) {
    state.numbersHistory = state.numbersHistory.slice(0, 50);
  }
  
  // Salvar no storage
  await chrome.storage.local.set({
    lastNumber: number,
    numbersHistory: state.numbersHistory
  });
  
  // Enviar para Roleta Pro I.A.
  const roletaProTabId = await findRoletaProTab();
  if (roletaProTabId) {
    await sendToTab(roletaProTabId, {
      type: 'NEW_NUMBER',
      data: { number, timestamp }
    });
  }
}

/**
 * Inicia monitoramento
 */
async function startMonitoring() {
  console.log('[Roleta Pro I.A.] Iniciando monitoramento...');
  
  state.isMonitoring = true;
  await chrome.storage.local.set({ isActive: true });
  
  // Enviar comando para a Plataforma de Apostas
  const bettingPlatformTabId = await findBettingPlatformTab();
  if (bettingPlatformTabId) {
    await sendToTab(bettingPlatformTabId, { type: 'START_MONITORING' });
  }
  
  return { success: true, message: 'Monitoramento iniciado' };
}

/**
 * Para monitoramento
 */
async function stopMonitoring() {
  console.log('[Roleta Pro I.A.] Parando monitoramento...');
  
  state.isMonitoring = false;
  await chrome.storage.local.set({ isActive: false });
  
  // Enviar comando para a Plataforma de Apostas
  const bettingPlatformTabId = await findBettingPlatformTab();
  if (bettingPlatformTabId) {
    await sendToTab(bettingPlatformTabId, { type: 'STOP_MONITORING' });
  }
  
  return { success: true, message: 'Monitoramento parado' };
}

/**
 * Executa aposta na Plataforma de Apostas
 */
async function placeBet(betData) {
  console.log('[Roleta Pro I.A.] Executando aposta:', betData);
  
  const bettingPlatformTabId = await findBettingPlatformTab();
  if (!bettingPlatformTabId) {
    return { success: false, error: 'Aba da Plataforma de Apostas não encontrada' };
  }
  
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(bettingPlatformTabId, {
      type: 'PLACE_BET',
      data: betData
    }, (response) => {
      resolve(response || { success: false, error: 'Sem resposta' });
    });
  });
}

/**
 * Obtém status atual
 */
function getStatus() {
  return {
    isMonitoring: state.isMonitoring,
    lastNumber: state.lastNumber,
    numbersHistory: state.numbersHistory.slice(0, 10),
    hasBettingPlatformTab: state.bettingPlatformTabId !== null,
    hasRoletaProTab: state.roletaProTabId !== null
  };
}

// Escutar mensagens
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Roleta Pro I.A.] Mensagem recebida:', message);
  
  // Atualizar IDs das abas
  if (sender.tab) {
    if (sender.tab.url.includes('.life')) {
      state.bettingPlatformTabId = sender.tab.id;
    }
    if (sender.tab.url.includes('roletaproia.onrender.com')) {
      state.roletaProTabId = sender.tab.id;
    }
  }
  
  // Processar mensagens
  if (message.type === 'HELLO') {
    console.log('[Roleta Pro I.A.] HELLO recebido de:', sender.tab?.url);
    sendResponse({ received: true });
  }
  
  if (message.type === 'NEW_NUMBER') {
    handleNewNumber(message.data.number, message.data.timestamp);
    sendResponse({ received: true });
  }
  
  if (message.type === 'START_MONITORING') {
    startMonitoring().then(sendResponse);
    return true; // Async
  }
  
  if (message.type === 'STOP_MONITORING') {
    stopMonitoring().then(sendResponse);
    return true; // Async
  }
  
  if (message.type === 'PLACE_BET') {
    placeBet(message.data).then(sendResponse);
    return true; // Async
  }
  
  if (message.type === 'GET_STATUS') {
    sendResponse(getStatus());
  }
});

// Carregar estado ao iniciar
chrome.storage.local.get(['lastNumber', 'numbersHistory', 'isActive'], (result) => {
  state.lastNumber = result.lastNumber || null;
  state.numbersHistory = result.numbersHistory || [];
  state.isMonitoring = result.isActive || false;
  
  console.log('[Roleta Pro I.A.] Estado carregado:', state);
});

console.log('[Roleta Pro I.A.] Background pronto!');

