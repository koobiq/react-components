'use client';

import { useEffect, useRef } from 'react';

import { clsx, useBoolean } from '@koobiq/react-core';
import { IconChevronDown16 } from '@koobiq/react-icons';
import { type CalendarState } from '@koobiq/react-primitives';

import { Button } from '../../../Button';
import { Menu } from '../../../Menu';
import s from '../../Calendar.module.css';

type CalendarYearDropdownProps = {
  state: CalendarState;
};

export function CalendarYearDropdown({ state }: CalendarYearDropdownProps) {
  const years: { id: number }[] = [];
  const [isOpen, { on, off }] = useBoolean();

  const menuRef = useRef<HTMLUListElement | null>(null);

  const minYear = state.minValue?.year ?? state.focusedDate.year - 20;
  const maxYear = state.maxValue?.year ?? state.focusedDate.year + 20;

  for (let y = minYear; y <= maxYear; y++) {
    years.push({ id: y });
  }

  useEffect(() => {
    if (!menuRef.current || !state.focusedDate.year) return;

    const container = menuRef.current;

    const selectedEl = container.querySelector(
      `[data-key="${state.focusedDate.year}"]`
    );

    if (selectedEl instanceof HTMLElement) {
      const containerHeight = container.offsetHeight;
      const elementTop = selectedEl.offsetTop;
      const elementHeight = selectedEl.offsetHeight;

      container.scrollTop =
        elementTop - containerHeight / 2 + elementHeight / 2;
    }
  }, [state.focusedDate.year, isOpen]);

  const selectedYearName =
    years.find(({ id }) => id === state.focusedDate.year)?.id ?? '';

  return (
    <Menu
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
      control={(props) => (
        <Button
          {...props}
          className={clsx(isOpen && s.open)}
          variant="contrast-transparent"
          endIcon={<IconChevronDown16 />}
          isDisabled={state.isDisabled}
        >
          {selectedYearName}
        </Button>
      )}
      className={s.popover}
      items={years}
      selectionMode="single"
      selectedKeys={new Set([state.focusedDate.year])}
      onSelectionChange={(keys) => {
        const value = Array.from(keys)[0];
        const date = state.focusedDate.set({ year: +value });
        state.setFocusedDate(date);
      }}
    >
      {(item) => <Menu.Item textValue={String(item.id)}>{item.id}</Menu.Item>}
    </Menu>
  );
}
