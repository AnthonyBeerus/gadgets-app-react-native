import { render } from '@testing-library/react-native';
import { ChallengeBadge } from '../ChallengeBadge';

describe('ChallengeBadge', () => {
  it('renders premium badge correctly', () => {
    const { getByText } = render(
      <ChallengeBadge type="premium" text="PLUS MEMBER ONLY" icon="star" />
    );
    
    expect(getByText('PLUS MEMBER ONLY')).toBeTruthy();
  });

  it('renders fee badge correctly', () => {
    const { getByText } = render(
      <ChallengeBadge type="fee" text="ENTRY: 50 GEMS" icon="diamond" />
    );
    
    expect(getByText('ENTRY: 50 GEMS')).toBeTruthy();
  });

  it('renders status badge correctly', () => {
    const { getByText } = render(
      <ChallengeBadge type="status" text="ACTIVE" />
    );
    
    expect(getByText('ACTIVE')).toBeTruthy();
  });

  it('renders AI badge correctly', () => {
    const { getByText } = render(
      <ChallengeBadge type="ai" text="AI ALLOWED" icon="sparkles" />
    );
    
    expect(getByText('AI ALLOWED')).toBeTruthy();
  });

  it('renders without icon when not provided', () => {
    const { queryByTestId, getByText } = render(
      <ChallengeBadge type="status" text="COMPLETED" />
    );
    
    expect(getByText('COMPLETED')).toBeTruthy();
    // Icon should not be present
    expect(queryByTestId('badge-icon')).toBeNull();
  });
});
