'use client';

import {
  type ComponentPropsWithRef,
  type ElementType,
  type ReactNode,
  useContext,
} from 'react';

import {
  clsx,
  type DataAttributeProps,
  mergeProps,
  polymorphicForwardRef,
} from '@koobiq/react-core';
import { IconChevronRight16 } from '@koobiq/react-icons';
import { Button, useContextProps } from '@koobiq/react-primitives';
import type { ButtonProps } from '@koobiq/react-primitives';

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
    slotProps,
    ...other
  } = props;

  const { isExpanded } = useContext(AccordionStateContext);

  const [triggerPropsAria, triggerRef] = useContextProps(
    { children },
    undefined,
    AccordionSummaryContext
  );

  const expandIconProps = mergeProps(
    {
      className: s.expandIcon,
      'data-expanded': isExpanded || undefined,
      'aria-hidden': 'true',
    },
    slotProps?.expandIcon
  );

  const triggerProps = mergeProps<
    (
      | (Omit<ButtonProps, 'children'> &
          DataAttributeProps & { children?: ReactNode })
      | undefined
    )[]
  >(
    triggerPropsAria,
    {
      'data-slot': 'trigger',
      className: ({ isHovered, isDisabled }) =>
        clsx(
          s.trigger,
          isHovered && s.hovered,
          isDisabled && s.disabled,
          s[expandIconPlacement]
        ),
      ref: triggerRef,
    },
    slotProps?.trigger
  );

  const expandIconDefault = (
    <AnimatedIcon
      icons={[<IconChevronRight16 key="expand-icon" />]}
      directions={[0, 90]}
      activeIndex={+isExpanded}
    />
  );

  const expandIcon = (
    <span {...expandIconProps}>
      {expandIconProp?.(isExpanded) ?? expandIconDefault}
    </span>
  );

  return (
    <Tag className={clsx(s.base, textBig, className)} {...other} ref={ref}>
      <Button {...triggerProps}>
        {expandIconPlacement === 'before-content' && expandIcon}
        {triggerProps?.children}
        {expandIconPlacement !== 'before-content' && expandIcon}
      </Button>
    </Tag>
  );
});

AccordionSummary.displayName = 'AccordionSummary';

export type DisclosureTriggerProps<As extends ElementType = 'h3'> =
  ComponentPropsWithRef<typeof AccordionSummary<As>>;
