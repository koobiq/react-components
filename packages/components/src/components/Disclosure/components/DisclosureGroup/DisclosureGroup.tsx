'use client';

import { createContext, type ReactNode } from 'react';

import type {
  DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosureGroupState,
} from '@koobiq/react-primitives';
import { useDisclosureGroupState } from '@koobiq/react-primitives';

export const DisclosureGroupStateContext =
  createContext<DisclosureGroupState | null>(null);

export type DisclosureGroupProps = AriaDisclosureGroupProps & {
  children?: ReactNode;
};

export function DisclosureGroup(props: DisclosureGroupProps) {
  const state = useDisclosureGroupState(props);

  return (
    <div className="group">
      <DisclosureGroupStateContext.Provider value={state}>
        {props.children}
      </DisclosureGroupStateContext.Provider>
    </div>
  );
}
