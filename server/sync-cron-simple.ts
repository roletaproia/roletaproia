import cron from 'node-cron';
import axios from 'axios';
import { db } from './_core/db';
import { signals } from './_core/db/schema';

let isRunning = false;
let lastNumber: number | null = null;

function getColor(number: number): 'red' | 'black' | 'green' {
  if (number === 0) return 'green';
  const reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  return reds.includes(number) ? 'red' : 'black';
}

async function fetchAndSaveNumbers() {
  if (isRunning) return;
  
  try {
    isRunning = true;
    
    // Buscar página do CasinoScores
    const response = await axios.get('https://casinoscores.com/lightning-roulette/', {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = response.data;
    
    // Extrair números usando regex simples
    // Procura por padrões como: >0<, >14<, >23<, etc
    const numberMatches = html.match(/>\d{1,2}</g);
    
    if (numberMatches && numberMatches.length > 0) {
      // Pegar o primeiro número encontrado (mais recente)
      const firstMatch = numberMatches[0];
      const numberStr = firstMatch.replace(/[><]/g, '');
      const number = parseInt(numberStr);
      
      // Validar se é um número de roleta válido
      if (number >= 0 && number <= 36 && number !== lastNumber) {
        // Salvar no banco
        await db.insert(signals).values({
          number,
          color: getColor(number),
          source: 'casinoscores-lightning',
          timestamp: new Date(),
        });
        
        console.log(`✅ Número ${number} (${getColor(number)}) capturado e salvo!`);
        lastNumber = number;
      }
    }
  } catch (error: any) {
    console.error('❌ Erro ao buscar números:', error.message);
  } finally {
    isRunning = false;
  }
}

export function startSyncCron() {
  console.log('🚀 Iniciando sincronização automática com CasinoScores...');
  
  // Executar imediatamente
  fetchAndSaveNumbers();
  
  // Executar a cada 5 segundos
  cron.schedule('*/5 * * * * *', () => {
    fetchAndSaveNumbers();
  });
  
  console.log('✅ Cron ativo! Capturando a cada 5 segundos.');
}

