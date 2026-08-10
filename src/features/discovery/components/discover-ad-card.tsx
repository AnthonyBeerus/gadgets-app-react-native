import { SponsoredCard } from '../../../shared/design-system';
import type { SponsoredDemo } from '../types';

export function DiscoverAdCard({ item, onContinue, onLearnMore }: { item: SponsoredDemo; onContinue: () => void; onLearnMore: () => void }) {
  return <SponsoredCard title={item.headline} body={item.body} onOpen={onLearnMore} onContinue={onContinue} />;
}
