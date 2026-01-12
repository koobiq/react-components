'use client';

import { createContext, useRef } from 'react';

import { clsx } from '@koobiq/react-core';
import {
  Provider,
  useDisclosure,
  useDisclosureState,
} from '@koobiq/react-primitives';
import type { DisclosureState } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';

import {
  DisclosurePanel,
  DisclosureTrigger,
  DisclosurePanelContext,
  DisclosureTriggerContext,
} from './components';
import s from './Disclosure.module.css';
import type { DisclosureProps } from './types';

export const DisclosureStateContext = createContext<DisclosureState>(
  {} as DisclosureState
);

export const DisclosureComponent = (props: DisclosureProps) => {
  const { children, className, style } = props;
  const state = useDisclosureState(props);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const { buttonProps: triggerProps, panelProps } = useDisclosure(
    props,
    state,
    panelRef
  );

  return (
    <Provider
      values={[
        [DisclosureStateContext, state],
        [DisclosureTriggerContext, { ...triggerProps, ref: triggerRef }],
        [DisclosurePanelContext, { ...panelProps, ref: panelRef }],
      ]}
    >
      <div
        className={clsx(
          s.base,
          utilClasses.typography['text-normal'],
          className
        )}
        style={style}
      >
        {children}
      </div>
    </Provider>
  );
};

type CompoundedComponent = typeof DisclosureComponent & {
  Trigger: typeof DisclosureTrigger;
  Panel: typeof DisclosurePanel;
};

export const Disclosure = DisclosureComponent as CompoundedComponent;

Disclosure.Trigger = DisclosureTrigger;
Disclosure.Panel = DisclosurePanel;
