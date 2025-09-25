import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';
import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import { useFormFieldControlGroup } from '../FormFieldControlGroup';

import s from './FormFieldAddon.module.css';

export const formFieldAddonPropPlacement = ['start', 'end'] as const;

export type FormFieldAddonPlacement =
  (typeof formFieldAddonPropPlacement)[number];

export type FormFieldAddonProps = ExtendableComponentPropsWithRef<
  {
    children?: ReactNode;
    placement?: FormFieldAddonPlacement;
  },
  'div'
>;

export type FormFieldAddonRef = ComponentRef<'div'>;

export const FormFieldAddon = forwardRef<
  FormFieldAddonRef,
  FormFieldAddonProps
>(({ placement = 'start', className, children, ...other }, ref) => {
  const { isInvalid, isDisabled } = useFormFieldControlGroup();

  return isNotNil(children) ? (
    <div
      className={clsx(
        s.base,
        s[placement],
        isInvalid && s.invalid,
        isDisabled && s.disabled,
        className
      )}
      data-placement={placement}
      data-invalid={isInvalid || undefined}
      data-disabled={isDisabled || undefined}
      data-testid={`field-addon-${placement}`}
      {...other}
      ref={ref}
    >
      {children}
    </div>
  ) : null;
});

FormFieldAddon.displayName = 'FormFieldAddon';
