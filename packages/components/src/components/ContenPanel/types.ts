import type { ComponentRef, ReactElement, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { OverlayTriggerState } from '@react-stately/overlays';

export type ContentPanelContainerPropContent =
  | ReactNode
  | ((props: OverlayTriggerState) => ReactElement);

export type ContentPanelContainerProps = ExtendableComponentPropsWithRef<
  {
    children?: ContentPanelContainerPropContent;
    isOpen?: boolean;
    defaultOpen?: boolean;
    /** Handler that is called when the panel's open state changes. */
    onOpenChange?: (open: boolean) => void;
  },
  'div'
>;

export type ContentPanelContainerRef = ComponentRef<'div'>;
