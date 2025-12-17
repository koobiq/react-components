'use client';

import { useRef } from 'react';

import { clsx, useFocusRing, useHover, mergeProps } from '@koobiq/react-core';
import { useBreadcrumbItem } from '@koobiq/react-primitives';

import { useBreadcrumbsContext } from '../../BreadcrumbsContext';

import s from './BreadcrumbItem.module.css';
import type { BreadcrumbItemProps } from './types';

export function BreadcrumbItem(props: BreadcrumbItemProps) {
  const ref = useRef(null);

  const { itemProps } = useBreadcrumbItem(
    { ...props, elementType: 'span' },
    ref
  );

  const { isDisabled, isCurrent } = props;

  const { hoverProps, isHovered } = useHover({ isDisabled });

  const { focusProps, isFocusVisible } = useFocusRing({});

  const { size } = useBreadcrumbsContext();

  return (
    <li className={clsx(s.base)}>
      <span
        className={clsx(
          s.link,
          s[size],
          isHovered && s.hovered,
          isCurrent && s.current,
          isDisabled && s.disabled,
          isFocusVisible && s.focusVisible
        )}
        {...mergeProps(itemProps, hoverProps, focusProps)}
        ref={ref}
      >
        {props.children}
      </span>
      {!props.isCurrent && (
        <span aria-hidden="true" className={s.divider}>
          &nbsp;/&nbsp;
        </span>
      )}
    </li>
  );
}
