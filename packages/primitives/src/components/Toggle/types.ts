import type { RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';

import type { UseToggleProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type ToggleRenderProps = {
  isInvalid?: boolean;
  isPressed?: boolean;
  isSelected?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  isFocusVisible?: boolean;
};

type ToggleBaseProps = RenderProps<ToggleRenderProps> & {
  inputRef?: RefObject<HTMLInputElement | null>;
};

export type ToggleProps = ExtendableProps<ToggleBaseProps, UseToggleProps>;
