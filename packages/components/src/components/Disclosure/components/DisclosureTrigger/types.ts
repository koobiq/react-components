import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';

export type DisclosureTriggerRef = ComponentRef<'h3'>;

export type DisclosureTriggerProps = ExtendableComponentPropsWithRef<
  {
    /** The content of the component. */
    children?: ReactNode;
  },
  'h3'
>;
