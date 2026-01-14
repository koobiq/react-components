'use client';

import { useRef, useContext, forwardRef } from 'react';

import { clsx, useId } from '@koobiq/react-core';
import {
  Provider,
  useDisclosure,
  useDisclosureState,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';

import {
  DisclosurePanel,
  DisclosureTrigger,
  DisclosurePanelContext,
  DisclosureTriggerContext,
  DisclosureGroupStateContext,
} from './components';
import s from './Disclosure.module.css';
import { DisclosureStateContext } from './index';
import type { DisclosureProps, DisclosureRef } from './types';

export const DisclosureComponent = forwardRef<DisclosureRef, DisclosureProps>(
  (props, ref) => {
    const {
      children,
      className,
      id: idProp,
      defaultExpanded,
      onExpandedChange,
      isDisabled: isDisabledProp,
      isExpanded: isExpandedProp,
      ...other
    } = props;

    const commonProps = {
      children,
      onExpandedChange,
      defaultExpanded,
      isDisabled: isDisabledProp,
      isExpanded: isExpandedProp,
    };

    const defaultId = useId();
    const id = idProp || defaultId;
    const groupState = useContext(DisclosureGroupStateContext);

    const isExpanded = groupState
      ? groupState.expandedKeys?.has(id)
      : isExpandedProp;

    const state = useDisclosureState({
      ...commonProps,
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
    const isDisabled = isDisabledProp || groupState?.isDisabled || false;

    const { buttonProps: triggerProps, panelProps } = useDisclosure(
      {
        ...commonProps,
        isExpanded,
        isDisabled,
      },
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
          id={idProp}
          {...other}
          ref={ref}
        >
          {children}
        </div>
      </Provider>
    );
  }
);

DisclosureComponent.displayName = 'Disclosure';

type CompoundedComponent = typeof DisclosureComponent & {
  Trigger: typeof DisclosureTrigger;
  Panel: typeof DisclosurePanel;
};

export const Disclosure = DisclosureComponent as CompoundedComponent;

Disclosure.Trigger = DisclosureTrigger;
Disclosure.Panel = DisclosurePanel;
