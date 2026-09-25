import { CalendarDate, Time } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { TimeRange } from './index.js';

const meta = {
  title: 'E2E/TimeRange',
  component: TimeRange,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof TimeRange>;

export default meta;

type Story = StoryObj<typeof TimeRange>;

export const Open: Story = {
  render: () => (
    <TimeRange
      defaultValue={{ type: 'last7Days' }}
      defaultRangeValue={{
        start: { date: new CalendarDate(2026, 1, 12), time: new Time(9) },
        end: { date: new CalendarDate(2026, 1, 14), time: new Time(18) },
      }}
      slotProps={{
        popover: { defaultOpen: true, 'data-testid': 'e2eScreenshotTarget' },
      }}
    >
      <Button>Period</Button>
    </TimeRange>
  ),
};
