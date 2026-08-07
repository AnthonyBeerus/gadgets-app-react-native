import React from 'react';
import { render } from '@testing-library/react-native';
import { NuviaTag } from './nuvia-tag';
import { colors } from '../../design-system/tokens';

describe('NuviaTag', () => {
  it('renders label correctly', () => {
    const { getByText } = render(<NuviaTag label="New" />);
    expect(getByText('New')).toBeTruthy();
  });

  it('applies neutral tone by default', () => {
    const { getByTestId } = render(<NuviaTag label="Test" testID="tag" />);
    const tag = getByTestId('tag');
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.gray100 }),
      ])
    );
  });

  it('renders custom color override', () => {
    const { getByTestId } = render(
      <NuviaTag label="Mint" color="#6EE7B7" testID="tag" />
    );
    const tag = getByTestId('tag');
    expect(tag.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#6EE7B7' }),
      ])
    );
  });
});
