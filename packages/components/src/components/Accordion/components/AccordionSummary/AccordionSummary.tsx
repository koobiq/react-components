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
import type { AccordionSummaryProps } from './index';
import { AccordionSummaryContext } from './index';

const textBig = utilClasses.typography['text-big'];

export const AccordionSummary = polymorphicForwardRef<
  'h3',
  AccordionSummaryProps
>((props, ref) => {
  const { className, children, as: Tag = 'h3', ...other } = props;
  const { isExpanded } = useContext(AccordionStateContext);

  const [triggerProps, triggerRef] = useContextProps(
    { children },
    undefined,
    AccordionSummaryContext
  );

  return (
    <Tag className={clsx(s.base, textBig, className)} {...other} ref={ref}>
      <Button
        {...triggerProps}
        data-slot="trigger"
        className={({ isHovered, isDisabled }) =>
          clsx(s.trigger, isHovered && s.hovered, isDisabled && s.disabled)
        }
        ref={triggerRef}
      >
        <span className={s.chevron}>
          <AnimatedIcon
            icons={[<IconChevronRight16 key="chevron" />]}
            directions={[0, 90]}
            activeIndex={+isExpanded}
          />
        </span>
        {triggerProps.children}
      </Button>
    </Tag>
  );
});

AccordionSummary.displayName = 'AccordionSummary';

export type DisclosureTriggerProps<As extends ElementType = 'h3'> =
  ComponentPropsWithRef<typeof AccordionSummary<As>>;
