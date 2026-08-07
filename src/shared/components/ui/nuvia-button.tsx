/**
 * @deprecated Use `Button` from `shared/design-system`.
 * Thin wrapper for migration.
 */
import React from 'react';
import {
  Button,
  type ButtonProps,
  type ButtonVariant,
} from '../../design-system';

export type NuviaButtonProps = ButtonProps;

export const NuviaButton: React.FC<NuviaButtonProps> = (props) => (
  <Button {...props} />
);

export type { ButtonVariant };
