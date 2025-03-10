import type { ComponentRef } from 'react';

import type {
  ExtendableComponentPropsWithRef,
  ExtendableProps,
} from '@koobiq/react-core';

import type { RenderProps } from '../../utils';

export type GroupBaseProps = ExtendableComponentPropsWithRef<
  {
    disabled?: boolean;
    error?: boolean;
  },
  'div'
>;

export type GroupRef = ComponentRef<'div'>;

export type GroupRenderProps = {
  indeterminate?: boolean;
  percentage?: number;
  hovered: boolean;
  focusWithin: boolean;
  focusVisible: boolean;
  disabled: boolean;
  error: boolean;
};

export type GroupProps = ExtendableProps<
  RenderProps<GroupRenderProps>,
  GroupBaseProps
>;
