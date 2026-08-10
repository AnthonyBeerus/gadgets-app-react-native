import React from 'react'; import { fireEvent, render } from '@testing-library/react-native'; import { Button } from '../primitives/Button'; import { ThemeProvider } from '../../providers/theme-provider'; import { DesignTokensProvider } from '../theme/DesignTokensProvider'; import { colors } from '../tokens/colors';
const wrap=(ui:React.ReactElement)=><ThemeProvider><DesignTokensProvider>{ui}</DesignTokensProvider></ThemeProvider>;
describe('Button',()=>{
 it('renders an ink primary action with square 2px structure',()=>{const x=render(wrap(<Button testID="button">Continue</Button>)).getByTestId('button');expect(x.props.style).toEqual(expect.arrayContaining([expect.objectContaining({backgroundColor:colors.ink,borderColor:colors.stroke})]));});
 it('renders the commerce action in blue',()=>{const x=render(wrap(<Button testID="button" variant="commerce">Pay now</Button>)).getByTestId('button');expect(x.props.style).toEqual(expect.arrayContaining([expect.objectContaining({backgroundColor:colors.commerce})]));});
 it('pairs a disabled action with its reason',()=>{const x=render(wrap(<Button disabled disabledReason="Add a phone number">Pay now</Button>));expect(x.getByText('Add a phone number')).toBeTruthy();});
 it('handles press',()=>{const onPress=jest.fn();const x=render(wrap(<Button testID="button" onPress={onPress}>Go</Button>));fireEvent.press(x.getByTestId('button'));expect(onPress).toHaveBeenCalledTimes(1);});

 // A pinned bar sizes its action with flex. That has to reach the outer wrapper,
 // or the key collapses to its label width inside a content-sized wrapper.
 it('moves layout styles to the wrapper and keeps visual styles on the key',()=>{
  const x=render(wrap(<Button testID="button" style={{flex:1,marginTop:8,backgroundColor:'#123456'}}>Pay now</Button>));
  const key=x.getByTestId('button');
  const flat=(styles:unknown)=>Object.assign({},...[styles].flat(9).filter(Boolean) as object[]);
  const keyStyle=flat(key.props.style);
  expect(keyStyle.flex).toBeUndefined();
  expect(keyStyle.marginTop).toBeUndefined();
  expect(keyStyle.backgroundColor).toBe('#123456');
  let node:any=key.parent,wrapper:any=null;
  while(node&&!wrapper){const style=flat(node.props?.style);if(style.alignItems==='stretch')wrapper=style;node=node.parent;}
  expect(wrapper).not.toBeNull();
  expect(wrapper.flex).toBe(1);
  expect(wrapper.marginTop).toBe(8);
 });
});
