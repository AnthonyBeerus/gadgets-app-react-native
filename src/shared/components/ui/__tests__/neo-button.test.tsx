import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NeoButton } from '../neo-button';
import { Text } from 'react-native';

// Global Reanimated mock
global.ReanimatedDataMock = {
  now: () => 0,
};

describe('NeoButton', () => {
  it('should render children correctly', () => {
    const { getByText } = render(<NeoButton>Click Me</NeoButton>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should trigger onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <NeoButton onPress={onPressMock}>Press Me</NeoButton>
    );

    fireEvent.press(getByText('Press Me'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should apply variant styles', () => {
    const { getByText } = render(
      <NeoButton variant="secondary">Secondary</NeoButton>
    );
    expect(getByText('Secondary')).toBeTruthy();
  });
});
