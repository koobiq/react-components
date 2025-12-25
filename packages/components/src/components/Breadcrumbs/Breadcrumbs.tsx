'use client';

import { cloneElement, forwardRef } from 'react';

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
      onAction,
      ellipsisIndex,
      children: childrenProp,
      size = 'normal',
      className,
      ...other
    } = props;

    const children = childrenProp?.map((child, i) => {
      const itemKey = child?.key || i;

      return cloneElement(child, {
        key: itemKey,
        onPress: (e) => {
          child.props?.onPress?.(e);
          onAction?.(itemKey);
        },
      });
    });

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
            <BreadcrumbsWrap {...other} separator={separator}>
              {children}
            </BreadcrumbsWrap>
          ) : (
            <BreadcrumbsCollapse
              {...other}
              onAction={onAction}
              ellipsisIndex={ellipsisIndex}
              renderEllipsis={renderEllipsis}
              separator={separator}
            >
              {children}
            </BreadcrumbsCollapse>
          )}
        </nav>
      </BreadcrumbsContext.Provider>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
