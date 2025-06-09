import type { RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';

import type { UseCheckboxProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type CheckboxRenderProps = {
  isInvalid?: boolean;
  isPressed?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  isFocusVisible?: boolean;
  isIndeterminate?: boolean;
};

type CheckboxBaseProps = RenderProps<CheckboxRenderProps> & {
  inputRef?: RefObject<HTMLInputElement | null>;
};

export type CheckboxProps = ExtendableProps<
  CheckboxBaseProps,
  UseCheckboxProps
>;
