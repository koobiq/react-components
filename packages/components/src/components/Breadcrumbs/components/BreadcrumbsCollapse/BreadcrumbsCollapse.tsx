'use client';

import { Children, cloneElement, isValidElement } from 'react';
import type { ReactElement } from 'react';

import {
  clsx,
  isNotNil,
  mergeProps,
  useHideOverflowItems,
} from '@koobiq/react-core';
import { IconEllipsisHorizontal16 } from '@koobiq/react-icons';

import { Menu } from '../../../Menu';
import s from '../../Breadcrumbs.module.css';
import type {
  BreadcrumbsProps,
  BreadcrumbRenderItem,
  BreadcrumbsPropRenderEllipsis,
} from '../../types';
import { BreadcrumbItem, type BreadcrumbItemProps } from '../BreadcrumbItem';

const renderEllipsisDefault: BreadcrumbsPropRenderEllipsis = ({
  ellipsisIcon,
  items,
}) => {
  if (!items.length) return null;

  return (
    <>
      <Menu
        control={(props) => (
          <BreadcrumbItem {...props}>{ellipsisIcon}</BreadcrumbItem>
        )}
      >
        {items.map((item, i) => (
          <Menu.Item key={i} href={item.href}>
            {item.children}
          </Menu.Item>
        ))}
      </Menu>
    </>
  );
};

export const BreadcrumbsCollapse = (props: BreadcrumbsProps) => {
  const {
    separator,
    renderEllipsis = renderEllipsisDefault,
    ellipsisIndex = 2,
    slotProps,
    children,
  } = props;

  const elements = Children.toArray(children) as Array<
    ReactElement<BreadcrumbItemProps>
  >;

  const { length } = elements;

  const items: BreadcrumbRenderItem[] = elements.map((element, index) => ({
    element,
    index,
    props: element.props,
    key: element.key ?? null,
    href: element.props.href,
    children: element.props.children,
  }));

  const resolvedEllipsisIndex = Math.max(0, Math.min(ellipsisIndex, length));

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems<
    HTMLLIElement,
    HTMLOListElement
  >({
    length: length + 1,
    pinnedIndex: length,
    moreIndex: resolvedEllipsisIndex,
  });

  const listProps = mergeProps(
    { className: s.list, ref: parentRef },
    slotProps?.list
  );

  const separatorProps = mergeProps(
    { 'aria-hidden': 'true', className: s.divider },
    slotProps?.divider
  );

  const ellipsisIcon = <IconEllipsisHorizontal16 />;

  const collapsedItems = items.filter((item) => {
    const slotIndex =
      item.index < resolvedEllipsisIndex ? item.index : item.index + 1;

    return !visibleMap[slotIndex];
  });

  return (
    <ol {...listProps}>
      {Array.from({ length: length + 1 }).map((_, i) => {
        const isEllipsis = i === resolvedEllipsisIndex;
        const isLast = i === length;

        const separatorNode =
          !isLast && isNotNil(separator) ? (
            <span {...separatorProps}>{separator}</span>
          ) : null;

        if (isEllipsis) {
          const defaultEllipsis = (
            <BreadcrumbItem as="span">{ellipsisIcon}</BreadcrumbItem>
          );

          const customEllipsis = renderEllipsis?.({
            ellipsisIcon,
            ellipsisIndex: i,
            items: collapsedItems,
          });

          return (
            <li
              key="ellipsis"
              ref={itemsRefs[i]}
              className={clsx(s.ellipsis, !visibleMap[i] && s.hidden)}
            >
              {customEllipsis ?? defaultEllipsis}
              {separatorNode}
            </li>
          );
        }

        const childIndex = i < resolvedEllipsisIndex ? i : i - 1;
        const child = items[childIndex]?.element;

        if (!isValidElement(child)) return child;

        const isLastChild = childIndex === length - 1;

        return (
          <li
            ref={itemsRefs[i]}
            key={child.key || childIndex}
            className={clsx(s.item, !visibleMap[i] && s.hidden)}
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
