/**
 * Script de Captura Automática de Números da Roleta 1win
 * 
 * Este script usa Puppeteer para monitorar a roleta da 1win e enviar
 * os números capturados para o backend da Roleta Pro I.A.
 * 
 * INSTRUÇÕES DE USO:
 * 1. Instale as dependências: npm install puppeteer dotenv
 * 2. Configure as variáveis de ambiente no arquivo .env
 * 3. Execute: npx tsx scripts/capture-roulette.ts
 * 
 * IMPORTANTE:
 * - Este script deve rodar 24/7 em um servidor ou sua máquina
 * - Certifique-se de ter uma conexão estável com a internet
 * - O script tentará se reconectar automaticamente em caso de erro
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configurações
const CONFIG = {
  // URL da roleta 1win (ajuste conforme necessário)
  ROULETTE_URL: process.env.ROULETTE_URL || 'https://1wyvrz.life/',
  
  // URL do backend da Roleta Pro I.A.
  BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:3000',
  
  // Token de autenticação (JWT do admin)
  AUTH_TOKEN: process.env.ADMIN_AUTH_TOKEN || '',
  
  // Intervalo de verificação em milissegundos
  CHECK_INTERVAL: 2000,
  
  // Timeout para operações
  TIMEOUT: 30000,
  
  // Modo headless (true = sem interface gráfica)
  HEADLESS: process.env.HEADLESS === 'true',
};

// Estado global
let browser: Browser | null = null;
let page: Page | null = null;
let lastNumber: number | null = null;
let sessionId: string | null = null;
let isRunning = false;

/**
 * Inicializar sessão de captura no backend
 */
async function initCaptureSession(): Promise<string> {
  try {
    const response = await fetch(`${CONFIG.BACKEND_URL}/api/trpc/signals.startCaptureSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`,
      },
    });

    const data = await response.json();
    
    if (data.result?.data?.sessionId) {
      console.log('✅ Sessão de captura iniciada:', data.result.data.sessionId);
      return data.result.data.sessionId;
    }
    
    throw new Error('Falha ao iniciar sessão de captura');
  } catch (error) {
    console.error('❌ Erro ao iniciar sessão:', error);
    throw error;
  }
}

/**
 * Enviar número capturado para o backend
 */
async function sendSignal(number: number): Promise<void> {
  try {
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
      console.log(`✅ Sinal enviado: ${number} | Recomendação: ${data.result.data.recommendation?.betType || 'N/A'}`);
    } else {
      console.error('❌ Erro ao enviar sinal:', data);
    }
  } catch (error) {
    console.error('❌ Erro ao enviar sinal:', error);
  }
}

/**
 * Extrair número da roleta da página
 * 
 * NOTA: Esta função precisa ser ajustada conforme o layout da 1win
 * Os seletores CSS podem mudar, então você precisará inspecionar a página
 * e atualizar os seletores conforme necessário
 */
async function extractRouletteNumber(page: Page): Promise<number | null> {
  try {
    // Aguardar o iframe da Evolution Gaming carregar
    await page.waitForSelector('iframe', { timeout: CONFIG.TIMEOUT });
    
    // Tentar diferentes seletores comuns para números de roleta
    const selectors = [
      '.roulette-result__number',
      '.last-result',
      '.winning-number',
      '[data-role="winning-number"]',
      '.result-number',
    ];

    for (const selector of selectors) {
      try {
        const element = await page.$(selector);
        if (element) {
          const text = await page.evaluate(el => el.textContent, element);
          const number = parseInt(text?.trim() || '', 10);
          
          if (!isNaN(number) && number >= 0 && number <= 36) {
            return number;
          }
        }
      } catch (error) {
        // Tentar próximo seletor
        continue;
      }
    }

    // Se não encontrou com seletores, tentar extrair do iframe
    const frames = page.frames();
    for (const frame of frames) {
      try {
        const frameContent = await frame.content();
        
        // Procurar padrões de número vencedor no HTML
        const matches = frameContent.match(/winning[- _]?number[^>]*>(\d+)</i);
        if (matches && matches[1]) {
          const number = parseInt(matches[1], 10);
          if (!isNaN(number) && number >= 0 && number <= 36) {
            return number;
          }
        }
      } catch (error) {
        // Frame pode estar bloqueado por CORS
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error('❌ Erro ao extrair número:', error);
    return null;
  }
}

/**
 * Monitorar roleta continuamente
 */
async function monitorRoulette(): Promise<void> {
  if (!page) {
    console.error('❌ Página não inicializada');
    return;
  }

  console.log('🔍 Monitorando roleta...');

  while (isRunning) {
    try {
      const number = await extractRouletteNumber(page);

      if (number !== null && number !== lastNumber) {
        console.log(`🎰 Novo número detectado: ${number}`);
        lastNumber = number;
        
        // Enviar para o backend
        await sendSignal(number);
      }

      // Aguardar antes da próxima verificação
      await new Promise(resolve => setTimeout(resolve, CONFIG.CHECK_INTERVAL));
    } catch (error) {
      console.error('❌ Erro no loop de monitoramento:', error);
      
      // Tentar reconectar
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

/**
 * Inicializar navegador e página
 */
async function initBrowser(): Promise<void> {
  console.log('🚀 Iniciando navegador...');

  browser = await puppeteer.launch({
    headless: CONFIG.HEADLESS,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  });

  page = await browser.newPage();
  
  // Configurar viewport
  await page.setViewport({ width: 1920, height: 1080 });

  // Configurar user agent para evitar detecção de bot
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  );

  console.log('🌐 Navegando para a 1win...');
  await page.goto(CONFIG.ROULETTE_URL, {
    waitUntil: 'networkidle2',
    timeout: CONFIG.TIMEOUT,
  });

  console.log('✅ Página carregada!');
  console.log('⚠️  IMPORTANTE: Você precisa fazer login manualmente e navegar até a roleta!');
  console.log('⚠️  Aguardando 30 segundos para você fazer login...');
  
  // Aguardar usuário fazer login
  await new Promise(resolve => setTimeout(resolve, 30000));
}

/**
 * Parar captura e fechar navegador
 */
async function stopCapture(): Promise<void> {
  console.log('🛑 Parando captura...');
  isRunning = false;

  if (sessionId) {
    try {
      await fetch(`${CONFIG.BACKEND_URL}/api/trpc/signals.stopCaptureSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.AUTH_TOKEN}`,
        },
        body: JSON.stringify({ sessionId }),
      });
      console.log('✅ Sessão de captura encerrada');
    } catch (error) {
      console.error('❌ Erro ao encerrar sessão:', error);
    }
  }

  if (browser) {
    await browser.close();
    console.log('✅ Navegador fechado');
  }

  process.exit(0);
}

/**
 * Função principal
 */
async function main(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     🎰 Roleta Pro I.A. - Captura Automática de Números    ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  // Verificar configurações
  if (!CONFIG.AUTH_TOKEN) {
    console.error('❌ ERRO: ADMIN_AUTH_TOKEN não configurado no .env');
    console.error('   Configure o token JWT do admin para autenticar no backend');
    process.exit(1);
  }

  try {
    // Iniciar sessão de captura
    sessionId = await initCaptureSession();

    // Inicializar navegador
    await initBrowser();

    // Iniciar monitoramento
    isRunning = true;
    await monitorRoulette();
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    await stopCapture();
  }
}

// Handlers de sinais do sistema
process.on('SIGINT', stopCapture);
process.on('SIGTERM', stopCapture);

// Executar
main().catch(console.error);

