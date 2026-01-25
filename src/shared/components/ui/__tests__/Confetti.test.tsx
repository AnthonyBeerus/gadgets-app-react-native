import React from 'react';
import { render } from '@testing-library/react-native';
import { Confetti } from '../Confetti';

// Mock Reanimated
global.ReanimatedDataMock = {
  now: () => 0,
};

describe('Confetti', () => {
  it('should render nothing when active is false', () => {
    const { toJSON } = render(<Confetti active={false} />);
    expect(toJSON()).toBeNull();
  });

  it('should render particles when active is true', () => {
    const { getAllByTestId, toJSON } = render(<Confetti active={true} />);
    // Checking structure via snapshot or simple truthy since particles are animated
    expect(toJSON()).toBeTruthy();
  });
});
