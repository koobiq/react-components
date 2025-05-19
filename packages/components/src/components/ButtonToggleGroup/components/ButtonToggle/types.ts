import type { ComponentRef, ReactNode } from 'react';

import type { AriaToggleButtonGroupItemProps } from '@koobiq/react-primitives';

export type ButtonToggleProps = Omit<
  AriaToggleButtonGroupItemProps,
  'isDisabled'
> & {
  icon?: ReactNode;
  disabled?: boolean;
  /** Additional CSS-classes. */
  className?: string;
};

export type ButtonToggleRef = ComponentRef<'button'>;
