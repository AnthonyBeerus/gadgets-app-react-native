import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NuviaShopCard } from './nuvia-shop-card';

describe('NuviaShopCard', () => {
  const mockShop = {
    id: '1',
    name: 'Muse Shop',
    image_url: 'https://example.com/shop.jpg',
    category: { name: 'Fashion' },
    rating: 4.8,
    is_open: true,
  };

  it('renders shop information correctly', () => {
    const { getByText } = render(<NuviaShopCard shop={mockShop} onPress={() => {}} />);
    expect(getByText('Muse Shop')).toBeTruthy();
    expect(getByText('Fashion')).toBeTruthy();
    expect(getByText('4.8')).toBeTruthy();
  });

  it('handles press event', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<NuviaShopCard shop={mockShop} onPress={onPressMock} />);
    fireEvent.press(getByText('Muse Shop'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('shows CLOSED badge when shop is closed', () => {
    const closedShop = { ...mockShop, is_open: false };
    const { getByText } = render(<NuviaShopCard shop={closedShop} onPress={() => {}} />);
    expect(getByText('CLOSED')).toBeTruthy();
  });
});
