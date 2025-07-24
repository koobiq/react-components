import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  ReactElement,
  Ref,
} from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaTagGroupProps } from '@koobiq/react-primitives';

export const tagGroupPropVariant = [
  'theme-fade',
  'contrast-fade',
  'error-fade',
  'warning-fade',
] as const;

export type TagGroupPropVariant = (typeof tagGroupPropVariant)[number];

export type TagGroupProps<T extends object> = ExtendableProps<
  {
    /**
     * The variant to use.
     * @default 'theme-fade'
     */
    variant?: TagGroupPropVariant;
    /** Ref to the HTML ul-element. */
    ref?: Ref<HTMLElement>;
    /** Additional CSS-classes. */
    className?: string;
    /** Unique identifier for testing purposes. */
    'data-testid'?: string | number;
    /** Inline styles. */
    style?: CSSProperties;
    /** The props used for each slot inside. */
    slotProps?: {
      root?: ComponentPropsWithRef<'div'>;
    };
  },
  AriaTagGroupProps<T>
>;

export type TagGroupComponent = <T extends object>(
  props: TagGroupProps<T>
) => ReactElement | null;

export type TagGroupRef = ComponentRef<'div'>;
