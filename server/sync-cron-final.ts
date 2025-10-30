// 🎰 ROLETA PRO I.A. - Sincronização Automática CasinoScores
import cron from 'node-cron';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { db } from './db';

const CASINOSCORES_URL = 'https://casinoscores.com/lightning-roulette/';
let lastNumber: number | null = null;

function getColor(num: number): 'red' | 'black' | 'green' {
  if (num === 0) return 'green';
  const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
  return reds.includes(num) ? 'red' : 'black';
}

async function scrapeNumber(): Promise<number | null> {
  try {
    const { data } = await axios.get(CASINOSCORES_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 8000
    });
    const $ = cheerio.load(data);
    const numbers: number[] = [];
    $('*').each((_, el) => {
      const text = $(el).text().trim();
      if (/^\d{1,2}$/.test(text)) {
        const n = parseInt(text);
        if (n >= 0 && n <= 36) numbers.push(n);
      }
    });
    return numbers[0] || null;
  } catch (e) {
    return null;
  }
}

async function sync() {
  const number = await scrapeNumber();
  if (number !== null && number !== lastNumber) {
    try {
      await db.signal.create({
        data: {
          sessionId: 'casinoscores-auto',
          number,
          color: getColor(number),
          timestamp: new Date(),
          source: 'casinoscores'
        }
      });
      console.log(`✅ ${number} (${getColor(number)})`);
      lastNumber = number;
    } catch (e) {
      console.error('❌ Erro:', e);
    }
  }
}

export function startSyncCron() {
  console.log('🚀 Sync ativo!');
  sync();
  cron.schedule('*/2 * * * * *', sync);
}
