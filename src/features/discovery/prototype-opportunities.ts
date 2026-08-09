import type { CreatorOpportunityFeedItem } from './types';

const deadline = '2026-12-15T18:00:00.000Z';
const disclaimer = 'Prototype campaign inferred from public ecosystem research; not a live offer or confirmed sponsorship.';

type Seed = {
  merchant: string;
  title: string;
  description: string;
  product: string;
  price: number;
  pot: number;
  fee: number;
  image: string;
};

const seeds: Seed[] = [
  { merchant: 'Miss World Botswana', title: 'Botswana in 60 Seconds', description: 'Create a short celebration of Botswana style, place and purpose for a Diamond Jubilee showcase.', product: 'Supporter experience pass', price: 150, pot: 12000, fee: 250, image: 'botswana-fashion' },
  { merchant: 'ABICOB Beauty Network', title: 'Beauty Made in Botswana', description: 'Show a locally made beauty routine and credit every stylist, artist and product behind the final look.', product: 'Local beauty discovery set', price: 180, pot: 7500, fee: 180, image: 'beauty-botswana' },
  { merchant: 'Lucara x Miss World Botswana', title: 'From Botswana to the World', description: 'Tell a responsible, people-first story about Botswana diamonds, craft and possibility.', product: 'Diamond story experience', price: 100, pot: 10000, fee: 225, image: 'diamond-story' },
  { merchant: 'Sefalana Shopper · Molapo', title: 'Cook Local, Share Local', description: 'Turn a basket of Botswana ingredients into a shoppable recipe reel your community can recreate.', product: 'A Star local recipe basket', price: 120, pot: 3500, fee: 100, image: 'local-food' },
  { merchant: 'The Dairy Shoppe · Molapo', title: 'My Botswana Comfort Food', description: 'Create a warm food story featuring traditional favourites such as madila, morogo or dinawa.', product: 'Traditional tasting basket', price: 95, pot: 2500, fee: 90, image: 'dairy-shoppe' },
  { merchant: "Tuelie's Corner Boutique · Molapo", title: 'One Sneaker, Three Gaborone Looks', description: 'Style one pair for work, weekend and a night out, then let the community shop the look.', product: 'Featured sneaker', price: 650, pot: 4000, fee: 140, image: 'sneaker-style' },
  { merchant: 'Aisha Perfumes · Molapo', title: 'What Does Gaborone Smell Like?', description: 'Translate a favourite local memory into a cinematic fragrance story.', product: 'Featured fragrance', price: 280, pot: 3000, fee: 110, image: 'fragrance-story' },
  { merchant: 'Viva Computers · Molapo', title: 'Build My Creator Desk', description: 'Show how a practical local tech upgrade improves editing, study or small-business work.', product: 'Creator desk bundle', price: 850, pot: 5000, fee: 160, image: 'creator-desk' },
  { merchant: 'Mobile City · Molapo', title: 'Shot on My Phone', description: 'Make a polished before-and-after reel using only a phone and simple creator techniques.', product: 'Mobile creator kit', price: 450, pot: 4000, fee: 140, image: 'mobile-creator' },
  { merchant: 'Jacks Gym · Molapo', title: 'The 60-Second Local Fitness Test', description: 'Invite friends into an accessible movement challenge with a safe, repeatable routine.', product: 'Challenge day pass', price: 100, pot: 3000, fee: 100, image: 'fitness-challenge' },
  { merchant: 'Molapo Creative Hub', title: 'Made at Molapo', description: 'Create a performance, fashion or visual-art teaser that turns local talent into a bookable experience.', product: 'Creative showcase ticket', price: 120, pot: 8000, fee: 200, image: 'creative-hub' },
  { merchant: 'DAI · Botswana to Asia', title: 'Exportable Botswana', description: 'Pitch one Botswana-made creative or beauty product to an Asia-Pacific audience in 45 seconds.', product: 'Export story showcase pass', price: 100, pot: 9000, fee: 220, image: 'botswana-export' },
];

export const PROTOTYPE_OPPORTUNITIES: CreatorOpportunityFeedItem[] = seeds.map((seed, index) => ({
  opportunity_id: -(index + 1), opportunity_title: seed.title, opportunity_description: seed.description,
  requirements: ['Create one original vertical video', 'Tag the featured business and Muse', 'Grant campaign reuse rights if accepted'],
  deadline, product_id: -(index + 101), product_slug: `prototype-${seed.image}`, product_title: seed.product,
  product_description: seed.description, hero_image: `https://picsum.photos/seed/${seed.image}/900/1100`, price: seed.price,
  max_quantity: 50, category_id: 1, merchant_id: -(index + 201), merchant_name: seed.merchant,
  merchant_location: 'Molapo Crossing / Gaborone ecosystem', mall_id: 1, has_delivery: false, has_collection: true,
  reward_value: seed.fee, reward_currency: 'BWP', preference_state: null, eligibility_proof_id: null,
  eligibility_consumed: false, rank_score: 100 - index, contest_mode: 'competitive_pot', pot_value: seed.pot,
  pot_currency: 'BWP', pot_splits: { '1': 0.4, '2': 0.25, '3': 0.15, '4': 0.1, '5': 0.1 },
  accepted_entry_fee: seed.fee, settled_at: null, score_rule: 'hybrid_quality_engagement',
  is_prototype: true, prototype_disclaimer: disclaimer,
}));

export function getPrototypeOpportunity(id: number) {
  return PROTOTYPE_OPPORTUNITIES.find(item => item.opportunity_id === id) ?? null;
}
