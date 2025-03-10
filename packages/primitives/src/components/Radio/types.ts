import type { RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';

import type {
  RadioGroupState,
  UseRadioGroupProps,
  UseRadioProps,
} from '../../behaviors';
import type { RenderProps } from '../../utils';

export type RadioRenderProps = {
  error?: boolean;
  focused?: boolean;
  hovered?: boolean;
  pressed?: boolean;
  checked?: boolean;
  disabled?: boolean;
  focusVisible?: boolean;
  indeterminate?: boolean;
};

export type RadioGroupRenderProps = {
  error: boolean;
  disabled: boolean;
  readonly: boolean;
  required: boolean;
  state: RadioGroupState;
  orientation: 'horizontal' | 'vertical';
};

type RadioBaseProps = RenderProps<RadioRenderProps> & {
  inputRef?: RefObject<HTMLInputElement | null>;
};

export type RadioProps = ExtendableProps<RadioBaseProps, UseRadioProps>;

type RadioGroupBaseProps = RenderProps<RadioGroupRenderProps>;

export type RadioGroupProps = ExtendableProps<
  RadioGroupBaseProps,
  UseRadioGroupProps
>;
