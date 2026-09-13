'use client';

import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';

import type { DescriptionListDescriptionProps } from '../../types';

import s from './DescriptionListDescription.module.css';

/** DescriptionList.Description — a description of the term, e.g. a field value. */
export const DescriptionListDescription = forwardRef<
  HTMLElement,
  DescriptionListDescriptionProps
>((props, ref) => {
  const { className, children, ...other } = props;

  return (
    <dd
      {...other}
      ref={ref}
      className={clsx(s.base, className)}
      data-slot="description"
    >
      {children}
    </dd>
  );
});

DescriptionListDescription.displayName = 'DescriptionList.Description';
