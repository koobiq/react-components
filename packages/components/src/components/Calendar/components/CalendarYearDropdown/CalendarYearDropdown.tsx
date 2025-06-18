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

  // Format 20 years on each side of the current year according
  // to the current locale and calendar system.
  for (let i = -20; i <= 20; i++) {
    const date = state.focusedDate.add({ years: i });

    console.log(date);

    years.push({
      id: date.year,
    });
  }

  const selectedYearName =
    years.find(({ id }) => id === state.focusedDate.year)?.id ?? '';

  return (
    <>
      <Menu
        slotProps={{
          popover: {
            maxBlockSize: 265,
          },
        }}
        control={(props) => (
          <Button
            {...props}
            variant="contrast-transparent"
            endIcon={<IconChevronDown16 />}
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
        {(item) => <Menu.Item>{item.id}</Menu.Item>}
      </Menu>
    </>
  );
}
