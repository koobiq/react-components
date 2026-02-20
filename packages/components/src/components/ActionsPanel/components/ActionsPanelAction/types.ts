import type { ReactNode } from 'react';

import type { ButtonProps } from '../../../Button';

export type ActionsPanelActionProps = Omit<
  ButtonProps,
  'startIcon' | 'endIcon'
> & {
  icon?: ReactNode;
};
