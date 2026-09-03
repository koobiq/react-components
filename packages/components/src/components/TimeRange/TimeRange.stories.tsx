import { useState } from 'react';

import { getLocalTimeZone, today } from '@internationalized/date';
import { IconCalendarO16 } from '@koobiq/react-icons';
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

export const Base: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<TimeRangeValue | null>({
      type: 'last7Days',
    });

    return (
      <>
        <TimeRange
          value={value}
          onChange={(next) => setValue(next)}
          onValueCorrected={(corrected) => setValue(corrected)}
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
          {({ isOpen, buttonProps }) => (
            <Button
              {...buttonProps}
              variant="fade-contrast-filled"
              className={s.customTriggerButton}
              data-open={isOpen || undefined}
              startIcon={<IconCalendarO16 />}
              onlyIcon
            ></Button>
          )}
        </TimeRange.Trigger>
      </TimeRange>
    );
  },
};

export const WithLabel: Story = {
  name: 'Form field',
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
  name: 'Custom presets',
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
