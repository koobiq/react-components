import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { DisclosureGroupProps as AriaDisclosureGroupProps } from '@koobiq/react-primitives';

export type AccordionGroupProps = ExtendableComponentPropsWithRef<
  AriaDisclosureGroupProps & {
    children?: ReactNode;
  },
  'div'
>;

export type AccordionGroupRef = ComponentRef<'div'>;
