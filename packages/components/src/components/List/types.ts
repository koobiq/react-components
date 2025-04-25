import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  ReactElement,
  ReactNode,
  Ref,
} from 'react';

import type { AriaListBoxProps } from '@koobiq/react-primitives';

import type { TypographyProps } from '../Typography';

export const listPropSelectionMode = ['none', 'single', 'multiple'] as const;

export type ListPropSelectionMode = (typeof listPropSelectionMode)[number];

export type ListPropItems<T extends object> = AriaListBoxProps<T>['items'];

export type ListPropChildren<T extends object> =
  AriaListBoxProps<T>['children'];

export type ListPropSelectedKeys<T extends object> =
  AriaListBoxProps<T>['selectedKeys'];

export type ListPropDefaultSelectedKeys<T extends object> =
  AriaListBoxProps<T>['defaultSelectedKeys'];

export type ListPropDisabledKeys<T extends object> =
  AriaListBoxProps<T>['disabledKeys'];

export type ListPropOnSelectionChange<T extends object> =
  AriaListBoxProps<T>['onSelectionChange'];

export type ListPropOnAction<T extends object> =
  AriaListBoxProps<T>['onAction'];

export type ListPropSelectionBehavior<T extends object> =
  AriaListBoxProps<T>['selectionBehavior'];

export type ListBaseProps<T extends object> = {
  label?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Inline styles. */
  style?: CSSProperties;
  /** The type of selection that is allowed in the collection. */
  selectionMode?: ListPropSelectionMode;
  /** Ref to the HTML ul-element. */
  ref?: Ref<HTMLElement>;
  /** The contents of the collection. */
  children?: ListPropChildren<T>;
  /** Item objects in the collection. */
  items?: ListPropItems<T>;
  /** The currently selected keys in the collection (controlled). */
  selectedKeys?: ListPropSelectedKeys<T>;
  /** The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. */
  disabledKeys?: ListPropDisabledKeys<T>;
  /** The initial selected keys in the collection (uncontrolled). */
  defaultSelectedKeys?: ListPropDefaultSelectedKeys<T>;
  /** Handler that is called when the selection changes. */
  onSelectionChange?: ListPropOnSelectionChange<T>;
  /**
   * Handler that is called when a user performs an action on an item. The exact user event depends on
   * the collection's `selectionBehavior` prop and the interaction modality.
   */
  onAction?: ListPropOnAction<T>;
  /** How multiple selection should behave in the collection. */
  selectionBehavior?: ListPropSelectionBehavior<T>;
  /** Whether to autofocus the list or an option. */
  autoFocus?: boolean | 'first' | 'last';
  /** The props used for each slot inside. */
  slotProps?: {
    label?: TypographyProps;
    list?: ComponentPropsWithRef<'div'>;
  };
};

export type ListProps<T extends object> = ListBaseProps<T>;

export type ListRef = ComponentRef<'ul'>;

export type ListComponentProps = <T extends object>(
  props: ListProps<T>
) => ReactElement | null;
