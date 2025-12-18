'use client';

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
import type { BreadcrumbsProps, BreadcrumbsRef } from './types';

export const Breadcrumbs = forwardRef<BreadcrumbsRef, BreadcrumbsProps>(
  (props, ref) => {
    const { navProps: navPropsAria } = useBreadcrumbs(props);

    const {
      separator = `\u00A0/\u00A0`,
      size = 'normal',
      slotProps,
      children,
      className,
      ...other
    } = props;

    const items = Children.toArray(children) as typeof children;
    const length = items?.length || 0;

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
    });

    const listProps = mergeProps(
      {
        className: s.list,
        ref: parentRef,
      },
      slotProps?.list
    );

    const dividerProps = mergeProps(
      {
        'aria-hidden': 'true',
        className: s.divider,
      },
      slotProps?.divider
    );

    return (
      <BreadcrumbsContext.Provider value={{ size }}>
        <nav {...navProps} ref={ref}>
          <ol {...listProps}>
            {items?.map((child, i) => {
              if (!isValidElement(child)) return child;

              const lastIndex = items.length - 1;
              const isLast = i === lastIndex;

              return (
                <li
                  ref={itemsRefs[i]}
                  key={child.key || i}
                  className={clsx(s.item, !visibleMap[i] && s.hidden)}
                >
                  {cloneElement(child, {
                    isCurrent: child.props.isCurrent ?? isLast,
                  })}
                  {!isLast && isNotNil(separator) && (
                    <span {...dividerProps}>{separator}</span>
                  )}
                </li>
              );
            })}
            <li
              ref={itemsRefs[itemsRefs.length - 1]}
              className={clsx(s.ellipsisItem, !visibleMap[length] && s.hidden)}
            >
              <IconEllipsisHorizontal16 />
            </li>
          </ol>
        </nav>
      </BreadcrumbsContext.Provider>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
