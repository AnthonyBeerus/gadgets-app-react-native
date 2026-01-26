import React from 'react';
import { render } from '@testing-library/react-native';
import { NuviaText } from './nuvia-text';
import { TEXT_VARIANTS } from '../../shared/theme/text-variants';

describe('NuviaText', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<NuviaText>Hello World</NuviaText>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('applies the correct styles for a variant', () => {
    const { getByText } = render(<NuviaText variant="h1">Heading</NuviaText>);
    const text = getByText('Heading');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: TEXT_VARIANTS.h1.fontSize }),
      ])
    );
  });

  it('allows overriding color', () => {
    const { getByText } = render(<NuviaText color="red">Red Text</NuviaText>);
    const text = getByText('Red Text');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: 'red' }),
      ])
    );
  });

  it('allows custom alignment', () => {
    const { getByText } = render(<NuviaText align="center">Centered</NuviaText>);
    const text = getByText('Centered');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ textAlign: 'center' }),
      ])
    );
  });
});
