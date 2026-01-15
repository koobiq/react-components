'use client';

import {
  type ComponentPropsWithRef,
  type ElementType,
  useContext,
} from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { IconChevronRight16 } from '@koobiq/react-icons';
import { Button, useContextProps } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { AnimatedIcon } from '../../../AnimatedIcon';
import { AccordionStateContext } from '../../AccordionStateContext';

import s from './AccordionSummary.module.css';
import { type AccordionSummaryProps } from './index';
import { AccordionSummaryContext } from './index';

const textBig = utilClasses.typography['text-big'];

export const AccordionSummary = polymorphicForwardRef<
  'h3',
  AccordionSummaryProps
>((props, ref) => {
  const {
    className,
    children,
    as: Tag = 'h3',
    expandIcon: expandIconProp,
    expandIconPlacement = 'before-content',
    ...other
  } = props;

  const { isExpanded } = useContext(AccordionStateContext);

  const [triggerProps, triggerRef] = useContextProps(
    { children },
    undefined,
    AccordionSummaryContext
  );

  const expandIconDefault = (
    <AnimatedIcon
      icons={[<IconChevronRight16 key="expand-icon" />]}
      directions={[0, 90]}
      activeIndex={+isExpanded}
    />
  );

  const expandIcon = (
    <span
      className={clsx(s.expandIcon)}
      data-expanded={isExpanded || undefined}
      aria-hidden="true"
    >
      {expandIconProp?.(isExpanded) ?? expandIconDefault}
    </span>
  );

  return (
    <Tag className={clsx(s.base, textBig, className)} {...other} ref={ref}>
      <Button
        {...triggerProps}
        data-slot="trigger"
        className={({ isHovered, isDisabled }) =>
          clsx(
            s.trigger,
            isHovered && s.hovered,
            isDisabled && s.disabled,
            s[expandIconPlacement]
          )
        }
        ref={triggerRef}
      >
        {expandIconPlacement === 'before-content' && expandIcon}
        {triggerProps.children}
        {expandIconPlacement !== 'before-content' && expandIcon}
      </Button>
    </Tag>
  );
});

AccordionSummary.displayName = 'AccordionSummary';

export type DisclosureTriggerProps<As extends ElementType = 'h3'> =
  ComponentPropsWithRef<typeof AccordionSummary<As>>;
