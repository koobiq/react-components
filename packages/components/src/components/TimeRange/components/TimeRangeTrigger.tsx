'use client';

import type { ComponentProps } from 'react';

import { mergeProps } from '@koobiq/react-core';
import { IconCalendarO16 } from '@koobiq/react-icons';

import { Link } from '../../Link';
import s from '../TimeRange.module.css';
import type { TimeRangeTriggerProps } from '../types';

import { useTimeRangeTriggerContext } from './TimeRangeTriggerContext';

/**
 * The pressable element that opens `TimeRange`'s popover. Rendered
 * automatically when `TimeRange` has no children. Render it explicitly with
 * a function child to replace the default trigger with your own layout —
 * spread the received `buttonProps` onto whatever element you render.
 */
export function TimeRangeTrigger({
  children,
  ...other
}: TimeRangeTriggerProps) {
  const {
    formattedValue,
    isOpen,
    isEmpty,
    isDisabled,
    placeholder,
    buttonProps: contextButtonProps,
  } = useTimeRangeTriggerContext();

  const buttonProps = {
    ...contextButtonProps,
    isDisabled,
  };

  if (children) {
    return children({
      formattedValue,
      isOpen,
      isEmpty,
      placeholder,
      buttonProps,
    });
  }

  return (
    <span className={s.triggerLink}>
      <Link
        {...(mergeProps(buttonProps, other) as ComponentProps<typeof Link>)}
        isPseudo
        endIcon={<IconCalendarO16 />}
      >
        {isEmpty ? placeholder : formattedValue}
      </Link>
    </span>
  );
}

TimeRangeTrigger.displayName = 'TimeRange.Trigger';
