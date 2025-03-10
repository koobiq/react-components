'use client';

import { forwardRef, useMemo } from 'react';
import type { ComponentRef } from 'react';

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
    variant = 'determinate',
    size = 'compact',
    minValue = 0,
    maxValue = 100,
    className,
    value,
    slotProps,
    ...other
  } = props;

  const indeterminate = variant === 'indeterminate' || !isNotNil(value);

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
      indeterminate={indeterminate}
      data-variant={indeterminate ? 'indeterminate' : 'determinate'}
      className={clsx(s.base, indeterminate && s.indeterminate, className)}
      {...other}
      ref={ref}
    >
      {({ percentage = 0 }) => {
        const progress = indeterminate ? 75 : percentage;

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
