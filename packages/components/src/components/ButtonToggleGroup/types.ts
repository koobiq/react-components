import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { AriaToggleButtonGroupProps } from '@koobiq/react-primitives';

export type ButtonToggleGroupBaseProps = AriaToggleButtonGroupProps & {
  children?: ReactNode;
  fullWidth?: boolean;
  equalItemSize?: boolean;
};

export type ButtonToggleGroupProps = ExtendableComponentPropsWithRef<
  ButtonToggleGroupBaseProps,
  'div'
>;

export type ButtonToggleGroupRef = ComponentRef<'div'>;
