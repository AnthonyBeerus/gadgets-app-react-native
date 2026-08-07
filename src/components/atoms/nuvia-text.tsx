/**
 * @deprecated Use `Text` from `shared/design-system`.
 */
import React from 'react';
import { Text, type MuseTextProps } from '../../shared/design-system';

export type NuviaTextProps = MuseTextProps;

export const NuviaText: React.FC<NuviaTextProps> = (props) => (
  <Text {...props} />
);
