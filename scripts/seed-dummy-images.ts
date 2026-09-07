/**
 * Seed dummy imagery for local development.
 *
 * Replaces every image currently stored in the database with a generated SVG
 * placeholder (stored as a base64 data URL, the same format the admin upload
 * produces) and fills in the homepage hero slides and category thumbnails.
 *
 * It also creates a dummy women's-wear catalogue so the homepage rails have
 * something to show. Products it created previously are recognised by their
 * `DUMMY-` SKU prefix and replaced, so the script is safe to re-run.
 *
 *   npx tsx scripts/seed-dummy-images.ts
 */

import { PrismaClient } from '@prisma/client';
import { shopCategories } from '../lib/categories';

const prisma = new PrismaClient();

const SKU_PREFIX = 'DUMMY-';

// Muted block-print palette: [background, motif, accent]
const palettes: Array<[string, string, string]> = [
  ['#f3ece1', '#8c5a3c', '#c9a227'],
  ['#eef1ec', '#3f5d45', '#a3b18a'],
  ['#f6eef0', '#7b1f2b', '#d9a5ad'],
  ['#ecf0f4', '#22304a', '#8ba3c7'],
  ['#f5efe6', '#a4633a', '#e0c097'],
  ['#eef3f3', '#2f6b6b', '#9dc5c3'],
];

/**
 * A block-print-ish placeholder: tinted ground, a repeating motif grid, a
 * border and a caption. Deterministic so re-runs produce the same image.
 */
function placeholder(label: string, width: number, height: number, seed: number): string {
  const [bg, motif, accent] = palettes[seed % palettes.length];
  const step = Math.round(Math.min(width, height) / 6);
  const motifs: string[] = [];

  for (let y = step / 2; y < height; y += step) {
    for (let x = step / 2; x < width; x += step) {
      const alternate = (Math.round(x / step) + Math.round(y / step)) % 2 === 0;
      motifs.push(
        alternate
          ? `<circle cx="${x}" cy="${y}" r="${step * 0.16}" fill="${motif}" opacity="0.35"/>`
          : `<rect x="${x - step * 0.13}" y="${y - step * 0.13}" width="${step * 0.26}" height="${
              step * 0.26
            }" transform="rotate(45 ${x} ${y})" fill="${accent}" opacity="0.5"/>`
      );
    }
  }

  // Wrap the caption so long category names stay inside the frame.
  const words = label.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    if ((line + ' ' + word).trim().length > 18) {
      lines.push(line.trim());
      line = word;
    } else {
      line = `${line} ${word}`;
    }
  }
  lines.push(line.trim());

  const fontSize = Math.round(Math.min(width, height) / 16);
  const startY = height / 2 - ((lines.length - 1) * fontSize * 1.3) / 2;
  const text = lines
    .map(
      (l, i) =>
        `<text x="${width / 2}" y="${
          startY + i * fontSize * 1.3
        }" font-family="Georgia,serif" font-size="${fontSize}" fill="${motif}" text-anchor="middle" dominant-baseline="middle">${l
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')}</text>`
    )
    .join('');

  const inset = Math.round(Math.min(width, height) * 0.03);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    `<rect width="${width}" height="${height}" fill="${bg}"/>` +
    motifs.join('') +
    `<rect x="${inset}" y="${inset}" width="${width - inset * 2}" height="${
      height - inset * 2
    }" fill="none" stroke="${motif}" stroke-width="${Math.max(2, inset / 4)}" opacity="0.6"/>` +
    `<rect x="0" y="${height / 2 - fontSize * lines.length}" width="${width}" height="${
      fontSize * lines.length * 2
    }" fill="${bg}" opacity="0.82"/>` +
    text +
    `</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

const isSaree = (categoryName: string) => categoryName.toLowerCase().includes('saree');

async function main() {
  console.log('Generating dummy imagery...\n');

  // --- Homepage: hero slides + category thumbnails -------------------------
  const heroSlides = ['New Arrivals', 'Hand Block Prints', 'Festive Edit'].map((label, i) =>
    placeholder(label, 1200, 1200, i)
  );

  const collectionImages: Record<string, string> = {};
  shopCategories.forEach((category, i) => {
    collectionImages[category.slug] = placeholder(category.name, 600, 600, i);
  });

  await prisma.homepageSettings.upsert({
    where: { id: 'homepage' },
    update: { heroBannerImage: null, heroSlides, collectionImages },
    create: { id: 'homepage', heroBannerImage: null, heroSlides, collectionImages },
  });
  console.log(`  homepage: ${heroSlides.length} hero slides, ${shopCategories.length} category tiles`);

  // --- Products ------------------------------------------------------------
  // Clear out anything this script created before, so re-runs do not pile up.
  const removed = await prisma.product.deleteMany({
    where: { sku: { startsWith: SKU_PREFIX } },
  });
  if (removed.count > 0) {
    console.log(`  removed ${removed.count} previously generated dummy products`);
  }

  let created = 0;
  let seed = 0;

  for (const category of shopCategories) {
    const saree = isSaree(category.name);
    // "Chanderi Silk Sarees" -> "Chanderi Silk Saree"
    const singular = category.name.replace(/s$/, '');

    for (let n = 1; n <= 3; n += 1) {
      const code = saree ? `BGPT ${1100 + seed}` : `(BG${30 + seed})`;
      const name = `${singular} ${code}`;
      const price = saree ? 2699 : 1449;
      const compareAtPrice = saree ? 4599 : 2050;

      await prisma.product.create({
        data: {
          name,
          price,
          compareAtPrice,
          description: `${category.description}. Dummy product generated for local development.`,
          images: [
            placeholder(name, 600, 800, seed),
            placeholder(`${singular} detail`, 600, 800, seed + 1),
            placeholder(`${singular} drape`, 600, 800, seed + 2),
          ],
          sizes: saree
            ? [{ value: 'Free Size', available: true, stock: 10 }]
            : [
                { value: 'S', available: true, stock: 4 },
                { value: 'M', available: true, stock: 6 },
                { value: 'L', available: true, stock: 5 },
                { value: 'XL', available: true, stock: 3 },
              ],
          inStock: true,
          sku: `${SKU_PREFIX}${category.slug.toUpperCase()}-${n}`,
          collection: category.name,
          searchKeywords: [
            ...category.name.toLowerCase().split(' '),
            saree ? 'saree' : 'suit',
            'block print',
          ],
        },
      });
      created += 1;
      seed += 1;
    }
  }
  console.log(`  products: created ${created} dummy products across ${shopCategories.length} categories`);

  // --- Replace imagery on any pre-existing (non-dummy) products ------------
  const others = await prisma.product.findMany({
    where: { NOT: { sku: { startsWith: SKU_PREFIX } } },
    select: { id: true, name: true },
  });

  for (const [i, product] of others.entries()) {
    await prisma.product.update({
      where: { id: product.id },
      data: {
        images: [
          placeholder(product.name, 600, 800, i),
          placeholder(`${product.name} detail`, 600, 800, i + 1),
        ],
      },
    });
  }
  if (others.length > 0) {
    console.log(`  products: replaced images on ${others.length} pre-existing products`);
  }

  console.log('\nDone. Restart or refresh the dev server to see the new imagery.');
}

main()
  .catch((error) => {
    console.error('Failed to seed dummy images:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
