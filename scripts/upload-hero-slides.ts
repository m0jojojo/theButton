/**
 * Upload hero slideshow images.
 *
 *   npx tsx scripts/upload-hero-slides.ts <image1> <image2> <image3>
 *
 * Each file is stored as a base64 data URL on homepage_settings.heroSlides,
 * the same format the admin upload produces.
 */

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MIME: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    throw new Error('Usage: upload-hero-slides.ts <image1> [image2] [image3]');
  }
  if (files.length > 3) {
    throw new Error('The slideshow shows at most three slides');
  }

  const slides = files.map((file) => {
    const ext = path.extname(file).toLowerCase();
    const mime = MIME[ext];
    if (!mime) throw new Error(`Unsupported image type: ${ext}`);

    const bytes = fs.readFileSync(file);
    const encoded = bytes.toString('base64');
    console.log(
      `  ${path.basename(file)}: ${(bytes.length / 1024).toFixed(0)} KB ` +
        `-> ${(encoded.length / 1024).toFixed(0)} KB encoded`
    );
    return `data:${mime};base64,${encoded}`;
  });

  await prisma.homepageSettings.upsert({
    where: { id: 'homepage' },
    update: { heroSlides: slides, heroBannerImage: null },
    create: { id: 'homepage', heroSlides: slides, heroBannerImage: null, collectionImages: {} },
  });

  const total = slides.reduce((sum, s) => sum + s.length, 0);
  console.log(`\nStored ${slides.length} slides (${(total / 1024).toFixed(0)} KB total).`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
