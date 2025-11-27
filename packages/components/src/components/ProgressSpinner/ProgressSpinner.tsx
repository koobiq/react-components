'use client';

import { forwardRef, useMemo } from 'react';
import type { ComponentRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, isNotNil } from '@koobiq/react-core';
import { ProgressBar as ProgressBarPrimitive } from '@koobiq/react-primitives';

import type { ProgressSpinnerProps } from './index';
import s from './ProgressSpinner.module.css';
import { getSvgParamsBySize } from './utils';

export const ProgressSpinner = forwardRef<
  ComponentRef<'div'>,
  ProgressSpinnerProps
>((props, ref) => {
  const {
    size = 'compact',
    value,
    variant,
    className,
    slotProps,
    minValue = 0,
    maxValue = 100,
    isIndeterminate: isIndeterminateProp,
    ...other
  } = props;

  const isIndeterminate =
    isIndeterminateProp ?? (variant === 'indeterminate' || !isNotNil(value));

  if (process.env.NODE_ENV !== 'production' && 'variant' in props) {
    deprecate(
      'ProgressSpinner: the "variant" prop is deprecated. Use "isIndeterminate" prop to replace it.'
    );
  }

  const [sizeOfPixels, strokeWidth, radius, strokeDasharray] = useMemo(
    () => getSvgParamsBySize(size),
    [size]
  );

  return (
    <ProgressBarPrimitive
      value={value}
      data-size={size}
      minValue={minValue}
      maxValue={maxValue}
      isIndeterminate={isIndeterminate}
      className={clsx(s.base, isIndeterminate && s.indeterminate, className)}
      {...other}
      ref={ref}
    >
      {({ percentage = 0 }) => {
        const progress = isIndeterminate ? 75 : percentage;

        return (
          <svg
            width={sizeOfPixels}
            height={sizeOfPixels}
            className={clsx(s.spin, slotProps?.spin?.className)}
            viewBox={`0 0 ${sizeOfPixels} ${sizeOfPixels}`}
            {...slotProps?.spin}
          >
            <circle
              r={radius}
              className={s.circle}
              cx={sizeOfPixels / 2}
              cy={sizeOfPixels / 2}
              strokeLinecap="round"
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={
                strokeDasharray - (progress / 100) * strokeDasharray
              }
            />
          </svg>
        );
      }}
    </ProgressBarPrimitive>
  );
});

ProgressSpinner.displayName = 'ProgressSpinner';
