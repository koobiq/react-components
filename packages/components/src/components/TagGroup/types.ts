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

export type TagGroupProps<T> = ExtendableProps<
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
  Omit<
    AriaTagGroupProps<T>,
    | 'label'
    | 'errorMessage'
    | 'description'
    | 'onSelectionChange'
    | 'selectedKeys'
    | 'selectionMode'
    | 'selectionBehavior'
    | 'shouldSelectOnPressUp'
    | 'disallowEmptySelection'
    | 'defaultSelectedKeys'
  >
>;

export type TagGroupComponent = <T>(
  props: TagGroupProps<T>
) => ReactElement | null;

export type TagGroupRef = ComponentRef<'div'>;
