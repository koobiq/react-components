import type { ComponentPropsWithRef, ComponentRef, ReactNode } from 'react';

import type {
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';
import type { ButtonProps } from '@koobiq/react-primitives';

export type ClampedTextProps = ExtendableComponentPropsWithRef<
  {
    /** The content of the component. */
    children?: ReactNode;
    /**
     * Maximum number of visible rows when the text is collapsed.
     * @default 5
     */
    rows?: number;
    /** Whether the text is expanded. */
    isExpanded?: boolean;
    /**
     * Whether the text is expanded by default.
     * @default false
     */
    defaultExpanded?: boolean;
    /** Handler called when the user toggles the expanded state. */
    onExpandedChange?: (isExpanded: boolean) => void;
    /** Content displayed in the toggle when the text is collapsed. */
    moreText?: ReactNode;
    /** Content displayed in the toggle when the text is expanded. */
    lessText?: ReactNode;
    /** The props used for each slot inside. */
    slotProps?: {
      content?: Omit<ComponentPropsWithRef<'div'>, 'children'> &
        DataAttributeProps;
      toggle?: Omit<
        ButtonProps,
        'as' | 'children' | 'type' | 'aria-controls' | 'aria-expanded'
      > &
        DataAttributeProps;
    };
  },
  'div'
>;

export type ClampedTextRef = ComponentRef<'div'>;
