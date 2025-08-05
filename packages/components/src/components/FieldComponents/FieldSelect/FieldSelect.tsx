import type { ComponentPropsWithRef, ElementType } from 'react';

import {
  clsx,
  isNotNil,
  isString,
  isNumber,
  polymorphicForwardRef,
} from '@koobiq/react-core';
import { Button } from '@koobiq/react-primitives';

import s from './FieldSelect.module.css';
import type { FieldSelectBaseProps } from './index';

export const FieldSelect = polymorphicForwardRef<
  'button',
  FieldSelectBaseProps
>(
  (
    {
      as = 'button',
      isInvalid = false,
      isDisabled = false,
      variant = 'filled',
      placeholder,
      children,
      className,
      ...other
    },
    ref
  ) => (
    <Button
      {...other}
      as={as}
      isDisabled={isDisabled}
      data-slot="select-value"
      className={clsx(
        s.base,
        s[variant],
        isInvalid && s.invalid,
        isDisabled && s.disabled,
        !isNotNil(children) && s.hasPlaceholder,
        className
      )}
      ref={ref}
    >
      {isString(children) || isNumber(children) ? (
        <span className={s.content}>{children}</span>
      ) : (
        children
      )}
      {!isNotNil(children) && <span className={s.content}>{placeholder}</span>}
    </Button>
  )
);

FieldSelect.displayName = 'FieldSelect';

export type FieldSelectProps<As extends ElementType = 'button'> =
  ComponentPropsWithRef<typeof FieldSelect<As>>;
