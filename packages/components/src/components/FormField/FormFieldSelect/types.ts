import type { ReactNode } from 'react';

export type FormFieldSelectBaseProps = {
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
  placeholder?: string | number;
};
