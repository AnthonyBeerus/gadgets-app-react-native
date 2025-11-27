import { render } from '@testing-library/react-native';
import { RewardCard } from '../RewardCard';

describe('RewardCard', () => {
  it('renders reward text correctly', () => {
    const { getByText } = render(
      <RewardCard reward="$500 Cash Prize" />
    );
    
    expect(getByText('$500 Cash Prize')).toBeTruthy();
  });

  it('renders with different reward amounts', () => {
    const rewards = [
      '$1000 Grand Prize',
      'Free iPhone 15',
      '1 Year Premium Subscription'
    ];
    
    rewards.forEach(reward => {
      const { getByText } = render(<RewardCard reward={reward} />);
      expect(getByText(reward)).toBeTruthy();
    });
  });
});
