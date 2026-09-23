import { CalendarDate } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Calendar } from './index.js';
import type { CalendarProps } from './index.js';

const meta = {
  title: 'E2E/Calendar',
  component: Calendar,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof Calendar>;

type State = { title: string } & CalendarProps<CalendarDate>;

// Cell hover, press and focus come from React Aria, so only the states set by props.
const states: State[] = [
  { title: 'normal' },
  { title: 'disabled', isDisabled: true },
  { title: 'invalid', isInvalid: true },
];

// The value is not today (2026-01-15), so that both dates are marked.
export const States: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {states.map(({ title, ...state }) => (
        <Calendar
          key={title}
          aria-label={title}
          defaultValue={new CalendarDate(2026, 1, 20)}
          {...state}
        />
      ))}
    </E2eGrid>
  ),
};
