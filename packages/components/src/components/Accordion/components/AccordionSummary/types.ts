import type { ComponentRef, ReactNode, ReactElement } from 'react';

export type AccordionSummaryRef = ComponentRef<'h3'>;

export const accordionSummaryPropExpandIconPlacement = [
  'before-content',
  'after-content',
  'separately',
] as const;

export type AccordionSummaryPropExpandIconPlacement =
  (typeof accordionSummaryPropExpandIconPlacement)[number];

export type AccordionSummaryProps = {
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
  /** Renders a custom expand icon. Receives the current expanded state. */
  expandIcon?: (isExpanded: boolean) => ReactElement;
  /**
   * Controls where the expand icon is placed relative to the content.
   * @default "before-content"
   */
  expandIconPlacement?: AccordionSummaryPropExpandIconPlacement;
};
