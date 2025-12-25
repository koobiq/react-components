'use client';

import { Children, cloneElement, isValidElement } from 'react';
import type { ReactElement } from 'react';

import {
  isNotNil,
  isString,
  mergeProps,
  useHideOverflowItems,
} from '@koobiq/react-core';
import { IconEllipsisHorizontal16 } from '@koobiq/react-icons';
import { Button } from '@koobiq/react-primitives';

import { Menu } from '../../../Menu';
import s from '../../Breadcrumbs.module.css';
import type {
  BreadcrumbsProps,
  BreadcrumbRenderItem,
  BreadcrumbsPropRenderEllipsis,
} from '../../types';
import { BreadcrumbItem, type BreadcrumbItemProps } from '../BreadcrumbItem';

import { clampEllipsisIndex, getSlotIndex } from './utils';

const renderEllipsisDefault: BreadcrumbsPropRenderEllipsis = ({
  ellipsisIcon,
  onAction,
  items,
}) => {
  if (items.length === 0) return null;

  return (
    <Menu
      onAction={onAction}
      control={(props) => (
        <BreadcrumbItem {...props} as={Button}>
          {ellipsisIcon}
        </BreadcrumbItem>
      )}
    >
      {items.map((item, index) => (
        <Menu.Item
          key={item.key}
          {...item.props}
          textValue={isString(item.children) ? item.children : `${index}`}
        >
          <Menu.ItemText>{item.children}</Menu.ItemText>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export const BreadcrumbsCollapse = (props: BreadcrumbsProps) => {
  const {
    renderEllipsis = renderEllipsisDefault,
    ellipsisIndex = 2,
    onAction,
    separator,
    slotProps,
    children,
  } = props;

  const ellipsisIcon = <IconEllipsisHorizontal16 />;

  const elements = Children.toArray(children) as Array<
    ReactElement<BreadcrumbItemProps>
  >;

  const { length } = elements;
  const slotsLength = length + 1;

  const items: BreadcrumbRenderItem[] = elements.map((element, index) => ({
    element,
    index,
    props: element.props,
    key: element.key ?? null,
    href: element.props.href,
    children: element.props.children,
  }));

  const moreIndex = clampEllipsisIndex(ellipsisIndex, length);

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems<
    HTMLLIElement,
    HTMLOListElement
  >({
    length: slotsLength,
    pinnedIndex: length,
    moreIndex,
  });

  const listProps = mergeProps(
    { className: s.list, ref: parentRef },
    slotProps?.list
  );

  const separatorProps = mergeProps(
    { 'aria-hidden': 'true', className: s.divider },
    slotProps?.divider
  );

  const renderSeparator = (isLast: boolean) =>
    !isLast && isNotNil(separator) ? (
      <span {...separatorProps}>{separator}</span>
    ) : null;

  const collapsedItems = items.filter(
    ({ index }) => !visibleMap[getSlotIndex(index, moreIndex)]
  );

  return (
    <ol {...listProps}>
      {Array.from({ length: slotsLength }).map((_, slotIndex) => {
        const isEllipsis = slotIndex === moreIndex;
        const isLast = slotIndex === length;
        const separatorNode = renderSeparator(isLast);

        if (isEllipsis) {
          const defaultEllipsis = (
            <BreadcrumbItem as="span">{ellipsisIcon}</BreadcrumbItem>
          );

          const customEllipsis = renderEllipsis?.({
            ellipsisIcon,
            ellipsisIndex: slotIndex,
            items: collapsedItems,
            onAction,
          });

          return (
            <li
              className={s.ellipsis}
              ref={itemsRefs[slotIndex]}
              key={`ellipsis-${moreIndex}`}
              aria-hidden={!visibleMap[slotIndex] || undefined}
            >
              {customEllipsis ?? defaultEllipsis}
              {separatorNode}
            </li>
          );
        }

        const itemIndex = slotIndex < moreIndex ? slotIndex : slotIndex - 1;
        const child = items[itemIndex]?.element;

        if (!child) return null;
        if (!isValidElement(child)) return child;

        const isLastChild = itemIndex === length - 1;

        return (
          <li
            className={s.item}
            key={child.key ?? itemIndex}
            ref={itemsRefs[slotIndex]}
            aria-hidden={!visibleMap[slotIndex] || undefined}
          >
            {cloneElement(child, {
              isCurrent: child.props.isCurrent ?? isLastChild,
            })}
            {separatorNode}
          </li>
        );
      })}
    </ol>
  );
};
