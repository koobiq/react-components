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

import s from './Breadcrumbs.module.css';
import { BreadcrumbsContext } from './BreadcrumbsContext';
import { BreadcrumbItem, type BreadcrumbItemProps } from './components';
import type { BreadcrumbsProps, BreadcrumbsRef } from './types';

export const Breadcrumbs = forwardRef<BreadcrumbsRef, BreadcrumbsProps>(
  (props, ref) => {
    const { navProps: navPropsAria } = useBreadcrumbs(props);

    const {
      separator = `\u00A0/\u00A0`,
      ellipsisIndex = 2,
      size = 'normal',
      slotProps,
      children,
      className,
      ...other
    } = props;

    const items = Children.toArray(children) as Array<
      ReactElement<BreadcrumbItemProps>
    >;

    const { length } = items;

    const resolvedEllipsisIndex = Math.max(0, Math.min(ellipsisIndex, length));

    const navProps = mergeProps(
      {
        className: clsx(s.base, s[size], className),
        'data-size': size,
        ...other,
      },
      navPropsAria
    );

    const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems<
      HTMLLIElement,
      HTMLOListElement
    >({
      length: length + 1,
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

    if (!items) return null;

    return (
      <BreadcrumbsContext.Provider value={{ size }}>
        <nav {...navProps} ref={ref}>
          <ol {...listProps}>
            {Array.from({ length: length + 1 }).map((_, i) => {
              const isEllipsis = i === resolvedEllipsisIndex;
              const isLastVisual = i === length;

              const separatorNode =
                !isLastVisual && isNotNil(separator) ? (
                  <span {...separatorProps}>{separator}</span>
                ) : null;

              if (isEllipsis) {
                return (
                  <li
                    key="ellipsis"
                    ref={itemsRefs[i]}
                    className={clsx(s.ellipsisItem, !visibleMap[i] && s.hidden)}
                  >
                    <BreadcrumbItem>
                      <IconEllipsisHorizontal16 />
                    </BreadcrumbItem>
                    {separatorNode}
                  </li>
                );
              }

              const childIndex = i < resolvedEllipsisIndex ? i : i - 1;
              const child = items[childIndex];

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
