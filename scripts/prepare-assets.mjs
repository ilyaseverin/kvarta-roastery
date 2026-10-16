import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const photo = await sharp('public/images/roasting.jpg').resize(500, 580, { fit: 'cover' }).composite([{ input: Buffer.from('<svg width="500" height="580"><rect width="500" height="580" rx="30" fill="white"/></svg>'), blend: 'dest-in' }]).png().toBuffer();
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#241c18"/><rect x="25" y="25" width="1150" height="580" rx="40" fill="#352822"/><g fill="#eadfc9" font-family="Arial,sans-serif"><text x="65" y="105" font-size="53" font-weight="700">кварта.</text><text x="65" y="250" font-size="77" font-weight="700">Ваш кофе</text><text x="65" y="340" font-size="77" font-weight="700">начинается</text><text x="65" y="430" font-size="77" font-weight="700">в четверг.</text><text x="65" y="545" font-size="23" fill="#bfcca4">Своя обжарка. Минск.</text></g><circle cx="1065" cy="115" r="65" fill="#bfcca4"/><text x="1020" y="128" font-family="Arial,sans-serif" font-size="38" fill="#303b27">1–3</text></svg>`;
const badge = Buffer.from('<svg width="145" height="145" xmlns="http://www.w3.org/2000/svg"><circle cx="72" cy="72" r="65" fill="#bfcca4"/><g font-family="Arial,sans-serif" fill="#303b27" text-anchor="middle"><text x="72" y="54" font-size="13">У вас на</text><text x="72" y="91" font-size="39" font-weight="700">1–3</text><text x="72" y="112" font-size="13">день после обжарки</text></g></svg>');
await sharp(Buffer.from(svg)).composite([{ input: photo, left: 675, top: 25 }, { input: badge, left: 1000, top: 40 }]).jpeg({ quality: 85 }).toFile('public/og.jpg');
for (const name of ['roasting', 'workshop', 'brewing']) {
  const input = await readFile(`public/images/${name}.jpg`);
  const buffer = await sharp(input).resize({ width: name === 'roasting' ? 1400 : 1100, withoutEnlargement: true }).webp({ quality: 83 }).toBuffer();
  await writeFile(`public/images/${name}.webp`, buffer);
  console.log(`${name}: ${buffer.length} bytes`);
}
