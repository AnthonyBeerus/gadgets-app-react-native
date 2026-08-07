import { TextStyle } from 'react-native';
import {
  textVariants as designTextVariants,
  type TextVariant,
} from '../design-system/tokens/typography';

export type { TextVariant };

/** @deprecated Prefer `textVariants` / `Text` from `shared/design-system` */
export const TEXT_VARIANTS: Record<TextVariant, TextStyle> = designTextVariants;
