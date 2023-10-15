import type { ComponentPropsWithRef } from 'react';

import type { UseCheckboxProps } from '@koobiq/react-primitives';

export const checkboxPropSize = ['normal', 'big'] as const;

export type CheckboxPropSize = (typeof checkboxPropSize)[number];

export type CheckboxProps = UseCheckboxProps & {
  caption?: string;
  className?: string;
  /** Size */
  size?: CheckboxPropSize;
  slotProps?: {
    root?: ComponentPropsWithRef<'label'>;
    input?: ComponentPropsWithRef<'input'>;
    checkbox?: ComponentPropsWithRef<'div'>;
    content?: ComponentPropsWithRef<'div'>;
  };
};
