/**
 * @deprecated Use `Input` from `shared/design-system`.
 */
import React from 'react';
import { Input, type InputProps } from '../../design-system';

export type NuviaInputProps = InputProps;

export const NuviaInput: React.FC<NuviaInputProps> = (props) => (
  <Input {...props} />
);
