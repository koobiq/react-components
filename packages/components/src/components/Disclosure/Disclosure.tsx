'use client';

import { createContext, useRef, useContext } from 'react';

import { clsx, useId } from '@koobiq/react-core';
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
  DisclosureGroupStateContext,
} from './components';
import s from './Disclosure.module.css';
import type { DisclosureProps } from './types';

export const DisclosureStateContext = createContext<DisclosureState>(
  {} as DisclosureState
);

export const DisclosureComponent = (props: DisclosureProps) => {
  const { children, className, style, id: idProp } = props;

  const defaultId = useId();
  const id = idProp || defaultId;
  const groupState = useContext(DisclosureGroupStateContext);

  const isExpanded = groupState
    ? groupState.expandedKeys?.has(id)
    : props.isExpanded;

  const state = useDisclosureState({
    ...props,
    isExpanded,
    onExpandedChange(isExpanded) {
      if (groupState) {
        groupState.toggleKey(id);
      }

      props.onExpandedChange?.(isExpanded);
    },
  });

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
