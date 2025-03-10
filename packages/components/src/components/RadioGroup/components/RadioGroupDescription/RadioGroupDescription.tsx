import { forwardRef } from 'react';
import type { ComponentRef } from 'react';

import { isNotNil } from '@koobiq/react-core';

import { Typography, type TypographyProps } from '../../../Typography';

export type RadioGroupDescriptionProps = TypographyProps;

export const RadioGroupDescription = forwardRef<
  ComponentRef<'p'>,
  RadioGroupDescriptionProps
>(({ children, ...other }, ref) =>
  isNotNil(children) ? (
    <Typography
      variant="text-compact"
      slot="description"
      color="contrast-secondary"
      {...other}
      ref={ref}
    >
      {children}
    </Typography>
  ) : null
);

RadioGroupDescription.displayName = 'RadioGroupDescription';
