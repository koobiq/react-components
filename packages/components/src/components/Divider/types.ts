import type { ExtendableProps } from '@koobiq/react-core';
import type { SeparatorProps } from '@koobiq/react-primitives';

export const dividerPropDisplay = ['block', 'inline', 'inlineBlock'] as const;

export type DividerPropDisplay = (typeof dividerPropDisplay)[number];

export type DividerBaseProps = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** Set the display for the component. */
    display?: DividerPropDisplay;
    /**
     * Indicates if the divider is a child of a flex container.
     * Mainly used for vertical layout.
     * Used when the block does not have a fixed height.
     * @default false
     */
    flexItem?: boolean;
    /**
     * If `true`, it disables the default paddings.
     * @default false
     */
    disablePaddings?: boolean;
  },
  Omit<SeparatorProps, 'elementType'>
>;
