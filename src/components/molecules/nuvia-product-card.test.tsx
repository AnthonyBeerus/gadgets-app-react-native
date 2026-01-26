import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NuviaProductCard } from './nuvia-product-card';

describe('NuviaProductCard', () => {
  const mockProduct = {
    id: '1',
    title: 'Nuvia Headphones',
    price: 99,
    heroImage: 'https://example.com/image.jpg',
    category: 'Electronics',
  };

  it('renders product information correctly', () => {
    const { getByText } = render(
      <NuviaProductCard product={mockProduct} onPress={() => {}} />
    );

    expect(getByText('Nuvia Headphones')).toBeTruthy();
    expect(getByText('$99')).toBeTruthy();
  });

  it('handles press event', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <NuviaProductCard 
        product={mockProduct} 
        onPress={onPressMock} 
        testID="product-card" 
      />
    );

    fireEvent.press(getByTestId('product-card'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('renders a badge if provided (e.g., Sale)', () => {
    const { getByText } = render(
      <NuviaProductCard 
        product={mockProduct} 
        onPress={() => {}} 
        badge="Sale" 
      />
    );
    expect(getByText('Sale')).toBeTruthy();
  });
});
