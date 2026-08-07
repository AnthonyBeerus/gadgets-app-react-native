import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../primitives/Button';
import { colors } from '../tokens/colors';
import { radii } from '../tokens/radii';
import { ThemeProvider } from '../../providers/theme-provider';
import { DesignTokensProvider } from '../theme/DesignTokensProvider';

function wrap(ui: React.ReactElement) {
  return (
    <ThemeProvider>
      <DesignTokensProvider>{ui}</DesignTokensProvider>
    </ThemeProvider>
  );
}

describe('Button', () => {
  it('renders primary as ink fill', () => {
    const { getByTestId, getByText } = render(
      wrap(
        <Button testID="btn" onPress={() => {}}>
          Continue
        </Button>,
      ),
    );
    expect(getByText('Continue')).toBeTruthy();
    expect(getByTestId('btn').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.ink }),
      ]),
    );
  });

  it('renders outline on surface with hairline border', () => {
    const { getByTestId } = render(
      wrap(
        <Button testID="btn" variant="outline" onPress={() => {}}>
          Outline
        </Button>,
      ),
    );
    expect(getByTestId('btn').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          backgroundColor: 'transparent',
          borderColor: colors.border,
        }),
      ]),
    );
  });

  it('uses modest radius, not pill-default', () => {
    const { getByTestId } = render(
      wrap(
        <Button testID="btn" onPress={() => {}}>
          Shape
        </Button>,
      ),
    );
    expect(getByTestId('btn').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderRadius: radii.md }),
      ]),
    );
  });

  it('handles press', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      wrap(
        <Button testID="btn" onPress={onPress}>
          Go
        </Button>,
      ),
    );
    fireEvent.press(getByTestId('btn'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('renders accent variant for challenge energy', () => {
    const { getByTestId } = render(
      wrap(
        <Button testID="btn" variant="accent" onPress={() => {}}>
          Enter
        </Button>,
      ),
    );
    expect(getByTestId('btn').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.accent }),
      ]),
    );
  });
});
