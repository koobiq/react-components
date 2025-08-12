import type { ComponentRef, ReactNode } from 'react';

import type {
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';

import type { TypographyProps } from '../../../Typography';

export type ListItemTextRef = ComponentRef<'span'>;

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
  'span'
>;
