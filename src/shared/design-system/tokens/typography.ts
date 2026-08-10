import type { TextStyle } from 'react-native';
import type { SemanticColors } from './colors';

export const fonts = {
  regular: 'SpaceGrotesk_400Regular', medium: 'SpaceGrotesk_500Medium', semibold: 'SpaceGrotesk_700Bold',
  bold: 'SpaceGrotesk_700Bold', displaySemibold: 'Archivo_700Bold', displayBold: 'Archivo_800ExtraBold',
  displayBlack: 'Archivo_900Black',
} as const;

export type TextVariant = 'display' | 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'bodySm' | 'label' | 'caption';

export function resolveTextVariants(c: SemanticColors, dark = false): Record<TextVariant, TextStyle> {
  return {
    display: { fontFamily: dark ? fonts.displayBold : fonts.displayBlack, fontSize: 34, lineHeight: 33, letterSpacing: -1.02, color: c.ink, textTransform: 'uppercase' },
    h1: { fontFamily: fonts.displayBlack, fontSize: 28, lineHeight: 30, letterSpacing: -0.84, color: c.ink },
    h2: { fontFamily: fonts.displayBold, fontSize: 20, lineHeight: 24, letterSpacing: -0.4, color: c.ink },
    h3: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 20, color: c.ink },
    body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22, color: c.ink },
    bodyBold: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 22, color: c.ink },
    bodySm: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 19, color: c.ink },
    label: { fontFamily: fonts.bold, fontSize: 10, lineHeight: 14, letterSpacing: 1.4, textTransform: 'uppercase', color: c.inkMuted },
    caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: c.inkMuted },
  };
}

export const textVariants = resolveTextVariants({ ink: '#101010', inkMuted: '#5F5C55' } as SemanticColors);
