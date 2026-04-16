import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

import { clsx } from '@koobiq/react-core';

import s from './TabIndicator.module.css';

export type TabIndicatorProps = {
  isUnderlined?: boolean;
} & ComponentPropsWithoutRef<'span'>;

export const TabIndicator = forwardRef<HTMLSpanElement, TabIndicatorProps>(
  ({ isUnderlined = false, className, ...other }, ref) => (
    <span
      ref={ref}
      className={clsx(
        s.base,
        isUnderlined ? s.underlined : s.default,
        className
      )}
      {...other}
    />
  )
);

TabIndicator.displayName = 'TabIndicator';
