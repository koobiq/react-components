import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

export const formControlLabelPropSize = ['normal', 'big'] as const;

export type FormControlLabelPropSize =
  (typeof formControlLabelPropSize)[number];

export const formControlLabelPlacement = ['start', 'end'] as const;

export type FormControlLabelPropLabelPlacement =
  (typeof formControlLabelPlacement)[number];

export type FormControlLabelProps = ExtendableComponentPropsWithRef<
  {
    /** The content to display as the label. */
    label?: ReactNode;
    /**
     * If `true`, the component is disabled.
     * @default false
     * */
    disabled?: boolean;
    /** The helper text content. */
    caption?: ReactNode;
    /** The content of the component. */
    children?: ReactNode;
    /**
     * Size.
     * @default 'normal'
     * */
    size?: FormControlLabelPropSize;
    /**
     * The position of the label.
     * @default 'end'
     * */
    labelPlacement?: FormControlLabelPropLabelPlacement;
    slotProps?: {
      content?: ComponentPropsWithRef<'div'>;
    };
  },
  'label'
>;
