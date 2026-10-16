import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const photo = await sharp('public/images/roasting.jpg').resize(500, 630, { fit: 'cover' }).toBuffer();
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#F6F3E9"/><g fill="#264638" font-family="Arial,sans-serif"><text x="65" y="98" font-size="50" font-weight="700">кварта.</text><text x="65" y="225" font-size="61" font-weight="700">В четверг</text><text x="65" y="300" font-size="61" font-weight="700">обжариваем.</text><text x="65" y="390" font-size="61" font-weight="700">В пятницу</text><text x="65" y="465" font-size="61" font-weight="700">привозим.</text><text x="65" y="555" font-size="23">Свежая обжарка кофе · Минск</text></g></svg>`;
await sharp(Buffer.from(svg)).composite([{ input: photo, left: 700, top: 0 }]).jpeg({ quality: 85 }).toFile('public/og.jpg');
for (const name of ['roasting', 'workshop', 'brewing']) {
  const input = await readFile(`public/images/${name}.jpg`);
  const buffer = await sharp(input).resize({ width: name === 'roasting' ? 1400 : 1100, withoutEnlargement: true }).webp({ quality: 83 }).toBuffer();
  await writeFile(`public/images/${name}.webp`, buffer);
  console.log(`${name}: ${buffer.length} bytes`);
}
