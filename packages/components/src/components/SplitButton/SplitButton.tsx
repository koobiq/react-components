'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { ButtonGroup } from '../ButtonGroup/index.js';

import s from './SplitButton.module.css';
import type { SplitButtonBaseProps } from './types.js';

/** The SplitButton combines a primary action with a menu of related actions. */
export const SplitButton = polymorphicForwardRef<'div', SplitButtonBaseProps>(
  (props, ref) => {
    const {
      as = 'div',
      variant = 'fade-contrast-filled',
      isDisabled,
      isLoading,
      className,
      children,
      ...other
    } = props;

    return (
      <ButtonGroup
        as={as}
        variant={variant}
        isDisabled={isDisabled}
        isLoading={isLoading}
        className={clsx(s.base, className)}
        data-slot="split-button"
        {...other}
        ref={ref}
      >
        {children}
      </ButtonGroup>
    );
  }
);

SplitButton.displayName = 'SplitButton';

export type SplitButtonProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof SplitButton<As>>;
