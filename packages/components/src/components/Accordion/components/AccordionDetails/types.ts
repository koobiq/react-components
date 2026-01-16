import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { TransitionProps } from 'react-transition-group/Transition';

export type AccordionDetailsRef = ComponentRef<'div'>;

export type AccordionDetailsProps = ExtendableComponentPropsWithRef<
  {
    /** The content of the component. */
    children?: ReactNode;
    /** If `true`, unmounts the content when collapsed. */
    unmountOnExit?: boolean;
    /** The props used for each slot inside. */
    slotProps?: {
      transition?: Partial<TransitionProps<HTMLElement>>;
    };
  },
  'div'
>;
