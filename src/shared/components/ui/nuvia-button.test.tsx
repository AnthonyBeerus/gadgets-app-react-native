import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NuviaButton } from './nuvia-button';
import { colors } from '../../design-system/tokens';
import { radii } from '../../design-system/tokens';
import { ThemeProvider } from '../../providers/theme-provider';
import { DesignTokensProvider } from '../../design-system';

function wrap(ui: React.ReactElement) {
  return (
    <ThemeProvider>
      <DesignTokensProvider>{ui}</DesignTokensProvider>
    </ThemeProvider>
  );
}

describe('NuviaButton (compat wrapper)', () => {
  it('renders primary as ink', () => {
    const { getByTestId, getByText } = render(
      wrap(
        <NuviaButton testID="nuvia-button" onPress={() => {}}>
          Click Me
        </NuviaButton>,
      ),
    );
    expect(getByText('Click Me')).toBeTruthy();
    expect(getByTestId('nuvia-button').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.ink }),
      ]),
    );
  });

  it('renders secondary variant', () => {
    const { getByTestId } = render(
      wrap(
        <NuviaButton testID="nuvia-button" variant="secondary" onPress={() => {}}>
          Secondary
        </NuviaButton>,
      ),
    );
    expect(getByTestId('nuvia-button').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.surface }),
      ]),
    );
  });

  it('renders outline variant', () => {
    const { getByTestId } = render(
      wrap(
        <NuviaButton testID="nuvia-button" variant="outline" onPress={() => {}}>
          Outline
        </NuviaButton>,
      ),
    );
    expect(getByTestId('nuvia-button').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: colors.surface }),
      ]),
    );
  });

  it('handles press events', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      wrap(
        <NuviaButton testID="nuvia-button" onPress={onPressMock}>
          Press Me
        </NuviaButton>,
      ),
    );
    fireEvent.press(getByTestId('nuvia-button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('uses modest radius', () => {
    const { getByTestId } = render(
      wrap(
        <NuviaButton testID="nuvia-button" onPress={() => {}}>
          Shape
        </NuviaButton>,
      ),
    );
    expect(getByTestId('nuvia-button').props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderRadius: radii.md }),
      ]),
    );
  });
});
