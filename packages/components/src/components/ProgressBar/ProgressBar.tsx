'use client';

import type { ComponentRef, CSSProperties } from 'react';
import { forwardRef } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';
import { ProgressBar as ProgressBarPrimitive } from '@koobiq/react-primitives';

import type { ProgressBarProps } from './index';
import s from './ProgressBar.module.css';

export const ProgressBar = forwardRef<ComponentRef<'div'>, ProgressBarProps>(
  (props, ref) => {
    const {
      variant = 'determinate',
      minValue = 0,
      maxValue = 100,
      className,
      value,
      slotProps,
      style,
      ...other
    } = props;

    const indeterminate = variant === 'indeterminate' || !isNotNil(value);

    const setProgressTrackStyles = () => {
      if (indeterminate) return undefined;

      const translateX = Math.max(
        -maxValue,
        Math.min(minValue, (value || minValue) - maxValue)
      );

      return {
        '--progressbar-fill-translate-x': `translateX(${translateX}%)`,
      } as CSSProperties;
    };

    return (
      <ProgressBarPrimitive
        value={value}
        minValue={minValue}
        maxValue={maxValue}
        indeterminate={indeterminate}
        data-variant={indeterminate ? 'indeterminate' : 'determinate'}
        style={{ ...style, ...setProgressTrackStyles() }}
        className={clsx(s.base, indeterminate && s.indeterminate, className)}
        {...other}
        ref={ref}
      >
        <span
          className={clsx(s.fill, slotProps?.fill?.className)}
          ref={slotProps?.fill?.ref}
          {...slotProps?.fill}
        />
      </ProgressBarPrimitive>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
