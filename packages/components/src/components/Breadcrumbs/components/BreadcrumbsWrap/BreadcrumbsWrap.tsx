'use client';

import { Children, cloneElement } from 'react';
import type { ReactElement } from 'react';

import { mergeProps, isNotNil } from '@koobiq/react-core';

import s from '../../Breadcrumbs.module.css';
import type { BreadcrumbsProps } from '../../types';
import type { BreadcrumbItemProps } from '../BreadcrumbItem';

export const BreadcrumbsWrap = (props: BreadcrumbsProps) => {
  const { separator, slotProps, children } = props;

  const items = Children.toArray(children) as Array<
    ReactElement<BreadcrumbItemProps>
  >;

  const listProps = mergeProps({ className: s.list }, slotProps?.list);

  const separatorProps = mergeProps(
    { 'aria-hidden': 'true', className: s.divider },
    slotProps?.divider
  );

  return (
    <ol {...listProps}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;

        const separatorNode =
          !isLast && isNotNil(separator) ? (
            <span {...separatorProps}>{separator}</span>
          ) : null;

        return (
          <li key={item.key ?? i} className={s.item}>
            {cloneElement(item, {
              isCurrent: item.props.isCurrent ?? isLast,
            })}
            {separatorNode}
          </li>
        );
      })}
    </ol>
  );
};
