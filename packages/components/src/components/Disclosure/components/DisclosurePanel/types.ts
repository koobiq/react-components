import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

export type DisclosurePanelRef = ComponentRef<'div'>;

export type DisclosurePanelProps = ExtendableComponentPropsWithRef<
  {
    /** The content of the component. */
    children?: ReactNode;
  },
  'div'
>;
