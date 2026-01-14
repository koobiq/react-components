import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { AriaDisclosureProps } from '@koobiq/react-primitives';

export type DisclosureProps = ExtendableComponentPropsWithRef<
  AriaDisclosureProps & {
    /** The content of the component. */
    children?: ReactNode;
  },
  'div'
>;

export type DisclosureRef = ComponentRef<'div'>;
