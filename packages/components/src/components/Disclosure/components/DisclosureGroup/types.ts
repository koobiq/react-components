import type { ComponentRef, ReactNode } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import type { DisclosureGroupProps as AriaDisclosureGroupProps } from '@koobiq/react-primitives';

export type DisclosureGroupProps = ExtendableComponentPropsWithRef<
  AriaDisclosureGroupProps & {
    children?: ReactNode;
  },
  'div'
>;

export type DisclosureGroupRef = ComponentRef<'div'>;
