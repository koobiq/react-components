import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { AriaDisclosureProps } from '@koobiq/react-primitives';

export type AccordionProps = ExtendableComponentPropsWithRef<
  AriaDisclosureProps & {
    /** The content of the component. */
    children?: ReactNode;
  },
  'div'
>;

export type AccordionRef = ComponentRef<'div'>;
