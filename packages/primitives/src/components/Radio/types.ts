import type { RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaRadioGroupProps } from '@react-aria/radio';
import type { RadioGroupState } from '@react-stately/radio';

import type { UseRadioProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type RadioRenderProps = {
  isInvalid?: boolean;
  isFocused?: boolean;
  isHovered?: boolean;
  isPressed?: boolean;
  isReadOnly?: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isFocusVisible?: boolean;
};

export type RadioGroupRenderProps = {
  isInvalid: boolean;
  isDisabled: boolean;
  isReadOnly: boolean;
  isRequired: boolean;
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
  AriaRadioGroupProps
>;
