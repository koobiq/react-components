'use client';

import { useContext } from 'react';
import type { ElementType, ForwardedRef } from 'react';

import {
  clsx,
  mergeProps,
  useHover,
  usePress,
  useObjectRef,
  filterDOMProps,
} from '@koobiq/react-core';
import type {
  Node,
  Key,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';
import {
  useOption,
  createLeafComponent,
  ItemNode,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Checkbox } from '../../../Checkbox';
import { SelectContext } from '../../SelectContext';

const textVariant = utilClasses.typography;
const { listItem } = utilClasses;

export type SelectOptionProps<T = object> = ExtendableComponentPropsWithRef<
  {
    className?: string;
    /** The unique id of the item. */
    id?: Key;
    /** The object value that this item represents. When using dynamic collections, this is set automatically. */
    value?: T;
    /** A string representation of the item's contents, used for features like typeahead. */
    textValue?: string;
    /** An accessibility label for this item. */
    'aria-label'?: string;
    /** Whether the item is disabled. */
    isDisabled?: boolean;
    /**
     * Handler that is called when a user performs an action on the item. The exact user event depends on
     * the collection's `selectionBehavior` prop and the interaction modality.
     */
    onAction?: () => void;
  },
  'a'
>;

export const SelectOption = createLeafComponent(ItemNode, function SelectItem<
  T extends object,
>(props: SelectOptionProps, forwardedRef: ForwardedRef<HTMLElement>, item: Node<T>) {
  const { href, className, style } = props;

  const ref = useObjectRef<any>(forwardedRef);
  const state = useContext(SelectContext)!;

  const { optionProps, isSelected, isDisabled, isFocusVisible } = useOption(
    { key: item.key },
    state,
    ref
  );

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { isPressed, pressProps } = usePress({ isDisabled });

  const Tag: ElementType = href ? 'a' : 'li';

  const DOMProps = filterDOMProps(props as any, { global: true });
  delete DOMProps.id;
  delete DOMProps.onClick;

  return (
    <Tag
      {...mergeProps(optionProps, hoverProps, pressProps)}
      className={clsx(listItem, textVariant['text-normal'], className)}
      style={style}
      ref={ref}
      data-hovered={isHovered || undefined}
      data-pressed={isPressed || undefined}
      data-disabled={isDisabled || undefined}
      data-selected={isSelected || undefined}
      data-focus-visible={isFocusVisible || undefined}
    >
      {state.selectionMode === 'multiple' && (
        <Checkbox isDisabled={isDisabled} isSelected={isSelected} isReadOnly />
      )}
      {item.rendered}
    </Tag>
  );
});
