import type { RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';

import type { UseToggleProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type ToggleRenderProps = {
  error?: boolean;
  pressed?: boolean;
  checked?: boolean;
  hovered?: boolean;
  focused?: boolean;
  disabled?: boolean;
  focusVisible?: boolean;
};

type ToggleBaseProps = RenderProps<ToggleRenderProps> & {
  inputRef?: RefObject<HTMLInputElement | null>;
};

export type ToggleProps = ExtendableProps<ToggleBaseProps, UseToggleProps>;
