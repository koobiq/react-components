import type { ComponentRef, ReactNode } from 'react';

export type AccordionSummaryRef = ComponentRef<'h3'>;

export type AccordionSummaryProps = {
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
};
