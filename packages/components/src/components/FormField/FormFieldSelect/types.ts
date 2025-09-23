import type { ReactNode } from 'react';

import type { FormFieldControlGroupPropVariant } from '../FormFieldControlGroup';

export type FormFieldSelectBaseProps = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
  placeholder?: string | number;
  variant?: FormFieldControlGroupPropVariant;
};
