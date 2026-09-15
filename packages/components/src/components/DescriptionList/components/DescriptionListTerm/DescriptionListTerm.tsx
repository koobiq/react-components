'use client';

import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';

import { useDescriptionListGroupCheck } from '../../DescriptionListGroupContext';
import type { DescriptionListTermProps } from '../../types';

import s from './DescriptionListTerm.module.css';

/** DescriptionList.Term — a term, e.g. a field name. */
export const DescriptionListTerm = forwardRef<
  HTMLElement,
  DescriptionListTermProps
>((props, ref) => {
  const { className, children, ...other } = props;

  useDescriptionListGroupCheck('DescriptionList.Term');

  return (
    <dt
      {...other}
      ref={ref}
      className={clsx(s.base, className)}
      data-slot="term"
    >
      {children}
    </dt>
  );
});

DescriptionListTerm.displayName = 'DescriptionList.Term';
