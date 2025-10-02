import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from '../../Form.module.css';

export type FormActionsBaseProps = {
  /** Additional CSS-classes. */
  className?: string;
};

export const FormActions = polymorphicForwardRef<'div', FormActionsBaseProps>(
  ({ className, as: Tag = 'div', ...other }, ref) => (
    <Tag className={clsx(s.actions, className)} {...other} ref={ref} />
  )
);

export type FormActionsProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FormActions<As>>;
