import { useRef, useState } from 'react';

import { getLocalTimeZone, parseTime, today } from '@internationalized/date';
import { IconChevronDownS16 } from '@koobiq/react-icons';
import { Button as UnstyledButton } from '@koobiq/react-primitives';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { FormField } from '../FormField';
import { Typography } from '../Typography';

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
          {({ formattedValue, buttonProps }) => (
            <Button
              {...buttonProps}
              variant="fade-contrast-outline"
              className={s.customTriggerButton}
            >
              {formattedValue}
            </Button>
          )}
        </TimeRange.Trigger>
      </TimeRange>
    );
  },
};

export const AsFormField: Story = {
  render: function Render(args) {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const groupRef = useRef<HTMLDivElement>(null);

    return (
      <TimeRange
        ref={triggerRef}
        placeholder="Select a period"
        slotProps={{ popover: { anchorRef: groupRef } }}
        {...args}
      >
        <TimeRange.Trigger>
          {({
            formattedValue,
            isEmpty,
            isDisabled,
            placeholder,
            buttonProps,
          }) => (
            <FormField data-disabled={isDisabled || undefined}>
              <FormField.Label>Period</FormField.Label>
              <FormField.ControlGroup
                ref={groupRef}
                isDisabled={isDisabled}
                endAddon={<IconChevronDownS16 className={s.chevron} />}
                slotProps={{ endAddon: { className: s.addon } }}
                onMouseDown={(e) => {
                  // The chevron/padding around the trigger button aren't
                  // part of it, so clicking there wouldn't open the popover
                  // — forward the click to the trigger, same as
                  // `SelectNext`'s ControlGroup.
                  if (e.currentTarget !== e.target) return;
                  e.preventDefault();
                  triggerRef.current?.click();
                }}
              >
                <UnstyledButton {...buttonProps} className={s.selectValue}>
                  {isEmpty ? placeholder : formattedValue}
                </UnstyledButton>
              </FormField.ControlGroup>
            </FormField>
          )}
        </TimeRange.Trigger>
      </TimeRange>
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

export const ValueCorrected: Story = {
  render: function Render(args) {
    const [message, setMessage] = useState<string | null>();

    return (
      <>
        <TimeRange
          defaultValue={{ type: 'last30Days' }}
          availableTimeRangeTypes={['lastHour', 'last24Hours', 'range']}
          onValueCorrected={(value) =>
            setMessage(`Initial value: last30Days. Corrected to: ${value.type}`)
          }
          {...args}
        />
        {message && <Typography style={{ marginTop: 8 }}>{message}</Typography>}
      </>
    );
  },
};
