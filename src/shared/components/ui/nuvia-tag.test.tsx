import React from 'react';
import { render } from '@testing-library/react-native';
import { NuviaTag } from './nuvia-tag';
import { NEO_THEME } from '../../constants/neobrutalism';

describe('NuviaTag', () => {
  it('renders label correctly', () => {
    const { getByText } = render(<NuviaTag label="New" />);
    expect(getByText('New')).toBeTruthy();
  });

  it('applies primary color by default', () => {
    const { getByTestId } = render(<NuviaTag label="Test" testID="tag" />);
    const tag = getByTestId('tag');
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: NEO_THEME.colors.primary }),
      ])
    );
  });

  it('renders different colors from theme', () => {
    const { getByTestId } = render(<NuviaTag label="Mint" color="#6EE7B7" testID="tag" />);
    const tag = getByTestId('tag');
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#6EE7B7' }),
      ])
    );
  });

  it('is always a pill shape', () => {
    const { getByTestId } = render(<NuviaTag label="Pill" testID="tag" />);
    const tag = getByTestId('tag');
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderRadius: 9999 }),
      ])
    );
  });
});
