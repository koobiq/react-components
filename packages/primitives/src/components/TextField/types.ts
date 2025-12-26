import type { ComponentRef, ReactElement } from 'react';

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
  state: {
    value: string;
    set: (value: string) => void;
  };
};

type TextFieldBaseProps = RenderProps<TextFieldRenderProps> & {
  inputElementType?: 'input' | 'textarea';
  /** Handler that is called when the clear button is clicked. */
  onClear?: () => void;
  /** Whether the field can be emptied. */
  isClearable?: boolean;
};

export type TextFieldProps<T = HTMLInputElement> = ExtendableProps<
  TextFieldBaseProps,
  AriaTextFieldProps<T>
>;

export type TextFieldComponentProps = <T = HTMLInputElement>(
  props: TextFieldProps<T>
) => ReactElement | null;

export type TextFieldRef = ComponentRef<'div'>;
