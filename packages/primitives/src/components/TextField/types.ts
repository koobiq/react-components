import type { ComponentRef } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';

import type { UseTextFieldProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type TextFieldRenderProps = {
  /**
   * Whether the text field is disabled.
   * @selector [data-disabled]
   */
  disabled: boolean;
  /**
   * Whether the value is invalid.
   * @selector [data-error]
   */
  error: boolean;
  /**
   * Whether the text field is read only.
   * @selector [data-readonly]
   */
  readonly: boolean;
  /**
   * Whether the text field is required.
   * @selector [data-required]
   */
  required: boolean;
};

type TextFieldBaseProps = RenderProps<TextFieldRenderProps>;

export type TextFieldProps = ExtendableProps<
  TextFieldBaseProps,
  UseTextFieldProps
>;

export type TextFieldRef = ComponentRef<'div'>;
