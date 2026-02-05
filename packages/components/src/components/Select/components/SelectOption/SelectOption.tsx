'use client';

import { type ElementType, type ForwardedRef, useContext } from 'react';

import {
  clsx,
  mergeProps,
  useHover,
  usePress,
  useObjectRef,
} from '@koobiq/react-core';
import type { Node } from '@koobiq/react-core';
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

export const SelectOption = createLeafComponent(ItemNode, function ListBoxItem<
  T extends object,
>(props: any, forwardedRef: ForwardedRef<HTMLDivElement>, item: Node<T>) {
  const { href, className, style } = props;

  const ref = useObjectRef<any>(forwardedRef);
  const state = useContext(SelectContext)!;

  console.log(state);

  const { optionProps, isSelected, isDisabled, isFocusVisible } = useOption(
    { key: item.key },
    state,
    ref
  );

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { isPressed, pressProps } = usePress({ isDisabled });

  const Tag: ElementType = href ? 'a' : 'li';

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
