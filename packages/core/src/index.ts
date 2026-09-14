import type {
  ForwardRefExoticComponent,
  ReactElement,
  RefAttributes,
} from 'react';

import { Pressable as AriaPressable } from '@react-aria/interactions';
import type { PressProps } from '@react-aria/interactions';
import type { DOMAttributes, FocusableElement } from '@react-types/shared';

export {
  chain,
  useId,
  useRouter,
  mergeProps,
  filterDOMProps,
  RouterProvider,
  handleLinkClick,
  useLinkProps,
  mergeRefs,
  useObjectRef,
  useDescription,
} from '@react-aria/utils';

export type {
  Key,
  Node,
  ItemProps,
  Collection,
  PressEvent,
  HoverEvent,
  Validation,
  SectionProps,
  LinkDOMProps,
  CollectionBase,
  DOMAttributes,
  MultipleSelection,
  FocusableElement,
  ValidationResult,
  AsyncLoadable,
  FocusableProps,
  InputBase,
  LabelableProps,
  TextInputBase,
  GlobalDOMAttributes,
  AriaLabelingProps,
  DOMProps,
  RefObject,
  CollectionChildren,
  CollectionElement,
  RouterOptions,
  SortDescriptor,
  HelpTextProps,
  Selection,
  FocusStrategy,
} from '@react-types/shared';

export * from '@react-aria/i18n';
export * from '@react-aria/focus';
export * from '@react-stately/utils';
export * from '@react-aria/interactions';

/**
 * React Aria keeps the props type of its `Pressable` internal, which leaves it
 * unnameable in declaration output. Mirror it here and re-export the component
 * with the local type — the assignment below breaks if React Aria's shape drifts.
 */
export interface PressableProps extends PressProps {
  children: ReactElement<DOMAttributes, string>;
}

export const Pressable: ForwardRefExoticComponent<
  PressableProps & RefAttributes<FocusableElement>
> = AriaPressable;
export type { FormProps } from '@react-types/form';

export * from './types';
export * from './hooks';
export * from './utils';
export * from './styles';
