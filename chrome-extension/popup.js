/**
 * Popup Script
 * Interface de controle da extensão
 */

console.log('[Roleta Pro I.A.] Popup carregado!');

// Elementos
const statusEl = document.getElementById('status');
const lastNumberEl = document.getElementById('lastNumber');
const onewinTabEl = document.getElementById('onewinTab');
const roletaproTabEl = document.getElementById('roletaproTab');
const numbersGridEl = document.getElementById('numbersGrid');
const alertEl = document.getElementById('alert');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const openRoletaProBtn = document.getElementById('openRoletaPro');
const open1winBtn = document.getElementById('open1win');

// Estado
let currentStatus = null;

/**
 * Mostra alerta
 */
function showAlert(message) {
  alertEl.textContent = message;
  alertEl.style.display = 'block';
  setTimeout(() => {
    alertEl.style.display = 'none';
  }, 3000);
}

/**
 * Atualiza interface
 */
function updateUI(status) {
  currentStatus = status;

  // Status
  if (status.isMonitoring) {
    statusEl.textContent = '🟢 Monitorando';
    statusEl.className = 'status-value active';
    startBtn.style.display = 'none';
    stopBtn.style.display = 'block';
  } else {
    statusEl.textContent = '⚪ Parado';
    statusEl.className = 'status-value inactive';
    startBtn.style.display = 'block';
    stopBtn.style.display = 'none';
  }

  // Último número
  lastNumberEl.textContent = status.lastNumber !== null ? status.lastNumber : '-';

  // Abas
  if (status.has1winTab) {
    onewinTabEl.textContent = '✅ Conectada';
    onewinTabEl.className = 'status-value active';
  } else {
    onewinTabEl.textContent = '❌ Não encontrada';
    onewinTabEl.className = 'status-value inactive';
  }

  if (status.hasRoletaProTab) {
    roletaproTabEl.textContent = '✅ Conectada';
    roletaproTabEl.className = 'status-value active';
  } else {
    roletaproTabEl.textContent = '❌ Não encontrada';
    roletaproTabEl.className = 'status-value inactive';
  }

  // Histórico de números
  if (status.numbersHistory && status.numbersHistory.length > 0) {
    numbersGridEl.innerHTML = '';
    status.numbersHistory.slice(0, 10).forEach(item => {
      const badge = document.createElement('div');
      badge.className = 'number-badge';
      badge.textContent = item.number;
      numbersGridEl.appendChild(badge);
    });

    // Preencher com placeholders se necessário
    const remaining = 10 - status.numbersHistory.length;
    for (let i = 0; i < remaining; i++) {
      const badge = document.createElement('div');
      badge.className = 'number-badge';
      badge.textContent = '-';
      numbersGridEl.appendChild(badge);
    }
  }
}

/**
 * Carrega status
 */
async function loadStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
    updateUI(response);
  } catch (error) {
    console.error('[Roleta Pro I.A.] Erro ao carregar status:', error);
  }
}

/**
 * Inicia monitoramento
 */
async function startMonitoring() {
  try {
    startBtn.disabled = true;
    const response = await chrome.runtime.sendMessage({ type: 'START_MONITORING' });
    
    if (response.success) {
      showAlert('✅ Monitoramento iniciado!');
      await loadStatus();
    } else {
      showAlert('❌ Erro ao iniciar: ' + response.error);
    }
  } catch (error) {
    console.error('[Roleta Pro I.A.] Erro:', error);
    showAlert('❌ Erro ao iniciar monitoramento');
  } finally {
    startBtn.disabled = false;
  }
}

/**
 * Para monitoramento
 */
async function stopMonitoring() {
  try {
    stopBtn.disabled = true;
    const response = await chrome.runtime.sendMessage({ type: 'STOP_MONITORING' });
    
    if (response.success) {
      showAlert('⏸️ Monitoramento parado!');
      await loadStatus();
    } else {
      showAlert('❌ Erro ao parar: ' + response.error);
    }
  } catch (error) {
    console.error('[Roleta Pro I.A.] Erro:', error);
    showAlert('❌ Erro ao parar monitoramento');
  } finally {
    stopBtn.disabled = false;
  }
}

/**
 * Abre Roleta Pro I.A.
 */
function openRoletaPro() {
  chrome.tabs.create({ url: 'https://roletaproia.onrender.com/betting-robot' });
}

/**
 * Abre 1win
 */
function open1win() {
  chrome.tabs.create({ url: 'https://1wyvrz.life/?open=register&p=f5q8' });
}

// Event listeners
startBtn.addEventListener('click', startMonitoring);
stopBtn.addEventListener('click', stopMonitoring);
openRoletaProBtn.addEventListener('click', openRoletaPro);
open1winBtn.addEventListener('click', open1win);

// Carregar status inicial
loadStatus();

// Atualizar status a cada 2 segundos
setInterval(loadStatus, 2000);

