import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';
import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

import s from './FieldAddon.module.css';

export const fieldAddonPropPlacement = ['start', 'end'] as const;

export type FieldAddonPlacement = (typeof fieldAddonPropPlacement)[number];

export type FieldAddonProps = ExtendableComponentPropsWithRef<
  {
    isInvalid?: boolean;
    isDisabled?: boolean;
    children?: ReactNode;
    placement?: FieldAddonPlacement;
  },
  'div'
>;

export const FieldAddon = forwardRef<ComponentRef<'div'>, FieldAddonProps>(
  (
    {
      placement = 'start',
      isInvalid = false,
      isDisabled = false,
      className,
      children,
      ...other
    },
    ref
  ) =>
    isNotNil(children) ? (
      <div
        className={clsx(
          s.base,
          s[placement],
          isInvalid && s.invalid,
          isDisabled && s.disabled,
          className
        )}
        data-placement={placement}
        data-invalid={isInvalid}
        data-disabled={isDisabled}
        data-testid={`field-addon-${placement}`}
        {...other}
        ref={ref}
      >
        {children}
      </div>
    ) : null
);

FieldAddon.displayName = 'FieldAddon';
