import type { ComponentRef } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaTextFieldProps } from '@react-aria/textfield';

import type { RenderProps } from '../../utils';

export type TextFieldRenderProps = {
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
  isReadOnly: boolean;
  /**
   * Whether the text field is required.
   * @selector [data-required]
   */
  isRequired: boolean;
};

type TextFieldBaseProps = RenderProps<TextFieldRenderProps>;

export type TextFieldProps = ExtendableProps<
  TextFieldBaseProps,
  AriaTextFieldProps
>;

export type TextFieldRef = ComponentRef<'div'>;
