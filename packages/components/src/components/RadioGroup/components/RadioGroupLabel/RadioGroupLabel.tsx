import { forwardRef } from 'react';
import type { ComponentRef, ReactNode } from 'react';

import { isNotNil } from '@koobiq/react-core';
import { Label } from '@koobiq/react-primitives';

import { Typography, type TypographyProps } from '../../../Typography';

export type RadioGroupLabelProps = TypographyProps<'span'> & {
  children?: ReactNode;
};

const RadioGroupLabelTypography = forwardRef<
  ComponentRef<'span'>,
  TypographyProps<'span'>
>((props, ref) => <Typography as="span" {...props} ref={ref} />);

RadioGroupLabelTypography.displayName = 'RadioGroupLabelTypography';

export const RadioGroupLabel = forwardRef<
  ComponentRef<'span'>,
  RadioGroupLabelProps
>(({ children, ...other }, ref) =>
  isNotNil(children) ? (
    <Label as={RadioGroupLabelTypography} {...other} ref={ref}>
      {children}
    </Label>
  ) : null
);

RadioGroupLabel.displayName = 'RadioGroupLabel';
