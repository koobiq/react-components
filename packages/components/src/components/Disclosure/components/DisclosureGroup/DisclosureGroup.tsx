'use client';

import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { useDisclosureGroupState } from '@koobiq/react-primitives';

import s from './DisclosureGroup.module.css';
import type { DisclosureGroupProps, DisclosureGroupRef } from './index';
import { DisclosureGroupStateContext } from './index';

export const DisclosureGroup = forwardRef<
  DisclosureGroupRef,
  DisclosureGroupProps
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
      <DisclosureGroupStateContext.Provider value={state}>
        {children}
      </DisclosureGroupStateContext.Provider>
    </div>
  );
});

DisclosureGroup.displayName = 'DisclosureGroup';
