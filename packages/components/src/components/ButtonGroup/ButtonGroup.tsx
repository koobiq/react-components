'use client';

import { useMemo } from 'react';
import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from './ButtonGroup.module.css';
import { ButtonGroupContext } from './ButtonGroupContext';
import type { ButtonGroupBaseProps } from './types';

/** The ButtonGroup joins buttons that belong together. */
export const ButtonGroup = polymorphicForwardRef<'div', ButtonGroupBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'div',
      orientation = 'horizontal',
      variant = 'fade-contrast-outline',
      isDisabled,
      isLoading,
      className,
      children,
      ...other
    } = props;

    const contextValue = useMemo(
      () => ({ variant, isDisabled, isLoading }),
      [variant, isDisabled, isLoading]
    );

    return (
      <ButtonGroupContext.Provider value={contextValue}>
        <Tag
          role="group"
          data-variant={variant}
          data-orientation={orientation}
          data-disabled={isDisabled || undefined}
          data-loading={isLoading || undefined}
          className={clsx(
            s.base,
            s[variant],
            s[orientation],
            isDisabled && s.disabled,
            className
          )}
          {...other}
          ref={ref}
        >
          {children}
        </Tag>
      </ButtonGroupContext.Provider>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';

export type ButtonGroupProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof ButtonGroup<As>>;
