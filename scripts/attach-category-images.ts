/**
 * Attach images to the Shop by Category tiles.
 *
 *   npx tsx scripts/attach-category-images.ts <folder> [--prefix Saree_drape]
 *
 * Uploads images to ImageKit and stores one URL per category, matching sorted
 * filenames to the category order in lib/categories.ts.
 */

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { shopCategories } from '../lib/categories';
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
  if (!folder) throw new Error('Usage: attach-category-images.ts <folder> [--prefix X]');
  if (!isImageKitConfigured()) throw new Error('ImageKit is not configured.');

  const prefixArg = process.argv.indexOf('--prefix');
  const prefix = prefixArg > -1 ? process.argv[prefixArg + 1] : '';

  const files = fs
    .readdirSync(folder)
    .filter((f) => MIME[path.extname(f).toLowerCase()] && f.startsWith(prefix))
    .sort();

  const count = Math.min(files.length, shopCategories.length);
  console.log(`${files.length} images, ${shopCategories.length} categories -> attaching ${count}\n`);

  const settings = await prisma.homepageSettings.findUnique({ where: { id: 'homepage' } });
  const images = { ...((settings?.collectionImages ?? {}) as Record<string, string>) };

  for (let i = 0; i < count; i += 1) {
    const category = shopCategories[i];
    const file = path.join(folder, files[i]);
    const ext = path.extname(files[i]).toLowerCase();
    const dataUrl = `data:${MIME[ext]};base64,${fs.readFileSync(file).toString('base64')}`;

    const { url } = await uploadImage(dataUrl, { fileName: category.slug, folder: 'collections' });
    images[category.slug] = url;
    console.log(`  ${category.name.padEnd(30)} <- ${files[i]}`);
  }

  await prisma.homepageSettings.upsert({
    where: { id: 'homepage' },
    update: { collectionImages: images },
    create: { id: 'homepage', collectionImages: images, heroSlides: [] },
  });

  console.log(`\nDone: ${count} category tiles updated.`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
