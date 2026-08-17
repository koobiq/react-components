import type { ReactNode } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';
import type { ButtonProps } from '@koobiq/react-primitives';

export type ClampedTextTriggerProps = Omit<
  ButtonProps,
  'as' | 'children' | 'type'
> &
  DataAttributeProps & {
    children: ReactNode;
    /** Icon displayed before the toggle content. */
    icon?: ReactNode;
  };
