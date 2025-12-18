'use client';

import { Children, forwardRef, cloneElement, isValidElement } from 'react';
import type { CSSProperties } from 'react';

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

const hiddenStyle = {
  visibility: 'hidden',
  position: 'absolute',
  left: '-300vw',
} as CSSProperties;

export const Breadcrumbs = forwardRef<BreadcrumbsRef, BreadcrumbsProps>(
  (props, ref) => {
    const { navProps: navPropsAria } = useBreadcrumbs(props);

    const {
      separator = `\u00A0/\u00A0`,
      size = 'normal',
      children,
      className,
      ...other
    } = props;

    const items = Children.toArray(children) as typeof children;

    const navProps = mergeProps(
      {
        className: clsx(s.base, s[size], className),
        'data-size': size,
        ...other,
      },
      navPropsAria
    );

    const length = items?.length || 0;

    const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems<
      HTMLLIElement,
      HTMLOListElement
    >({
      length: length + 1,
    });

    const listProps = {
      className: s.list,
      ref: parentRef,
    };

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
                  key={child.key || i}
                  className={s.item}
                  ref={itemsRefs[i]}
                  style={{
                    ...(!visibleMap[i] && hiddenStyle),
                  }}
                >
                  {cloneElement(child, {
                    isCurrent: child.props.isCurrent ?? isLast,
                  })}
                  {!isLast && isNotNil(separator) && (
                    <span aria-hidden="true" className={s.divider}>
                      {separator}
                    </span>
                  )}
                </li>
              );
            })}
            <li
              ref={itemsRefs[itemsRefs.length - 1]}
              className={s.more}
              style={{
                ...(!visibleMap[length] && hiddenStyle),
              }}
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
