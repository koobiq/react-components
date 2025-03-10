import type { RefObject } from 'react';

import type { ExtendableProps } from '@koobiq/react-core';

import type { UseCheckboxProps } from '../../behaviors';
import type { RenderProps } from '../../utils';

export type CheckboxRenderProps = {
  error?: boolean;
  pressed?: boolean;
  checked?: boolean;
  hovered?: boolean;
  focused?: boolean;
  disabled?: boolean;
  focusVisible?: boolean;
  indeterminate?: boolean;
};

type CheckboxBaseProps = RenderProps<CheckboxRenderProps> & {
  inputRef?: RefObject<HTMLInputElement | null>;
};

export type CheckboxProps = ExtendableProps<
  CheckboxBaseProps,
  UseCheckboxProps
>;
