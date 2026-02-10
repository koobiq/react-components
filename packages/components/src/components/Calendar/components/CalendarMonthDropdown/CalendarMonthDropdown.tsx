'use client';

import { useRef, useEffect, type ComponentPropsWithRef } from 'react';

import {
  clsx,
  mergeProps,
  useBoolean,
  useDateFormatter,
} from '@koobiq/react-core';
import { IconChevronDown16 } from '@koobiq/react-icons';
import { type CalendarState } from '@koobiq/react-primitives';

import { capitalizeFirstLetter } from '../../../../utils';
import { Button } from '../../../Button';
import type { ItemProps } from '../../../Collections';
import { Menu } from '../../../Menu';
import type { PopoverProps } from '../../../Popover';
import s from '../../Calendar.module.css';

export type CalendarMonthDropdownProps = {
  state: CalendarState;
  /** The props used for each slot inside. */
  slotProps?: {
    item?: ItemProps<object>;
    popover?: PopoverProps;
    list?: ComponentPropsWithRef<'ul'>;
  };
};

export function CalendarMonthDropdown({
  state,
  slotProps,
}: CalendarMonthDropdownProps) {
  const months: { id: number; name: string }[] = [];
  const disabledKeys = new Set<number>();
  const [isOpen, { on, off }] = useBoolean();

  const longFormatter = useDateFormatter({
    month: 'long',
    timeZone: state.timeZone,
  });

  const shortFormatter = useDateFormatter({
    month: 'short',
    timeZone: state.timeZone,
  });

  const selectedMonthName = shortFormatter.format(
    state.focusedDate.toDate(state.timeZone)
  );

  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (!menuRef.current || !state.focusedDate.month) return;

    const container = menuRef.current;

    const selectedEl = container.querySelector(
      `[data-key="${state.focusedDate.month}"]`
    );

    if (selectedEl instanceof HTMLElement) {
      const containerHeight = container.offsetHeight;
      const elementTop = selectedEl.offsetTop;
      const elementHeight = selectedEl.offsetHeight;

      container.scrollTop =
        elementTop - containerHeight / 2 + elementHeight / 2;
    }
  }, [state.focusedDate.month, isOpen]);

  const numMonths = state.focusedDate.calendar.getMonthsInYear(
    state.focusedDate
  );

  const minDate = state.minValue;
  const maxDate = state.maxValue;

  for (let i = 1; i <= numMonths; i++) {
    const date = state.focusedDate.set({ month: i });

    const isBeforeMin = minDate && date.compare(minDate) < 0;
    const isAfterMax = maxDate && date.compare(maxDate) > 0;

    if (isBeforeMin || isAfterMax) {
      disabledKeys.add(i);
    }

    months.push({
      id: i,
      name: longFormatter.format(date.toDate(state.timeZone)),
    });
  }

  const listProps = mergeProps(
    {
      ref: menuRef,
    },
    slotProps?.list
  );

  const popoverProps = mergeProps(
    {
      maxBlockSize: 265,
      slotProps: {
        transition: {
          onEnter: on,
          onExited: off,
        },
      },
    },
    slotProps?.popover
  );

  return (
    <Menu
      control={(props) => (
        <Button
          {...props}
          className={clsx(isOpen && s.open)}
          variant="contrast-transparent"
          isDisabled={state.isDisabled}
          endIcon={<IconChevronDown16 />}
        >
          {capitalizeFirstLetter(selectedMonthName).replace(/\.$/, '')}
        </Button>
      )}
      className={s.popover}
      slotProps={{
        list: listProps,
        popover: popoverProps,
      }}
      items={months}
      disabledKeys={disabledKeys}
      selectionMode="single"
      selectedKeys={new Set([state.focusedDate.month])}
      onSelectionChange={(keys) => {
        const value = Array.from(keys)[0];
        const date = state.focusedDate.set({ month: +value });
        state.setFocusedDate(date);
      }}
    >
      {(item) => (
        <Menu.Item {...slotProps?.item}>
          {capitalizeFirstLetter(item.name)}
        </Menu.Item>
      )}
    </Menu>
  );
}
