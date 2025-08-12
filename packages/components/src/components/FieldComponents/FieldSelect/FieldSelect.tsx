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

export const FieldSelect = polymorphicForwardRef<'div', FieldSelectBaseProps>(
  (
    {
      as = 'div',
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
        <div className={s.content}>{children}</div>
      ) : (
        children
      )}
      {!isNotNil(children) && <div className={s.content}>{placeholder}</div>}
    </Button>
  )
);

FieldSelect.displayName = 'FieldSelect';

export type FieldSelectProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FieldSelect<As>>;
