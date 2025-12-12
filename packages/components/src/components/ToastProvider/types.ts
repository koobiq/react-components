import type { CSSProperties, ReactElement } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

export const toastPropStatus = ['info', 'warning', 'error', 'success'] as const;

export type ToastPropStatus = (typeof toastPropStatus)[number];

export const toastPlacement = [
  'bottom',
  'bottom-start',
  'bottom-end',
  'top',
  'top-start',
  'top-end',
] as const;

export const toastStackDirection = ['ascending', 'descending'] as const;

export type ToastPlacement = (typeof toastPlacement)[number];

export type ToastStackDirection = (typeof toastStackDirection)[number];

export type ToastProviderProps = ExtendableComponentPropsWithRef<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /**
     * Where to show the toast stack on the screen.
     * @default 'top-end'
     */
    placement?: ToastPlacement;
    /**
     * Direction of toast stacking.
     * @default 'ascending'
     */
    stackDirection?: ToastStackDirection;
  },
  'div'
>;

export type ToastProviderComponent = (
  props: ToastProviderProps
) => ReactElement | null;
