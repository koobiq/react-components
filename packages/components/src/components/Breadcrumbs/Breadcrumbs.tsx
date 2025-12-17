'use client';

import { Children, cloneElement, isValidElement } from 'react';

import { clsx } from '@koobiq/react-core';
import { useBreadcrumbs } from '@koobiq/react-primitives';

import s from './Breadcrumbs.module.css';
import { BreadcrumbsContext } from './BreadcrumbsContext';
import type { BreadcrumbsProps } from './types';

export function Breadcrumbs(props: BreadcrumbsProps) {
  const { navProps } = useBreadcrumbs(props);

  const { children, size = 'compact' } = props;

  const items = Children.toArray(children) as typeof children;
  const lastIndex = items.length - 1;

  return (
    <BreadcrumbsContext.Provider value={{ size }}>
      <nav className={clsx(s.base)} data-size={size} {...navProps}>
        <ol className={s.list}>
          {items.map((child, i) => {
            if (!isValidElement(child)) return child;

            return cloneElement(child, {
              isCurrent: i === lastIndex,
            });
          })}
        </ol>
      </nav>
    </BreadcrumbsContext.Provider>
  );
}
