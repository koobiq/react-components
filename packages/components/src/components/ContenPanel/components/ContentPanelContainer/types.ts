import type {
  ComponentPropsWithRef,
  ComponentRef,
  ReactElement,
  ReactNode,
} from 'react';

import type {
  DataAttributeProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';
import type { OverlayTriggerState } from '@react-stately/overlays';

export type ContentPanelContainerPropContent =
  | ReactNode
  | ((props: OverlayTriggerState) => ReactElement);

export type ContentPanelContainerProps = ExtendableComponentPropsWithRef<
  {
    /** The content of the container. Can be a render function with panel state. */
    children?: ContentPanelContainerPropContent;
    /** If `true`, the panel is open (controlled). */
    isOpen?: boolean;
    /** The default open state (uncontrolled). */
    defaultOpen?: boolean;
    /** Handler that is called when the panel's open state changes. */
    onOpenChange?: (open: boolean) => void;
    /** The props used for each slot inside. */
    slotProps?: {
      body?: ComponentPropsWithRef<'div'> & DataAttributeProps;
    };
  },
  'div'
>;

export type ContentPanelContainerRef = ComponentRef<'div'>;
