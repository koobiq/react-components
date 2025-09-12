import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, isNotNil, polymorphicForwardRef } from '@koobiq/react-core';
import { Button } from '@koobiq/react-primitives';

import s from './FieldSelect.module.css';
import type { FieldSelectBaseProps } from './index';
import { isPrimitiveNode } from './utils';

export const FieldSelect = polymorphicForwardRef<'div', FieldSelectBaseProps>(
  (
    {
      variant = 'filled',
      as = 'div',
      isInvalid,
      isDisabled,
      placeholder,
      children,
      className,
      ...other
    },
    ref
  ) => {
    const content = children ?? placeholder;

    return (
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
        <span className={s.hiddenPlaceholder} aria-hidden>
          {placeholder}
        </span>
        <div className={s.container}>
          {isPrimitiveNode(content) ? (
            <span className={s.content}>{content}</span>
          ) : (
            children
          )}
        </div>
      </Button>
    );
  }
);

FieldSelect.displayName = 'FieldSelect';

export type FieldSelectProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FieldSelect<As>>;
