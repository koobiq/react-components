'use client';

import { useRef, useContext, forwardRef } from 'react';

import { clsx, useId } from '@koobiq/react-core';
import {
  Provider,
  useDisclosure,
  useDisclosureState,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';

import s from './Accordion.module.css';
import {
  AccordionDetails,
  AccordionSummary,
  AccordionDetailsContext,
  AccordionSummaryContext,
  AccordionGroupStateContext,
} from './components';
import { AccordionStateContext } from './index';
import type { AccordionProps, AccordionRef } from './types';

const textNormal = utilClasses.typography['text-normal'];

export const AccordionComponent = forwardRef<AccordionRef, AccordionProps>(
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
    const groupState = useContext(AccordionGroupStateContext);

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
          [AccordionStateContext, state],
          [AccordionSummaryContext, { ...triggerProps, ref: triggerRef }],
          [AccordionDetailsContext, { ...panelProps, ref: panelRef }],
        ]}
      >
        <div
          className={clsx(s.base, textNormal, className)}
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

AccordionComponent.displayName = 'Accordion';

type CompoundedComponent = typeof AccordionComponent & {
  Summary: typeof AccordionSummary;
  Details: typeof AccordionDetails;
};

export const Accordion = AccordionComponent as CompoundedComponent;

Accordion.Summary = AccordionSummary;
Accordion.Details = AccordionDetails;
