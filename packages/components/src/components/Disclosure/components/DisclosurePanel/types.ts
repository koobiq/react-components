import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { TransitionProps } from 'react-transition-group/Transition';

export type DisclosurePanelRef = ComponentRef<'div'>;

export type DisclosurePanelProps = ExtendableComponentPropsWithRef<
  {
    /** The content of the component. */
    children?: ReactNode;
    /** The props used for each slot inside. */
    slotProps?: {
      transition?: Partial<TransitionProps<HTMLElement>>;
    };
  },
  'div'
>;
