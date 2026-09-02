import { useState } from 'react';

import { getLocalTimeZone, parseTime, today } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';

import { TimeRange } from './TimeRange';
import s from './TimeRange.module.css';
import type { TimeRangeValue } from './types';

const meta = {
  title: 'Components/TimeRange',
  component: TimeRange,
  subcomponents: {
    'TimeRange.Trigger': TimeRange.Trigger,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-08-28'],
} satisfies Meta<typeof TimeRange>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<TimeRangeValue | null>({
      type: 'last7Days',
    });

    return (
      <>
        <TimeRange
          value={value}
          onChange={(next) => setValue(next)}
          availableTimeRangeTypes={[
            'lastMinute',
            'last5Minutes',
            'last15Minutes',
            'last30Minutes',
            'lastHour',
            'last24Hours',
            'last3Days',
            'last7Days',
            'last14Days',
            'last30Days',
            'last3Months',
            'last12Months',
            'allTime',
            'currentQuarter',
            'currentYear',
            'range',
          ]}
          {...args}
        />
      </>
    );
  },
};

export const CustomTrigger: Story = {
  render: function Render(args) {
    return (
      <TimeRange {...args}>
        <TimeRange.Trigger>
          {({ formattedValue, isOpen, buttonProps }) => (
            <Button
              {...buttonProps}
              variant="fade-contrast-outline"
              className={s.customTriggerButton}
              data-open={isOpen || undefined}
            >
              {formattedValue}
            </Button>
          )}
        </TimeRange.Trigger>
      </TimeRange>
    );
  },
};

export const WithLabel: Story = {
  render: function Render(args) {
    return (
      <TimeRange
        label="Period"
        caption="Applies to the whole report"
        placeholder="Select a period"
        {...args}
      />
    );
  },
};

export const Invalid: Story = {
  render: function Render(args) {
    return (
      <TimeRange
        label="Period"
        placeholder="Select a period"
        isInvalid
        errorMessage="Select a period to continue"
        {...args}
      />
    );
  },
};

export const NoPresets: Story = {
  name: 'No presets (manual range only)',
  render: function Render(args) {
    return <TimeRange availableTimeRangeTypes={[]} {...args} />;
  },
};

export const MinMax: Story = {
  name: 'MinValue and MaxValue',
  render: function Render(args) {
    return (
      <TimeRange
        availableTimeRangeTypes={['range']}
        minValue={today(getLocalTimeZone()).subtract({ months: 1 })}
        maxValue={today(getLocalTimeZone())}
        placeholder="Select a period"
        {...args}
      />
    );
  },
};

export const CustomRangeTypes: Story = {
  render: function Render(args) {
    return (
      <TimeRange
        availableTimeRangeTypes={[
          'last3Minutes',
          'last3Weeks',
          'last3Years',
          'range',
        ]}
        customTimeRangeTypes={[
          {
            type: 'last3Minutes',
            units: { minutes: 3 },
            translationType: 'minutes',
          },
          { type: 'last3Weeks', units: { weeks: 3 }, translationType: 'weeks' },
          { type: 'last3Years', units: { years: 3 }, translationType: 'years' },
        ]}
        {...args}
      />
    );
  },
};

export const CustomOption: Story = {
  render: function Render(args) {
    const zone = getLocalTimeZone();
    const yearStart = today(zone).set({ month: 1, day: 1 });

    return (
      <TimeRange
        availableTimeRangeTypes={['q1', 'q2', 'q3', 'q4']}
        customTimeRangeTypes={[
          {
            type: 'q1',
            units: {},
            translationType: 'other',
            range: {
              start: { date: yearStart, time: parseTime('00:00') },
              end: {
                date: yearStart.set({ month: 3, day: 31 }),
                time: parseTime('23:59'),
              },
            },
          },
          {
            type: 'q2',
            units: {},
            translationType: 'other',
            range: {
              start: {
                date: yearStart.set({ month: 4, day: 1 }),
                time: parseTime('00:00'),
              },
              end: {
                date: yearStart.set({ month: 6, day: 30 }),
                time: parseTime('23:59'),
              },
            },
          },
          {
            type: 'q3',
            units: {},
            translationType: 'other',
            range: {
              start: {
                date: yearStart.set({ month: 7, day: 1 }),
                time: parseTime('00:00'),
              },
              end: {
                date: yearStart.set({ month: 9, day: 30 }),
                time: parseTime('23:59'),
              },
            },
          },
          {
            type: 'q4',
            units: {},
            translationType: 'other',
            range: {
              start: {
                date: yearStart.set({ month: 10, day: 1 }),
                time: parseTime('00:00'),
              },
              end: {
                date: yearStart.set({ month: 12, day: 31 }),
                time: parseTime('23:59'),
              },
            },
          },
        ]}
        renderOption={({ type }) => type.toUpperCase()}
        {...args}
      />
    );
  },
};
