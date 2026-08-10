import React from 'react'; import { fireEvent, render } from '@testing-library/react-native'; import { Button } from '../primitives/Button'; import { ThemeProvider } from '../../providers/theme-provider'; import { DesignTokensProvider } from '../theme/DesignTokensProvider'; import { colors } from '../tokens/colors';
const wrap=(ui:React.ReactElement)=><ThemeProvider><DesignTokensProvider>{ui}</DesignTokensProvider></ThemeProvider>;
describe('Button',()=>{
 it('renders an ink primary action with square 2px structure',()=>{const x=render(wrap(<Button testID="button">Continue</Button>)).getByTestId('button');expect(x.props.style).toEqual(expect.arrayContaining([expect.objectContaining({backgroundColor:colors.ink,borderColor:colors.stroke})]));});
 it('renders the commerce action in blue',()=>{const x=render(wrap(<Button testID="button" variant="commerce">Pay now</Button>)).getByTestId('button');expect(x.props.style).toEqual(expect.arrayContaining([expect.objectContaining({backgroundColor:colors.commerce})]));});
 it('pairs a disabled action with its reason',()=>{const x=render(wrap(<Button disabled disabledReason="Add a phone number">Pay now</Button>));expect(x.getByText('Add a phone number')).toBeTruthy();});
 it('handles press',()=>{const onPress=jest.fn();const x=render(wrap(<Button testID="button" onPress={onPress}>Go</Button>));fireEvent.press(x.getByTestId('button'));expect(onPress).toHaveBeenCalledTimes(1);});
});
