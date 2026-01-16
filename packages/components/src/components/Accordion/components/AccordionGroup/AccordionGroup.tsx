'use client';

import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { useDisclosureGroupState } from '@koobiq/react-primitives';

import s from './AccordionGroup.module.css';
import type { AccordionGroupProps, AccordionGroupRef } from './index';
import { AccordionGroupStateContext } from './index';

export const AccordionGroup = forwardRef<
  AccordionGroupRef,
  AccordionGroupProps
>((props, ref) => {
  const {
    children,
    className,
    isDisabled,
    expandedKeys,
    onExpandedChange,
    defaultExpandedKeys,
    allowsMultipleExpanded,
    ...other
  } = props;

  const state = useDisclosureGroupState({
    isDisabled,
    expandedKeys,
    onExpandedChange,
    defaultExpandedKeys,
    allowsMultipleExpanded,
  });

  return (
    <div className={clsx(s.base, className)} {...other} ref={ref}>
      <AccordionGroupStateContext.Provider value={state}>
        {children}
      </AccordionGroupStateContext.Provider>
    </div>
  );
});

AccordionGroup.displayName = 'AccordionGroup';
