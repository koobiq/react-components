'use client';

import { Children, forwardRef, cloneElement, isValidElement } from 'react';

import { clsx, isNotNil, mergeProps } from '@koobiq/react-core';
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

    return (
      <BreadcrumbsContext.Provider value={{ size }}>
        <nav {...navProps} ref={ref}>
          <ol className={s.list}>
            {items?.map((child, i) => {
              if (!isValidElement(child)) return child;

              const lastIndex = items.length - 1;

              const isLast = i === lastIndex;

              return (
                <li key={child.key || i} className={s.item}>
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
          </ol>
        </nav>
      </BreadcrumbsContext.Provider>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
