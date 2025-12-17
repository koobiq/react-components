'use client';

import { Children, forwardRef, cloneElement, isValidElement } from 'react';

import { clsx } from '@koobiq/react-core';
import { useBreadcrumbs } from '@koobiq/react-primitives';

import s from './Breadcrumbs.module.css';
import { BreadcrumbsContext } from './BreadcrumbsContext';
import type { BreadcrumbsProps, BreadcrumbsRef } from './types';

export const Breadcrumbs = forwardRef<BreadcrumbsRef, BreadcrumbsProps>(
  (props, ref) => {
    const { navProps } = useBreadcrumbs(props);

    const { children, size = 'compact' } = props;

    const items = Children.toArray(children) as typeof children;

    const lastIndex = items.length - 1;

    return (
      <BreadcrumbsContext.Provider value={{ size }}>
        <nav
          className={clsx(s.base, s[size])}
          data-size={size}
          {...navProps}
          ref={ref}
        >
          <ol className={s.list}>
            {items.map((child, i) => {
              if (!isValidElement(child)) return child;

              const isLast = i === lastIndex;

              return (
                <li key={child.key || i} className={s.item}>
                  {cloneElement(child, {
                    isCurrent: isLast || child.props.isCurrent,
                  })}
                  {!isLast && (
                    <span aria-hidden="true" className={s.divider}>
                      &nbsp;/&nbsp;
                    </span>
                  )}
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
