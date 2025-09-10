import type { ComponentPropsWithoutRef, ComponentRef } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaNumberFieldProps } from '@react-aria/numberfield';

import type { RenderProps } from '../../utils';

export type NumberFieldRenderProps = {
  /**
   * Whether the text field is disabled.
   * @selector [data-disabled]
   */
  isDisabled: boolean;
  /**
   * Whether the value is invalid.
   * @selector [data-error]
   */
  isInvalid: boolean;
  /**
   * Whether the text field is read only.
   * @selector [data-readonly]
   */
  isReadonly: boolean;
  /**
   * Whether the text field is required.
   * @selector [data-required]
   */
  isRequired: boolean;
};

type NumberFieldBaseProps = RenderProps<NumberFieldRenderProps>;

export type NumberFieldProps = ExtendableProps<
  NumberFieldBaseProps,
  AriaNumberFieldProps &
    Pick<ComponentPropsWithoutRef<'input'>, 'name' | 'form' | 'disabled'>
>;

export type NumberFieldRef = ComponentRef<'div'>;
