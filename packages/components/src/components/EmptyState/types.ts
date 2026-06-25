import type { ComponentPropsWithRef } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';

export const emptyStatePropSize = ['big', 'normal', 'compact'] as const;

export type EmptyStatePropSize = (typeof emptyStatePropSize)[number];

export const emptyStatePropAlign = ['start', 'center'] as const;

export type EmptyStatePropAlign = (typeof emptyStatePropAlign)[number];

export type EmptyStateBaseProps = {
  /**
   * The size of the component.
   * @default 'normal'
   */
  size?: EmptyStatePropSize;
  /**
   * Whether the EmptyState represents an invalid (error) state.
   * Paints the title, text and media with the error color.
   */
  isInvalid?: boolean;
  /**
   * The block alignment of the content within the available space.
   * @default 'center'
   */
  align?: EmptyStatePropAlign;
} & ComponentPropsWithRef<'div'> &
  DataAttributeProps;
