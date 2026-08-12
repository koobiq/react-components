import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

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
  },
  'div'
>;

export type ClampedTextRef = ComponentRef<'div'>;
