import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NuviaButton } from './nuvia-button';
import { NEO_THEME } from '../../constants/neobrutalism';

describe('NuviaButton', () => {
  it('renders correctly with default props', () => {
    const { getByText, getByTestId } = render(
      <NuviaButton testID="nuvia-button" onPress={() => {}}>
        Click Me
      </NuviaButton>
    );

    const button = getByTestId('nuvia-button');
    const text = getByText('Click Me');

    expect(text).toBeTruthy();
    // Default variant is primary
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: NEO_THEME.colors.primary }),
      ])
    );
  });

  it('renders secondary variant correctly', () => {
    const { getByTestId } = render(
      <NuviaButton testID="nuvia-button" variant="secondary" onPress={() => {}}>
        Secondary
      </NuviaButton>
    );
    const button = getByTestId('nuvia-button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: NEO_THEME.colors.secondary }),
      ])
    );
  });

  it('renders outline variant correctly', () => {
    const { getByTestId } = render(
      <NuviaButton testID="nuvia-button" variant="outline" onPress={() => {}}>
        Outline
      </NuviaButton>
    );
    const button = getByTestId('nuvia-button');
    expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: NEO_THEME.colors.white }),
        expect.objectContaining({ borderWidth: NEO_THEME.borders.width }),
      ])
    );
  });

  it('handles press events', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <NuviaButton testID="nuvia-button" onPress={onPressMock}>
        Press Me
      </NuviaButton>
    );

    fireEvent.press(getByTestId('nuvia-button'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('applies pill shape (border radius 9999)', () => {
     const { getByTestId } = render(
      <NuviaButton testID="nuvia-button" onPress={() => {}}>
        Pill Shape
      </NuviaButton>
    );
    const button = getByTestId('nuvia-button');
     expect(button.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ borderRadius: 9999 }),
      ])
    );
  });
});
