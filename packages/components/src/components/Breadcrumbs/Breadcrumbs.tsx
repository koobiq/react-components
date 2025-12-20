'use client';

import type { ReactElement } from 'react';
import { Children, forwardRef, cloneElement, isValidElement } from 'react';

import {
  clsx,
  isNotNil,
  mergeProps,
  useHideOverflowItems,
} from '@koobiq/react-core';
import { IconEllipsisHorizontal16 } from '@koobiq/react-icons';
import { useBreadcrumbs } from '@koobiq/react-primitives';

import { Menu } from '../Menu';

import s from './Breadcrumbs.module.css';
import { BreadcrumbsContext } from './BreadcrumbsContext';
import { BreadcrumbItem, type BreadcrumbItemProps } from './components';
import type {
  BreadcrumbsProps,
  BreadcrumbsRef,
  BreadcrumbRenderItem,
  BreadcrumbsPropRenderEllipsis,
} from './types';

const renderEllipsisDefault: BreadcrumbsPropRenderEllipsis = ({
  ellipsisIcon,
  items,
}) => (
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

export const Breadcrumbs = forwardRef<BreadcrumbsRef, BreadcrumbsProps>(
  (props, ref) => {
    const { navProps: navPropsAria } = useBreadcrumbs(props);

    const {
      separator = `\u00A0/\u00A0`,
      overflowMode = 'collapse',
      ellipsisIndex = 2,
      size = 'normal',
      slotProps,
      children,
      className,
      renderEllipsis = renderEllipsisDefault,
      ...other
    } = props;

    const elements = Children.toArray(children) as Array<
      ReactElement<BreadcrumbItemProps>
    >;

    const { length } = elements;

    const resolvedEllipsisIndex = Math.max(0, Math.min(ellipsisIndex, length));

    const navProps = mergeProps(
      {
        'data-size': size,
        'data-overflow-mode': overflowMode,
        className: clsx(s.base, s[size], s[overflowMode], className),
        ...other,
      },
      navPropsAria
    );

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

    const items: BreadcrumbRenderItem[] = elements.map((element, index) => ({
      element,
      index,
      props: element.props,
      key: element.key ?? null,
      href: element.props.href,
      children: element.props.children,
    }));

    const collapsedItems: BreadcrumbRenderItem[] = items.filter((item) => {
      const slotIndex =
        item.index < resolvedEllipsisIndex ? item.index : item.index + 1;

      return !visibleMap[slotIndex];
    });

    return (
      <BreadcrumbsContext.Provider value={{ size }}>
        <nav {...navProps} ref={ref}>
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
                    className={clsx(s.ellipsisItem, !visibleMap[i] && s.hidden)}
                  >
                    {customEllipsis ?? defaultEllipsis}
                    {separatorNode}
                  </li>
                );
              }

              const childIndex = i < resolvedEllipsisIndex ? i : i - 1;
              const child = items[childIndex]?.element;

              if (!isValidElement(child)) return child;

              const isLastItem = childIndex === length - 1;

              return (
                <li
                  ref={itemsRefs[i]}
                  key={child.key || childIndex}
                  className={clsx(s.item, !visibleMap[i] && s.hidden)}
                >
                  {cloneElement(child, {
                    isCurrent: child.props.isCurrent ?? isLastItem,
                  })}
                  {separatorNode}
                </li>
              );
            })}
          </ol>
        </nav>
      </BreadcrumbsContext.Provider>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
