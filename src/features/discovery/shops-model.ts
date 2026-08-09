import type { CreatorOpportunityFeedItem } from './types';
import { PROTOTYPE_OPPORTUNITIES } from './prototype-opportunities';

export type ShopIntent = 'Eat' | 'Beauty' | 'Style' | 'Creator Tech' | 'Experiences';

export type MerchantProduct = {
  id: number;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  price: number;
  maxQuantity: number;
  category: number;
  shop_id: number;
};

export type MerchantSeed = {
  id: number;
  name: string;
  story: string;
  location: string;
  imageUrl: string;
  logoUrl?: string;
  phone?: string;
  whatsapp?: string;
  intent: ShopIntent;
  hasDelivery: boolean;
  hasCollection: boolean;
  isSponsored?: boolean;
  isPrototype: boolean;
  products: MerchantProduct[];
};

export type MerchantGrowthProfile = MerchantSeed & {
  opportunity: CreatorOpportunityFeedItem | null;
  creatorConcepts: string[];
};

const image = (seed: string) => `https://picsum.photos/seed/${seed}/1000/700`;
const product = (id: number, shopId: number, slug: string, title: string, price: number, category: number): MerchantProduct => ({
  id, shop_id: shopId, slug: `prototype-${slug}`, title,
  description: `Illustrative qualifying item from ${title}.`, heroImage: image(slug), price, maxQuantity: 30, category,
});

export const PROTOTYPE_MERCHANTS: MerchantSeed[] = [
  { id: -204, name: 'Sefalana Shopper · Molapo', story: 'A familiar Botswana grocer turning local ingredients into creator-led recipe discovery.', location: 'Molapo Crossing, Gaborone', imageUrl: image('sefalana-molapo'), intent: 'Eat', hasDelivery: false, hasCollection: true, isSponsored: true, isPrototype: true, products: [product(-104, -204, 'a-star-recipe-basket', 'A Star local recipe basket', 120, 1), product(-1004, -204, 'botswana-table-basket', 'Botswana table basket', 185, 1)] },
  { id: -205, name: 'The Dairy Shoppe · Molapo', story: 'Traditional Botswana comfort food made easier to discover, share and bring home.', location: 'Molapo Crossing, Gaborone', imageUrl: image('dairy-shoppe-molapo'), intent: 'Eat', hasDelivery: false, hasCollection: true, isPrototype: true, products: [product(-105, -205, 'traditional-tasting-basket', 'Traditional tasting basket', 95, 1), product(-1005, -205, 'madila-morogo-pairing', 'Madila and morogo pairing', 75, 1)] },
  { id: -206, name: "Tuelie's Corner Boutique · Molapo", story: 'A local fashion destination showing how one product becomes many Gaborone looks.', location: 'Molapo Crossing, Gaborone', imageUrl: image('tuelies-molapo'), intent: 'Style', hasDelivery: false, hasCollection: true, isPrototype: true, products: [product(-106, -206, 'featured-sneaker', 'Featured sneaker', 650, 2), product(-1006, -206, 'street-style-cap', 'Street-style cap', 180, 2)] },
  { id: -207, name: 'Aisha Perfumes · Molapo', story: 'Fragrance stories inspired by memory, place and personal expression.', location: 'Shop 6, ground floor, Molapo Crossing, Gaborone', imageUrl: image('aisha-perfumes'), phone: '+26777304777', whatsapp: '26777304777', intent: 'Beauty', hasDelivery: true, hasCollection: true, isPrototype: true, products: [product(-107, -207, 'featured-fragrance', 'Featured fragrance', 280, 4), product(-1007, -207, 'scent-discovery-set', 'Scent discovery set', 190, 4)] },
  { id: -208, name: 'Viva Computers · Molapo', story: 'Practical computers, repairs and creator-workstation upgrades for local digital work.', location: 'Molapo Crossing, Gaborone', imageUrl: image('viva-computers'), intent: 'Creator Tech', hasDelivery: true, hasCollection: true, isPrototype: true, products: [product(-108, -208, 'creator-desk-bundle', 'Creator desk bundle', 850, 3), product(-1008, -208, 'editing-accessory-kit', 'Editing accessory kit', 320, 3)] },
  { id: -209, name: 'Mobile City · Molapo', story: 'Phones, accessories and support for creators producing polished work from mobile.', location: 'Shop 7, ground floor, Molapo Crossing, Gaborone', imageUrl: image('mobile-city'), phone: '+26776365800', whatsapp: '26776365800', intent: 'Creator Tech', hasDelivery: true, hasCollection: true, isPrototype: true, products: [product(-109, -209, 'mobile-creator-kit', 'Mobile creator kit', 450, 3), product(-1009, -209, 'phone-tripod-light', 'Phone tripod and light', 230, 3)] },
  { id: -210, name: 'Jacks Gym · Molapo', story: 'Accessible local fitness experiences that communities can participate in and share.', location: 'Shop 108, ground floor, Molapo Crossing, Gaborone', imageUrl: image('jacks-gym'), phone: '+2673910060', intent: 'Experiences', hasDelivery: false, hasCollection: true, isPrototype: true, products: [product(-110, -210, 'challenge-day-pass', 'Challenge day pass', 100, 5), product(-1010, -210, 'training-week-pass', 'Training week pass', 260, 5)] },
  { id: -211, name: 'Molapo Creative Hub', story: 'A home for performance, fashion, visual art and local creative production.', location: 'Molapo Crossing, Gaborone', imageUrl: image('molapo-creative-hub'), intent: 'Experiences', hasDelivery: false, hasCollection: true, isPrototype: true, products: [product(-111, -211, 'creative-showcase-ticket', 'Creative showcase ticket', 120, 5), product(-1011, -211, 'studio-session-pass', 'Studio session pass', 300, 5)] },
  { id: -301, name: 'House of Scents · Molapo', story: 'A fragrance merchant ready for sensory creator storytelling and gifting collections.', location: 'Ground floor, Molapo Crossing, Gaborone', imageUrl: image('house-of-scents'), phone: '+26776171766', whatsapp: '26776171766', intent: 'Beauty', hasDelivery: true, hasCollection: true, isPrototype: true, products: [product(-1301, -301, 'house-scent-set', 'House scent set', 240, 4)] },
  { id: -302, name: 'Cutting Line Studio · Molapo', story: 'A salon experience where transformations can become useful, reusable social proof.', location: 'Shop 51A, first floor, Molapo Crossing, Gaborone', imageUrl: image('cutting-line'), phone: '+26772463216', whatsapp: '26772463216', intent: 'Beauty', hasDelivery: false, hasCollection: true, isPrototype: true, products: [product(-1302, -302, 'style-session', 'Style session', 350, 4)] },
  { id: -303, name: 'B4U Discount Centre · Molapo', story: 'A local gadget destination where practical creator tools can become useful demos and buying guides.', location: 'Shop 36A, ground floor, Molapo Crossing, Gaborone', imageUrl: image('b4u-discount'), phone: '+26771134040', whatsapp: '26771134040', intent: 'Creator Tech', hasDelivery: true, hasCollection: true, isPrototype: true, products: [product(-1303, -303, 'starter-content-kit', 'Starter content kit', 420, 3)] },
  { id: -304, name: 'Coupons · Molapo', story: 'School, office and celebration supplies that creators can turn into practical local how-tos.', location: 'Shop 15, ground floor, Molapo Crossing, Gaborone', imageUrl: image('coupons-molapo'), phone: '+26776734255', whatsapp: '26776734255', intent: 'Creator Tech', hasDelivery: false, hasCollection: true, isPrototype: true, products: [product(-1304, -304, 'creator-planning-kit', 'Creator planning kit', 250, 3)] },
];

export function buildMerchantGrowthProfiles(
  merchants: MerchantSeed[],
  opportunities: CreatorOpportunityFeedItem[],
): MerchantGrowthProfile[] {
  const opportunityByMerchant = new Map(opportunities.map(item => [item.merchant_id, item]));
  return merchants
    .map(merchant => ({
      ...merchant,
      opportunity: opportunityByMerchant.get(merchant.id) ?? null,
      creatorConcepts: [`How I use ${merchant.products[0]?.title ?? merchant.name}`, `A local story from ${merchant.name}`],
    }))
    .sort((a, b) => Number(b.isSponsored) - Number(a.isSponsored) || Number(Boolean(b.opportunity)) - Number(Boolean(a.opportunity)));
}

export function searchMerchantGrowthProfiles(profiles: MerchantGrowthProfile[], query: string) {
  const term = query.trim().toLowerCase();
  if (!term) return { merchants: profiles, opportunities: [], products: [] };
  const includes = (value: string) => value.toLowerCase().includes(term);
  return {
    merchants: profiles.filter(profile => includes(`${profile.name} ${profile.story} ${profile.intent}`)),
    opportunities: profiles.flatMap(profile => profile.opportunity ? [{ item: profile.opportunity, intent: profile.intent }] : [])
      .filter(({ item, intent }) => includes(`${item.opportunity_title} ${item.opportunity_description} ${item.merchant_name} ${intent}`))
      .map(({ item }) => item),
    products: profiles.flatMap(profile => profile.products.map(item => ({ item, intent: profile.intent })))
      .filter(({ item, intent }) => includes(`${item.title} ${item.description} ${intent}`))
      .map(({ item }) => item),
  };
}

export const PROTOTYPE_SHOP_PROFILES = buildMerchantGrowthProfiles(PROTOTYPE_MERCHANTS, PROTOTYPE_OPPORTUNITIES);

export function getPrototypeMerchant(id: number) {
  return PROTOTYPE_SHOP_PROFILES.find(profile => profile.id === id) ?? null;
}

export function getPrototypeProduct(slug: string) {
  return PROTOTYPE_SHOP_PROFILES.flatMap(profile => profile.products).find(item => item.slug === slug) ?? null;
}
