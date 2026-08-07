/**
 * @deprecated Use `Tag` from `shared/design-system`.
 */
import React from 'react';
import { Tag, type TagProps } from '../../design-system';

export type NuviaTagProps = TagProps;

export const NuviaTag: React.FC<NuviaTagProps> = (props) => (
  <Tag {...props} />
);
