import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import s from '../../Form.module.css';

export const formCaptionPropSide = ['top', 'bottom'] as const;

export type FormCaptionPropSide = (typeof formCaptionPropSide)[number];

export type FormCaptionBaseProps = {
  className?: string;
  side?: FormCaptionPropSide;
};

export const FormCaption = polymorphicForwardRef<'div', FormCaptionBaseProps>(
  ({ className, as: Tag = 'div', side = 'top', ...other }, ref) => (
    <Tag className={clsx(s.caption, s[side], className)} {...other} ref={ref} />
  )
);

export type FormCationProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FormCaption<As>>;
