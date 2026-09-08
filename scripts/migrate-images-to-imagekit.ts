/**
 * Move every base64 image already in the database to ImageKit.
 *
 *   npx tsx scripts/migrate-images-to-imagekit.ts [--dry-run]
 *
 * Covers hero slides, category thumbnails and product images. Values that are
 * already URLs are left alone, so the script is safe to re-run.
 */

import { PrismaClient } from '@prisma/client';
import { isHostedUrl, isImageKitConfigured, uploadImage } from '../lib/imagekit';

const prisma = new PrismaClient();
const dryRun = process.argv.includes('--dry-run');

let uploaded = 0;
let skipped = 0;

async function toUrl(value: string, fileName: string, folder: string): Promise<string> {
  if (!value || isHostedUrl(value)) {
    skipped += 1;
    return value;
  }
  if (dryRun) {
    console.log(`  would upload ${folder}/${fileName} (${Math.round(value.length / 1024)} KB)`);
    uploaded += 1;
    return value;
  }
  const result = await uploadImage(value, { fileName, folder });
  uploaded += 1;
  console.log(`  ${folder}/${fileName} -> ${result.url}`);
  return result.url;
}

async function main() {
  if (!isImageKitConfigured()) {
    throw new Error(
      'ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT.'
    );
  }

  console.log(dryRun ? 'Dry run - nothing will be uploaded or written.\n' : 'Migrating images...\n');

  // Homepage: hero slides and category thumbnails
  const settings = await prisma.homepageSettings.findUnique({ where: { id: 'homepage' } });
  if (settings) {
    const slides = Array.isArray(settings.heroSlides) ? (settings.heroSlides as string[]) : [];
    const newSlides: string[] = [];
    for (const [i, slide] of slides.entries()) {
      newSlides.push(await toUrl(slide, `hero-${i + 1}`, 'hero'));
    }

    const collections = (settings.collectionImages ?? {}) as Record<string, string>;
    const newCollections: Record<string, string> = {};
    for (const [slug, image] of Object.entries(collections)) {
      newCollections[slug] = await toUrl(image, slug, 'collections');
    }

    if (!dryRun) {
      await prisma.homepageSettings.update({
        where: { id: 'homepage' },
        data: { heroSlides: newSlides, collectionImages: newCollections },
      });
    }
  }

  // Products
  const products = await prisma.product.findMany({ select: { id: true, sku: true, images: true } });
  for (const product of products) {
    const images = Array.isArray(product.images) ? (product.images as string[]) : [];
    if (!images.some((image) => image && !isHostedUrl(image))) {
      skipped += images.length;
      continue;
    }

    const migrated: string[] = [];
    for (const [i, image] of images.entries()) {
      migrated.push(await toUrl(image, `${product.sku}-${i + 1}`, 'products'));
    }

    if (!dryRun) {
      await prisma.product.update({ where: { id: product.id }, data: { images: migrated } });
    }
  }

  console.log(`\n${dryRun ? 'Would upload' : 'Uploaded'}: ${uploaded}   already hosted: ${skipped}`);
}

main()
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
