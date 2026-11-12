// Gera fotos placeholder (com grão, tons suaves e a proporção escrita no canto)
// para cada trabalho. Rode: npm run placeholders
// Quando tiver as fotos reais, é só substituir os arquivos em src/assets/trabalhos/<slug>/
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const FORMATOS = {
  retrato: [1920, 2400], // 4:5
  paisagem: [2400, 1600], // 3:2
  vertical: [1600, 2400], // 2:3
};

// cada trabalho: [slug, [corA, corB, corC], lista de formatos]
const TRABALHOS = [
  ['kalunga-volta-as-aulas', ['#3f5a6b', '#16232b', '#a9c2cc'], ['paisagem', 'retrato', 'retrato', 'paisagem', 'vertical', 'paisagem']],
  ['cbamc-forma-e-folego', ['#7a2e24', '#1c120f', '#d49a7a'], ['retrato', 'paisagem', 'vertical', 'vertical', 'paisagem', 'retrato']],
  ['orua-verao', ['#c9b9a3', '#8a7a66', '#efe6d8'], ['retrato', 'paisagem', 'retrato', 'retrato', 'paisagem', 'vertical']],
  ['sabia-alfaiataria', ['#6f6a4a', '#2b2a1f', '#c2bd93'], ['retrato', 'paisagem', 'vertical', 'vertical', 'retrato', 'paisagem']],
  ['cardume-mar-de-dentro', ['#4f7480', '#18303a', '#a9c6c9'], ['paisagem', 'paisagem', 'vertical', 'vertical', 'paisagem']],
];

function rand(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

async function foto(arquivo, [w, h], [a, b, c], seed, rotulo) {
  const r = rand(seed);
  const blobs = Array.from({ length: 3 }, (_, i) => {
    const cx = Math.round(r() * w), cy = Math.round(r() * h);
    const rad = Math.round((0.35 + r() * 0.4) * Math.max(w, h));
    const cor = [a, c, b][i];
    return `<radialGradient id="g${i}" cx="${cx}" cy="${cy}" r="${rad}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${cor}" stop-opacity="0.95"/><stop offset="1" stop-color="${cor}" stop-opacity="0"/></radialGradient>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs>${blobs}</defs>
    <rect width="100%" height="100%" fill="${b}"/>
    <rect width="100%" height="100%" fill="url(#g0)"/>
    <rect width="100%" height="100%" fill="url(#g1)"/>
    <rect width="100%" height="100%" fill="url(#g2)"/>
    <text x="${w * 0.04}" y="${h - w * 0.04}" font-family="DejaVu Sans, sans-serif" font-size="${w * 0.028}" fill="#ffffff" fill-opacity="0.55">${rotulo}</text>
  </svg>`;
  // grão de filme
  const ruido = Buffer.alloc(w * h);
  for (let i = 0; i < ruido.length; i++) ruido[i] = 128 + Math.round((r() - 0.5) * 70);
  const grao = await sharp(ruido, { raw: { width: w, height: h, channels: 1 } }).png().toBuffer();
  await sharp(Buffer.from(svg))
    .composite([{ input: grao, blend: 'overlay' }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(arquivo);
}

let seed = 7;
for (const [slug, cores, formatos] of TRABALHOS) {
  const pasta = `src/assets/trabalhos/${slug}`;
  await mkdir(pasta, { recursive: true });
  for (const [i, fmt] of formatos.entries()) {
    const n = String(i + 1).padStart(2, '0');
    const prop = { retrato: '4:5', paisagem: '3:2', vertical: '2:3' }[fmt];
    await foto(`${pasta}/${n}.jpg`, FORMATOS[fmt], cores, seed++ * 977, `${slug} / ${n} / ${prop}`);
  }
  console.log('ok', slug);
}

await foto('src/assets/retrato-sobre.jpg', FORMATOS.retrato, ['#8d8f8a', '#3a3b38', '#d4d5d0'], 4242, 'retrato do fotógrafo / 4:5');
console.log('ok retrato');
