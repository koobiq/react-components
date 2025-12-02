import type { CSSProperties, ReactElement } from 'react';

import type { ToastState } from '@koobiq/react-primitives';

import type { MyToast } from './components';

export type ToastProviderProps<T extends object = MyToast> = {
  children?: (state: ToastState<T>) => ReactElement;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
};

export type ToastProviderComponent<T extends object = MyToast> = (
  props: ToastProviderProps<T>
) => ReactElement | null;
