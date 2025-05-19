import type { ComponentRef, ReactNode } from 'react';

import type { AriaToggleButtonGroupItemProps } from '@koobiq/react-primitives';

export type ButtonToggleProps = Omit<
  AriaToggleButtonGroupItemProps,
  'isDisabled'
> & {
  /** Icon placed before the children. */
  icon?: ReactNode;
  /**
   * If `true`, the component is disabled.
   * @default false
   * */
  disabled?: boolean;
  /** Additional CSS-classes. */
  className?: string;
};

export type ButtonToggleRef = ComponentRef<'button'>;
