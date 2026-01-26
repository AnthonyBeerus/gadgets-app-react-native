import { TextStyle } from 'react-native';
import { NEO_THEME } from '../constants/neobrutalism';

export type TextVariant = 
  | 'display'
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'body' 
  | 'bodyBold' 
  | 'label' 
  | 'caption';

export const TEXT_VARIANTS: Record<TextVariant, TextStyle> = {
  display: {
    fontFamily: NEO_THEME.fonts.displayBlack,
    fontSize: 48,
    lineHeight: 56,
    color: NEO_THEME.colors.black,
  },
  h1: {
    fontFamily: NEO_THEME.fonts.displayBold,
    fontSize: 32,
    lineHeight: 40,
    color: NEO_THEME.colors.black,
  },
  h2: {
    fontFamily: NEO_THEME.fonts.displaySemibold,
    fontSize: 24,
    lineHeight: 32,
    color: NEO_THEME.colors.black,
  },
  h3: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 20,
    lineHeight: 28,
    color: NEO_THEME.colors.black,
  },
  body: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: NEO_THEME.colors.dark,
  },
  bodyBold: {
    fontFamily: NEO_THEME.fonts.bold,
    fontSize: 16,
    lineHeight: 24,
    color: NEO_THEME.colors.dark,
  },
  label: {
    fontFamily: NEO_THEME.fonts.semibold,
    fontSize: 14,
    lineHeight: 20,
    color: NEO_THEME.colors.dark,
  },
  caption: {
    fontFamily: NEO_THEME.fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: NEO_THEME.colors.grey,
  },
};
