import {
  type ComponentPropsWithRef,
  createContext,
  type ElementType,
  useContext,
} from 'react';

import type { ValidationResult } from '@koobiq/react-core';
import { isNotNil, polymorphicForwardRef } from '@koobiq/react-core';

import { type RenderProps, useRenderProps } from '../../utils';
import { Text } from '../Text';

export const FieldErrorContext = createContext<ValidationResult | null>(null);

export type FieldErrorRenderProps = ValidationResult;

export type FieldErrorBaseProps = RenderProps<FieldErrorRenderProps>;

export const FieldError = polymorphicForwardRef<'p', FieldErrorBaseProps>(
  (props, ref) => {
    const { as = 'p' } = props;

    const validation = useContext(FieldErrorContext)!;

    const renderProps = useRenderProps({
      ...props,
      values: validation,
      defaultChildren:
        validation.validationErrors.length === 0
          ? undefined
          : validation.validationErrors.join(' '),
    });

    return isNotNil(renderProps.children) && validation.isInvalid ? (
      <Text as={as} slot="errorMessage" {...renderProps} ref={ref}>
        {renderProps.children}
      </Text>
    ) : null;
  }
);

export type FieldErrorProps<As extends ElementType = 'p'> =
  ComponentPropsWithRef<typeof FieldError<As>>;

FieldError.displayName = 'FieldError';
