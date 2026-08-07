/**
 * @deprecated Use `Button` from `shared/design-system`.
 */
import React from 'react';
import { Button, type ButtonProps } from '../../design-system';

export type NeoButtonProps = ButtonProps;

export const NeoButton: React.FC<NeoButtonProps> = (props) => (
  <Button {...props} />
);
