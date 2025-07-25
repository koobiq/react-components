import type {
  Ref,
  ComponentRef,
  ReactElement,
  CSSProperties,
  ComponentPropsWithRef,
} from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaListBoxProps } from '@koobiq/react-primitives';

import type { TypographyProps } from '../Typography';

export type ListProps<T> = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /** Ref to the HTML ul-element. */
    ref?: Ref<HTMLElement>;
    /** The props used for each slot inside. */
    slotProps?: {
      label?: TypographyProps;
      list?: ComponentPropsWithRef<'div'>;
    };
  },
  AriaListBoxProps<T>
>;

export type ListRef = ComponentRef<'ul'>;

export type ListComponent = <T>(props: ListProps<T>) => ReactElement | null;
