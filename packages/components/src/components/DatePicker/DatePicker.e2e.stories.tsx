import { CalendarDate } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';

import { DatePicker } from './index.js';
import type { DatePickerProps } from './index.js';

const meta = {
  title: 'E2E/DatePicker',
  component: DatePicker,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof DatePicker>;

type State = { title: string } & DatePickerProps<CalendarDate>;

// React Aria sets focus only on interaction, so the control group's class is forced.
const states: State[] = [
  { title: 'normal' },
  {
    title: 'focus',
    slotProps: {
      root: { slotProps: { group: { className: controlGroup.focused } } },
    },
  },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const values: DatePickerProps<CalendarDate>[] = [
  {},
  { defaultValue: new CalendarDate(2026, 1, 20) },
];

export const States: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {values.flatMap((value, index) =>
        states.map(({ title, ...state }) => (
          <DatePicker
            key={`${index}-${title}`}
            label={title}
            {...value}
            {...state}
          />
        ))
      )}
    </E2eGrid>
  ),
};

// The open calendar is screenshotted by itself, so the test id goes on the popover.
export const Open: Story = {
  render: () => (
    <DatePicker
      aria-label="Date"
      defaultOpen
      defaultValue={new CalendarDate(2026, 1, 20)}
      slotProps={{ popover: { 'data-testid': 'e2eScreenshotTarget' } }}
    />
  ),
};
