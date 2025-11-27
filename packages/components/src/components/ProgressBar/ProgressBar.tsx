'use client';

import type { ComponentRef, CSSProperties } from 'react';
import { forwardRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { clsx, isNotNil } from '@koobiq/react-core';
import { ProgressBar as ProgressBarPrimitive } from '@koobiq/react-primitives';

import type { ProgressBarProps } from './index';
import s from './ProgressBar.module.css';

export const ProgressBar = forwardRef<ComponentRef<'div'>, ProgressBarProps>(
  (props, ref) => {
    const {
      variant,
      minValue = 0,
      maxValue = 100,
      className,
      value,
      slotProps,
      style,
      isIndeterminate: isIndeterminateProp,
      ...other
    } = props;

    const isIndeterminate =
      isIndeterminateProp ?? (variant === 'indeterminate' || !isNotNil(value));

    if (process.env.NODE_ENV !== 'production' && 'variant' in props) {
      deprecate(
        'ProgressBar: the "variant" prop is deprecated. Use "isIndeterminate" prop to replace it.'
      );
    }

    const setProgressTrackStyles = () => {
      if (isIndeterminate) return undefined;

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
        isIndeterminate={isIndeterminate}
        style={{ ...style, ...setProgressTrackStyles() }}
        className={clsx(s.base, isIndeterminate && s.indeterminate, className)}
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
