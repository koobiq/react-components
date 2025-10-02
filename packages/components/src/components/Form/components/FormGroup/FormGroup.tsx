import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from '../../Form.module.css';

export type FormGroupBaseProps = {
  className?: string;
};

export const FormGroup = polymorphicForwardRef<'div', FormGroupBaseProps>(
  ({ className, as: Tag = 'div', ...other }, ref) => (
    <Tag className={clsx(s.group, className)} {...other} ref={ref} />
  )
);

export type FormGroupProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FormGroup<As>>;
