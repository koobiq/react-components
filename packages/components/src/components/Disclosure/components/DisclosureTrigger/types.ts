import type { ComponentRef, ReactNode } from 'react';

export type DisclosureTriggerRef = ComponentRef<'h3'>;

export type DisclosureBaseTriggerProps = {
  /** The content of the component. */
  children?: ReactNode;
  /** Additional CSS-classes. */
  className?: string;
};
