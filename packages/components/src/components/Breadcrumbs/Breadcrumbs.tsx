'use client';

import { forwardRef } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';
import { useBreadcrumbs } from '@koobiq/react-primitives';

import s from './Breadcrumbs.module.css';
import { BreadcrumbsContext } from './BreadcrumbsContext';
import { BreadcrumbsCollapse, BreadcrumbsWrap } from './components';
import type { BreadcrumbsProps, BreadcrumbsRef } from './types';

export const Breadcrumbs = forwardRef<BreadcrumbsRef, BreadcrumbsProps>(
  (props, ref) => {
    const {
      separator = `/`,
      overflowMode = 'collapse',
      renderEllipsis,
      ellipsisIndex,
      size = 'normal',
      className,
      ...other
    } = props;

    const { navProps: navPropsAria } = useBreadcrumbs(other);

    const navProps = mergeProps(
      {
        'data-size': size,
        'data-overflow-mode': overflowMode,
        className: clsx(s.base, s[size], s[overflowMode], className),
        ...other,
      },
      navPropsAria
    );

    return (
      <BreadcrumbsContext.Provider value={{ size }}>
        <nav {...navProps} ref={ref}>
          {overflowMode === 'wrap' ? (
            <BreadcrumbsWrap {...other} separator={separator} />
          ) : (
            <BreadcrumbsCollapse
              {...other}
              ellipsisIndex={ellipsisIndex}
              renderEllipsis={renderEllipsis}
              separator={separator}
            />
          )}
        </nav>
      </BreadcrumbsContext.Provider>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
