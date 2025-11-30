import { render, fireEvent } from '@testing-library/react-native';
import { FilterChip } from '../FilterChip';

describe('FilterChip', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it('renders label correctly', () => {
    const { getByText } = render(
      <FilterChip label="ALL" isActive={false} onPress={mockOnPress} />
    );
    
    expect(getByText('ALL')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const { getByText } = render(
      <FilterChip label="FREE" isActive={false} onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('FREE'));
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders active state correctly', () => {
    const { getByText } = render(
      <FilterChip label="PREMIUM" type="premium" isActive={true} onPress={mockOnPress} />
    );
    
    const chip = getByText('PREMIUM');
    expect(chip).toBeTruthy();
  });

  it('renders inactive state correctly', () => {
    const { getByText } = render(
      <FilterChip label="AI ALLOWED" type="ai" isActive={false} onPress={mockOnPress} />
    );
    
    const chip = getByText('AI ALLOWED');
    expect(chip).toBeTruthy();
  });

  it('handles different types correctly', () => {
    const types: Array<'default' | 'premium' | 'ai' | 'urgent'> = ['premium', 'ai', 'urgent'];
    
    types.forEach(type => {
      const { getByText } = render(
        <FilterChip label="ALL" type={type} isActive={true} onPress={mockOnPress} />
      );
      
      expect(getByText('ALL')).toBeTruthy();
    });
  });
});
