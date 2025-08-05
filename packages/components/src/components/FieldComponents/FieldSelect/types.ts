import type { ReactNode } from 'react';

import type { FieldInputGroupPropVariant } from '../FieldContentGroup';

export type FieldSelectBaseProps = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
  placeholder?: string | number;
  variant?: FieldInputGroupPropVariant;
};
