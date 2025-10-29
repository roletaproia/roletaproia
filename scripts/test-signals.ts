/**
 * Script de Teste - Sinais Inteligentes
 * 
 * Este script simula o envio de números da roleta para testar
 * o sistema de sinais sem precisar rodar o Puppeteer.
 * 
 * INSTRUÇÕES:
 * 1. Configure o ADMIN_AUTH_TOKEN no .env
 * 2. Execute: npx tsx scripts/test-signals.ts
 * 3. Abra a página /live-signals no navegador para ver os sinais
 */

import dotenv from 'dotenv';

dotenv.config();

const CONFIG = {
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
  AUTH_TOKEN: process.env.ADMIN_AUTH_TOKEN || '',
  INTERVAL: 5000, // Enviar novo número a cada 5 segundos
};

// Números de teste (simulando uma sessão real)
const TEST_NUMBERS = [
  17, 5, 23, 8, 14, 32, 19, 2, 25, 11,
  7, 28, 12, 35, 3, 26, 0, 32, 15, 19,
  4, 21, 2, 25, 17, 34, 6, 27, 13, 36,
];

let currentIndex = 0;
let sessionId: string | null = null;

/**
 * Iniciar sessão de captura
 */
async function startSession(): Promise<string> {
  console.log('🚀 Iniciando sessão de teste...');
  
  const response = await fetch(`${CONFIG.BACKEND_URL}/api/trpc/signals.startCaptureSession`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`,
    },
  });

  const data = await response.json();
  
  if (data.result?.data?.sessionId) {
    console.log('✅ Sessão iniciada:', data.result.data.sessionId);
    return data.result.data.sessionId;
  }
  
  throw new Error('Falha ao iniciar sessão: ' + JSON.stringify(data));
}

/**
 * Enviar número de teste
 */
async function sendNumber(number: number): Promise<void> {
  console.log(`📡 Enviando número: ${number}`);
  
  const response = await fetch(`${CONFIG.BACKEND_URL}/api/trpc/signals.sendSignal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      number,
      sessionId,
    }),
  });

  const data = await response.json();
  
  if (data.result?.data?.success) {
    const rec = data.result.data.recommendation;
    console.log(`✅ Sinal enviado com sucesso!`);
    console.log(`   Recomendação: ${rec?.betType || 'N/A'} | Confiança: ${rec?.confidence || 0}%`);
  } else {
    console.error('❌ Erro ao enviar sinal:', data);
  }
}

/**
 * Loop de envio de números
 */
async function sendLoop(): Promise<void> {
  while (currentIndex < TEST_NUMBERS.length) {
    const number = TEST_NUMBERS[currentIndex];
    await sendNumber(number);
    
    currentIndex++;
    
    if (currentIndex < TEST_NUMBERS.length) {
      console.log(`⏳ Aguardando ${CONFIG.INTERVAL / 1000}s até próximo número...\n`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.INTERVAL));
    }
  }
  
  console.log('✅ Todos os números de teste foram enviados!');
  console.log('🎯 Abra /live-signals no navegador para ver os resultados');
}

/**
 * Parar sessão
 */
async function stopSession(): Promise<void> {
  if (!sessionId) return;
  
  console.log('\n🛑 Encerrando sessão...');
  
  const response = await fetch(`${CONFIG.BACKEND_URL}/api/trpc/signals.stopCaptureSession`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`,
    },
    body: JSON.stringify({ sessionId }),
  });

  const data = await response.json();
  console.log('✅ Sessão encerrada');
  process.exit(0);
}

/**
 * Main
 */
async function main(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        🧪 Teste de Sinais Inteligentes                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  if (!CONFIG.AUTH_TOKEN) {
    console.error('❌ ERRO: ADMIN_AUTH_TOKEN não configurado no .env');
    process.exit(1);
  }

  try {
    sessionId = await startSession();
    console.log(`📊 Enviando ${TEST_NUMBERS.length} números de teste...\n`);
    await sendLoop();
    await stopSession();
  } catch (error) {
    console.error('❌ Erro:', error);
    await stopSession();
  }
}

// Handlers
process.on('SIGINT', stopSession);
process.on('SIGTERM', stopSession);

// Executar
main().catch(console.error);

