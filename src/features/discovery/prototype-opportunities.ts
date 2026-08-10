import type { CreatorOpportunityFeedItem } from './types';

const deadline = '2026-12-15T18:00:00.000Z';
const disclaimer = 'Prototype campaign inferred from public ecosystem research; not a live offer or confirmed sponsorship.';

type Seed = {
  merchant: string;
  title: string;
  description: string;
  pot: number;
  image: string;
};

const seeds: Seed[] = [
  { merchant: 'Miss World Botswana', title: 'Botswana in 60 Seconds', description: 'Create a short celebration of Botswana style, place and purpose for a Diamond Jubilee showcase.', pot: 12000, image: 'botswana-fashion' },
  { merchant: 'ABICOB Beauty Network', title: 'Beauty Made in Botswana', description: 'Show a locally made beauty routine and credit every stylist, artist and product behind the final look.', pot: 7500, image: 'beauty-botswana' },
  { merchant: 'Lucara x Miss World Botswana', title: 'From Botswana to the World', description: 'Tell a responsible, people-first story about Botswana diamonds, craft and possibility.', pot: 10000, image: 'diamond-story' },
  { merchant: 'Sefalana Shopper · Molapo', title: 'Cook Local, Share Local', description: 'Turn a basket of Botswana ingredients into a shoppable recipe reel your community can recreate.', pot: 3500, image: 'local-food' },
  { merchant: 'The Dairy Shoppe · Molapo', title: 'My Botswana Comfort Food', description: 'Create a warm food story featuring traditional favourites such as madila, morogo or dinawa.', pot: 2500, image: 'dairy-shoppe' },
  { merchant: "Tuelie's Corner Boutique · Molapo", title: 'One Sneaker, Three Gaborone Looks', description: 'Style one pair for work, weekend and a night out, then let the community shop the look.', pot: 4000, image: 'sneaker-style' },
  { merchant: 'Aisha Perfumes · Molapo', title: 'What Does Gaborone Smell Like?', description: 'Translate a favourite local memory into a cinematic fragrance story.', pot: 3000, image: 'fragrance-story' },
  { merchant: 'Viva Computers · Molapo', title: 'Build My Creator Desk', description: 'Show how a practical local tech upgrade improves editing, study or small-business work.', pot: 5000, image: 'creator-desk' },
  { merchant: 'Mobile City · Molapo', title: 'Shot on My Phone', description: 'Make a polished before-and-after reel using only a phone and simple creator techniques.', pot: 4000, image: 'mobile-creator' },
  { merchant: 'Jacks Gym · Molapo', title: 'The 60-Second Local Fitness Test', description: 'Invite friends into an accessible movement challenge with a safe, repeatable routine.', pot: 3000, image: 'fitness-challenge' },
  { merchant: 'Molapo Creative Hub', title: 'Made at Molapo', description: 'Create a performance, fashion or visual-art teaser that turns local talent into a bookable experience.', pot: 8000, image: 'creative-hub' },
  { merchant: 'DAI · Botswana to Asia', title: 'Exportable Botswana', description: 'Pitch one Botswana-made creative or beauty product to an Asia-Pacific audience in 45 seconds.', pot: 9000, image: 'botswana-export' },
];

export const PROTOTYPE_OPPORTUNITIES: CreatorOpportunityFeedItem[] = seeds.map((seed, index) => ({
  opportunity_id: -(index + 1),
  opportunity_title: seed.title,
  opportunity_description: seed.description,
  requirements: ['Create one original vertical video', 'Tag the featured business and Muse', 'Grant campaign reuse rights if accepted'],
  talking_points: ['Show the product in real use', 'Say why it matters locally'],
  dos: ['Film vertically in natural light'],
  donts: ['No competitor branding on screen'],
  deadline,
  hero_image: `https://picsum.photos/seed/${seed.image}/900/1100`,
  brand_asset_paths: [],
  category: null,
  campaign_goal: 'ugc_library',
  content_format: 'video',
  deliverable_count: 1,
  video_min_seconds: 15,
  video_max_seconds: 60,
  usage_rights: 'organic_social_12m',
  revisions_allowed: 1,
  review_sla_days: 5,
  merchant_id: -(index + 201),
  merchant_name: seed.merchant,
  merchant_location: 'Molapo Crossing / Gaborone ecosystem',
  mall_id: 1,
  preference_state: null,
  participants_count: 0,
  has_joined: false,
  my_submission_status: null,
  status: 'published',
  pot_value: seed.pot,
  pot_currency: 'BWP',
  pot_splits: { '1': 0.4, '2': 0.25, '3': 0.15, '4': 0.1, '5': 0.1 },
  settled_at: null,
  rank_score: 100 - index,
  is_prototype: true,
  prototype_disclaimer: disclaimer,
}));

export function getPrototypeOpportunity(id: number) {
  return PROTOTYPE_OPPORTUNITIES.find(item => item.opportunity_id === id) ?? null;
}
