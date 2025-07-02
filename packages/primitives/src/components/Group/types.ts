import type { ComponentRef } from 'react';

import type {
  ExtendableComponentPropsWithRef,
  ExtendableProps,
} from '@koobiq/react-core';

import type { RenderProps } from '../../utils';

export type GroupBaseProps = ExtendableComponentPropsWithRef<
  {
    isDisabled?: boolean;
    isInvalid?: boolean;
  },
  'div'
>;

export type GroupRef = ComponentRef<'div'>;

export type GroupRenderProps = {
  isIndeterminate?: boolean;
  percentage?: number;
  isHovered: boolean;
  isFocusWithin: boolean;
  isFocusVisible: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
};

export type GroupProps = ExtendableProps<
  RenderProps<GroupRenderProps>,
  GroupBaseProps
>;
