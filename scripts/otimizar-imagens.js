// Script para otimizar imagens em lote usando sharp
// Como usar:
// 1. Coloque suas imagens na pasta 'imagens-originais'
// 2. Execute: npm install sharp
// 3. Execute: node scripts/otimizar-imagens.js
// As imagens otimizadas serão salvas em 'imagens-otimizadas'

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const pastaOrigem = path.join(__dirname, '../imagens-originais');
const pastaDestino = path.join(__dirname, '../imagens-otimizadas');

if (!fs.existsSync(pastaDestino)) {
  fs.mkdirSync(pastaDestino);
}

fs.readdirSync(pastaOrigem).forEach(file => {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return;

  const inputPath = path.join(pastaOrigem, file);
  const outputPath = path.join(pastaDestino, file.replace(/\.[^.]+$/, '.webp'));

  sharp(inputPath)
    .resize({ width: 1280 })
    .webp({ quality: 80 })
    .toFile(outputPath)
    .then(() => console.log(`Otimizou: ${file} → ${path.basename(outputPath)}`))
    .catch(err => console.error(`Erro ao otimizar ${file}:`, err));
}); 