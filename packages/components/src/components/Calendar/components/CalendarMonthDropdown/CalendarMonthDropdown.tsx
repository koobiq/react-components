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

  const formatter = useDateFormatter({
    month: 'long',
    timeZone: state.timeZone,
  });

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
          variant="contrast-transparent"
          endIcon={<IconChevronDown16 />}
        >
          {capitalizeFirstLetter(selectedMonthName)}
        </Button>
      )}
      className={s.popover}
      slotProps={{
        popover: {
          maxBlockSize: 265,
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
