import { CalendarDate } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';

import { DateInput, dateInputPropVariant } from './index.js';
import type { DateInputProps } from './index.js';

const meta = {
  title: 'E2E/DateInput',
  component: DateInput,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof DateInput>;

export default meta;

type Story = StoryObj<typeof DateInput>;

type State = { title: string } & DateInputProps<CalendarDate>;

// React Aria sets focus only on interaction, so the control group's class is forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'focus', slotProps: { group: { className: controlGroup.focused } } },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const values: DateInputProps<CalendarDate>[] = [
  {},
  { defaultValue: new CalendarDate(2026, 1, 15) },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {dateInputPropVariant.flatMap((variant) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <DateInput
              key={`${variant}-${index}-${title}`}
              label={title}
              variant={variant}
              {...value}
              {...state}
            />
          ))
        )
      )}
    </E2eGrid>
  ),
};
