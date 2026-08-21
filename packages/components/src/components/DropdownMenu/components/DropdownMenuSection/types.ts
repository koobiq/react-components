import type { ReactNode } from 'react';

import type { DataAttributeProps } from '@koobiq/react-core';
import type { MenuSectionProps as AriaMenuSectionProps } from '@koobiq/react-primitives';

export type DropdownMenuSectionProps<T extends object = object> =
  AriaMenuSectionProps<T> &
    DataAttributeProps & {
      /** The heading of the section. */
      title?: ReactNode;
    };
