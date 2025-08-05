import { forwardRef, type ReactNode, type Ref } from 'react';

import { clsx, isNotNil, isString, isNumber } from '@koobiq/react-core';
import { Button } from '@koobiq/react-primitives';

import type { FieldInputGroupPropVariant } from '../FieldContentGroup';

import s from './FieldSelect.module.css';

export type FieldSelectProps = {
  isInvalid?: boolean;
  isDisabled?: boolean;
  className?: string;
  children?: ReactNode;
  'data-testid'?: string;
  ref?: Ref<HTMLButtonElement>;
  placeholder?: string | number;
  variant?: FieldInputGroupPropVariant;
};

export const FieldSelect = forwardRef<HTMLButtonElement, FieldSelectProps>(
  (
    {
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
