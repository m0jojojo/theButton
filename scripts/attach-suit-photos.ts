/**
 * Attach real photographs to the suit products.
 *
 *   npx tsx scripts/attach-suit-photos.ts <folder> [--limit 12]
 *
 * Uploads the first N images from the folder to ImageKit and sets one on each
 * suit product, in filename order. Existing images are replaced.
 */

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { uploadImage, isImageKitConfigured } from '../lib/imagekit';

const prisma = new PrismaClient();

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

async function main() {
  const folder = process.argv[2];
  if (!folder) throw new Error('Usage: attach-suit-photos.ts <folder> [--limit N]');
  if (!isImageKitConfigured()) throw new Error('ImageKit is not configured.');

  const limitArg = process.argv.indexOf('--limit');
  const limit = limitArg > -1 ? Number(process.argv[limitArg + 1]) : Infinity;

  const files = fs
    .readdirSync(folder)
    .filter((f) => MIME[path.extname(f).toLowerCase()])
    .sort();

  const products = await prisma.product.findMany({
    where: { collection: { contains: 'Suit' } },
    select: { id: true, sku: true, name: true },
    orderBy: [{ collection: 'asc' }, { sku: 'asc' }],
  });

  const count = Math.min(files.length, products.length, limit);
  console.log(`${files.length} images, ${products.length} suit products -> attaching ${count}\n`);

  for (let i = 0; i < count; i += 1) {
    const file = path.join(folder, files[i]);
    const product = products[i];
    const ext = path.extname(files[i]).toLowerCase();
    const dataUrl = `data:${MIME[ext]};base64,${fs.readFileSync(file).toString('base64')}`;

    const { url } = await uploadImage(dataUrl, {
      fileName: product.sku.toLowerCase(),
      folder: 'products',
    });

    await prisma.product.update({ where: { id: product.id }, data: { images: [url] } });
    console.log(`  ${product.name} <- ${files[i]}`);
  }

  console.log(`\nDone: ${count} products updated.`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
