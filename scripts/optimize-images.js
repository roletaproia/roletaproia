import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../client/public');

async function optimizeImages() {
  console.log('🖼️  Otimizando imagens...\n');

  const images = [
    {
      input: path.join(publicDir, 'logo.png'),
      outputs: [
        { path: path.join(publicDir, 'logo-56.webp'), width: 56 },
        { path: path.join(publicDir, 'logo-112.webp'), width: 112 }, // 2x para retina
      ]
    },
    {
      input: path.join(publicDir, 'robot-roulette.png'),
      outputs: [
        { path: path.join(publicDir, 'robot-roulette-665.webp'), width: 665 },
        { path: path.join(publicDir, 'robot-roulette-1330.webp'), width: 1330 }, // 2x para retina
      ]
    }
  ];

  for (const image of images) {
    console.log(`📁 Processando: ${path.basename(image.input)}`);
    
    for (const output of image.outputs) {
      try {
        await sharp(image.input)
          .resize(output.width, null, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 85 })
          .toFile(output.path);
        
        const stats = await fs.stat(output.path);
        console.log(`  ✅ ${path.basename(output.path)} - ${(stats.size / 1024).toFixed(2)} KB`);
      } catch (error) {
        console.error(`  ❌ Erro ao processar ${output.path}:`, error.message);
      }
    }
    console.log('');
  }

  console.log('✨ Otimização concluída!\n');
}

optimizeImages().catch(console.error);
