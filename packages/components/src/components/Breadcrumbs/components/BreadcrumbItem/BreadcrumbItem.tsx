'use client';

import { useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { useBreadcrumbItem } from '@koobiq/react-primitives';

import s from './BreadcrumbItem.module.css';
import type { BreadcrumbItemProps } from './types';

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const ref = useRef(null);

  const { itemProps } = useBreadcrumbItem(
    { ...props, elementType: 'span' },
    ref
  );

  const { isDisabled, isCurrent } = props;

  return (
    <li>
      <span
        {...itemProps}
        ref={ref}
        className={clsx(
          s.base,
          isCurrent && s.current,
          isDisabled && s.disabled
        )}
      >
        {props.children}
      </span>
      {!props.isCurrent && (
        <span aria-hidden="true" className={s.divider}>
          {'›'}
        </span>
      )}
    </li>
  );
}
