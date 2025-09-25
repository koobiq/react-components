import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, isNotNil, polymorphicForwardRef } from '@koobiq/react-core';
import { Button } from '@koobiq/react-primitives';

import { isPrimitiveNode } from '../../../utils';
import { useFormFieldControlGroup } from '../FormFieldControlGroup';

import s from './FormFieldSelect.module.css';
import type { FormFieldSelectBaseProps } from './index';

export const FormFieldSelect = polymorphicForwardRef<
  'div',
  FormFieldSelectBaseProps
>(({ as = 'div', placeholder, children, className, ...other }, ref) => {
  const content = children ?? placeholder;
  const { isDisabled } = useFormFieldControlGroup();

  return (
    <Button
      {...other}
      as={as}
      isDisabled={isDisabled}
      data-slot="select-value"
      className={clsx(
        s.base,
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
});

FormFieldSelect.displayName = 'FormFieldSelect';

export type FormFieldSelectProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FormFieldSelect<As>>;
