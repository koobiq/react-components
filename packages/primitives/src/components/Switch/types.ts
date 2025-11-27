import type { RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';

import type { UseSwitchProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type SwitchRenderProps = {
  isInvalid?: boolean;
  isPressed?: boolean;
  isReadOnly?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  isFocusVisible?: boolean;
};

type SwitchBaseProps = RenderProps<SwitchRenderProps> & {
  inputRef?: RefObject<HTMLInputElement | null>;
};

export type SwitchProps = ExtendableProps<SwitchBaseProps, UseSwitchProps>;
