import type { ReactNode } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';
import type { ButtonProps } from '@koobiq/react-primitives';

export type ClampedTextTriggerProps = Omit<
  ButtonProps,
  'as' | 'children' | 'type' | 'aria-controls' | 'aria-expanded'
> &
  DataAttributeProps & {
    /**
     * Icon displayed before the toggle content. Pass `null` to hide it or a
     * render function to use the current expanded state.
     */
    icon?: ReactNode | ((isExpanded: boolean) => ReactNode);
  };
