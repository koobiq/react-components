'use client';

import type { ComponentRef, ReactNode } from 'react';
import { forwardRef } from 'react';

import { clsx, isNotNil } from '@koobiq/react-core';
import type {
  ExtendableComponentPropsWithRef,
  DataAttributeProps,
} from '@koobiq/react-core';

import { Typography } from '../../../Typography';
import type { TypographyProps } from '../../../Typography';

import s from './ListItemText.module.css';

export type ListItemTextRef = ComponentRef<'div'>;

export type ListItemTextProps = ExtendableComponentPropsWithRef<
  {
    /** The content of the component. */
    children?: ReactNode;
    /** The helper text content. */
    caption?: ReactNode;
    /** The props used for each slot inside. */
    slotProps?: {
      text?: TypographyProps;
      caption?: TypographyProps;
    };
  } & DataAttributeProps,
  'div'
>;

export const ListItemText = forwardRef<ListItemTextRef, ListItemTextProps>(
  ({ className, children, caption, slotProps, ...other }, ref) => (
    <div className={clsx(s.base, className)} {...other} ref={ref}>
      <Typography as="span" {...slotProps?.text}>
        {children}
      </Typography>
      {isNotNil(caption) && (
        <Typography
          as="span"
          color="contrast-secondary"
          className={s.caption}
          variant="text-compact"
          {...slotProps?.caption}
        >
          {caption}
        </Typography>
      )}
    </div>
  )
);

ListItemText.displayName = 'ListItemText';
