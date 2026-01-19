import type { ComponentRef, ReactNode } from 'react';

export type ContentPanelContainerProps = {
  children?: ReactNode;
  isOpen?: boolean;
  defaultOpen?: boolean;
  /** Handler that is called when the panel's open state changes. */
  onOpenChange?: (open: boolean) => void;
};

export type ContentPanelContainerRef = ComponentRef<'div'>;
