'use client';

import { Children, cloneElement, isValidElement } from 'react';

import { useBreadcrumbs } from '@koobiq/react-primitives';

import s from './Breadcrumbs.module.css';
import type { BreadcrumbsProps } from './types';

export function Breadcrumbs(props: BreadcrumbsProps) {
  const { navProps } = useBreadcrumbs(props);

  const { children } = props;

  const items = Children.toArray(children) as typeof children;
  const lastIndex = items.length - 1;

  return (
    <nav {...navProps}>
      <ol className={s.list}>
        {items.map((child, i) => {
          if (!isValidElement(child)) return child;

          return cloneElement(child, {
            isCurrent: i === lastIndex,
          });
        })}
      </ol>
    </nav>
  );
}
