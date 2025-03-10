import { type ComponentRef, forwardRef } from 'react';

import { clsx, isNotNil, mergeProps } from '@koobiq/react-core';

import s from './FormControlLabel.module.css';
import type { FormControlLabelProps } from './index';

export const FormControlLabel = forwardRef<
  ComponentRef<'label'>,
  FormControlLabelProps
>(
  (
    {
      size = 'normal',
      disabled = false,
      labelPlacement = 'end',
      className,
      children,
      slotProps,
      label,
      caption,
      ...other
    },
    ref
  ) => {
    const contentProps = mergeProps(slotProps?.content, {
      className: s.content,
    });

    return (
      <label
        className={clsx(
          s.base,
          s[size],
          s[labelPlacement],
          disabled && s.disabled,
          className
        )}
        ref={ref}
        {...other}
      >
        {children}
        <div {...contentProps}>
          {isNotNil(label) && <span className={s.label}>{label}</span>}
          {isNotNil(caption) && <span className={s.caption}>{caption}</span>}
        </div>
      </label>
    );
  }
);

FormControlLabel.displayName = 'FormControlLabel';
