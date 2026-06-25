import type { ComponentPropsWithRef } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

export const emptyStatePropSize = ['big', 'normal', 'compact'] as const;

export type EmptyStatePropSize = (typeof emptyStatePropSize)[number];

export const emptyStatePropState = ['default', 'error'] as const;

export type EmptyStatePropState = (typeof emptyStatePropState)[number];

export type EmptyStateBaseProps = {
  /**
   * The size of the component.
   * @default 'normal'
   */
  size?: EmptyStatePropSize;
  /**
   * The visual state of the component.
   * @default 'default'
   */
  state?: EmptyStatePropState;
} & ComponentPropsWithRef<'div'> &
  DataAttributeProps;
