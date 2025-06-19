'use client';

import { useRef, useEffect } from 'react';

import { clsx, useBoolean } from '@koobiq/react-core';
import { IconChevronDown16 } from '@koobiq/react-icons';
import { type CalendarState, useDateFormatter } from '@koobiq/react-primitives';

import { capitalizeFirstLetter } from '../../../../utils';
import { Button } from '../../../Button';
import { Menu } from '../../../Menu';
import s from '../../Calendar.module.css';

type CalendarMonthDropdownProps = {
  state: CalendarState;
};

export function CalendarMonthDropdown({ state }: CalendarMonthDropdownProps) {
  const months: { id: number; name: string }[] = [];
  const [isOpen, { on, off }] = useBoolean();

  const formatter = useDateFormatter({
    month: 'short',
    timeZone: state.timeZone,
  });

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

  // Format the name of each month in the year according to the
  // current locale and calendar system. Note that in some calendar
  // systems, such as the Hebrew, the number of months may differ
  // between years.
  const numMonths = state.focusedDate.calendar.getMonthsInYear(
    state.focusedDate
  );

  for (let i = 1; i <= numMonths; i++) {
    const date = state.focusedDate.set({ month: i });
    months.push({ id: i, name: formatter.format(date.toDate(state.timeZone)) });
  }

  const selectedMonthName =
    months.find(({ id }) => id === state.focusedDate.month)?.name ?? '';

  return (
    <Menu
      control={(props) => (
        <Button
          {...props}
          className={clsx(isOpen && s.open)}
          variant="contrast-transparent"
          endIcon={<IconChevronDown16 />}
        >
          {capitalizeFirstLetter(selectedMonthName)}
        </Button>
      )}
      className={s.popover}
      slotProps={{
        list: {
          ref: menuRef,
        },
        popover: {
          maxBlockSize: 265,
          slotProps: {
            transition: {
              onEnter: on,
              onExited: off,
            },
          },
        },
      }}
      items={months}
      selectionMode="single"
      selectedKeys={new Set([state.focusedDate.month])}
      onSelectionChange={(keys) => {
        const value = Array.from(keys)[0];
        const date = state.focusedDate.set({ month: +value });
        state.setFocusedDate(date);
      }}
    >
      {(item) => <Menu.Item>{capitalizeFirstLetter(item.name)}</Menu.Item>}
    </Menu>
  );
}
