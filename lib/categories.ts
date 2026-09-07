/**
 * Shop by Category
 *
 * Single source of truth for the product categories shown in the homepage
 * carousel. The `slug` doubles as the collection route (/collections/<slug>),
 * the key under `HomepageSettings.collectionImages`, and the value stored on a
 * product's `collection` field is the `name`.
 */

export interface ShopCategory {
  slug: string;
  name: string;
  description: string;
}

export const shopCategories: ShopCategory[] = [
  {
    slug: 'chanderi-silk-sarees',
    name: 'Chanderi Silk Sarees',
    description: 'Feather-light Chanderi silk with a signature sheer finish',
  },
  {
    slug: 'maheshwari-silk-sarees',
    name: 'Maheshwari Silk Sarees',
    description: 'Handwoven Maheshwari silk with classic reversible borders',
  },
  {
    slug: 'cotton-sarees',
    name: 'Cotton Sarees',
    description: 'Breathable everyday cotton sarees in hand block prints',
  },
  {
    slug: 'cotton-linen-sarees',
    name: 'Cotton Linen Sarees',
    description: 'Cotton linen blends with a crisp drape and soft texture',
  },
  {
    slug: 'nashpal-pomegranate-sarees',
    name: 'Nashpal Pomegranate Sarees',
    description: 'Naturally dyed with pomegranate rind for warm earthy tones',
  },
  {
    slug: 'double-diamond-chiffon-sarees',
    name: 'Double Diamond Chiffon Sarees',
    description: 'Flowing chiffon in the traditional double diamond motif',
  },
  {
    slug: 'mulmul-sarees',
    name: 'Mulmul Sarees',
    description: 'Soft mulmul cotton, light enough for all-day wear',
  },
  {
    slug: 'cotton-suit-sets',
    name: 'Cotton Suit Sets',
    description: 'Coordinated hand block printed cotton suit sets',
  },
  {
    slug: 'linen-suits',
    name: 'Linen Suits',
    description: 'Pure linen suits with an easy, structured fall',
  },
  {
    slug: 'kota-dupatta-cotton-suits',
    name: 'Kota Dupatta Cotton Suits',
    description: 'Cotton suits paired with sheer Kota doria dupattas',
  },
  {
    slug: 'linen-dupatta-cotton-suits',
    name: 'Linen Dupatta Cotton Suits',
    description: 'Cotton suits finished with a textured linen dupatta',
  },
];

export const categoryBySlug = new Map(
  shopCategories.map((category) => [category.slug, category])
);
