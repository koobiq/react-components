import { useState } from 'react';

import { getLocalTimeZone, today } from '@internationalized/date';
import { IconCalendarO16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Link } from '../Link';

import { TimeRange } from './TimeRange';
import type { TimeRangeProps, TimeRangeValue } from './types';

const meta = {
  title: 'Components/TimeRange',
  component: TimeRange,
  subcomponents: { 'TimeRange.Field': TimeRange.Field },
  parameters: { layout: 'centered' },
  tags: ['status:new', 'date:2026-09-04'],
} satisfies Meta<typeof TimeRange>;

export default meta;
type Story = StoryObj<TimeRangeProps>;

export const Base: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<TimeRangeValue | null>({
      type: 'last7Days',
    });

    return (
      <TimeRange
        value={value}
        onChange={setValue}
        onValueCorrected={setValue}
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
      >
        {({ formattedValue }) => (
          <Link isPseudo endIcon={<IconCalendarO16 />}>
            {formattedValue}
          </Link>
        )}
      </TimeRange>
    );
  },
};

export const CustomTrigger: Story = {
  name: 'Custom trigger',
  render: (args) => (
    <FlexBox direction="column" gap="l">
      <TimeRange {...args}>
        <Button
          variant="fade-contrast-filled"
          startIcon={<IconCalendarO16 />}
          onlyIcon
          aria-label="Choose period"
        />
      </TimeRange>
      <TimeRange {...args}>
        <Link isPseudo isDisabled={args.isDisabled}>
          Choose a reporting period
        </Link>
      </TimeRange>
      <TimeRange {...args}>
        <TimeRange.Field
          label="Period"
          caption="Applies to the whole report"
          placeholder="Select a period"
        />
      </TimeRange>
    </FlexBox>
  ),
};

export const WithLabel: Story = {
  name: 'Form field',
  render: (args) => (
    <FlexBox direction="column" gap="xl" style={{ inlineSize: 480 }}>
      <TimeRange {...args} defaultValue={null}>
        <TimeRange.Field
          fullWidth
          label="Period"
          labelPlacement="side"
          labelAlign="end"
          placeholder="Select a period"
          caption="Applies to the whole report"
        />
      </TimeRange>
      <TimeRange {...args} defaultValue={null}>
        <TimeRange.Field
          fullWidth
          label="Required period"
          isRequired
          isInvalid
          errorMessage="Select a period"
          placeholder="Select a period"
        />
      </TimeRange>
      <TimeRange {...args}>
        <TimeRange.Field
          fullWidth
          label="Reporting period"
          isLabelHidden
          caption="The label is available to assistive technology"
        />
      </TimeRange>
    </FlexBox>
  ),
};

export const NoPresets: Story = {
  name: 'No presets (manual range only)',
  render: (args) => (
    <TimeRange availableTimeRangeTypes={[]} {...args}>
      {({ formattedValue }) => <Link isPseudo>{formattedValue}</Link>}
    </TimeRange>
  ),
};

export const MinMax: Story = {
  name: 'Selection restriction',
  render: (args) => (
    <TimeRange
      availableTimeRangeTypes={['range']}
      minValue={today(getLocalTimeZone()).subtract({ months: 1 })}
      maxValue={today(getLocalTimeZone())}
      {...args}
    >
      <TimeRange.Field label="Period" placeholder="Select a period" />
    </TimeRange>
  ),
};

export const CustomRangeTypes: Story = {
  name: 'Custom presets',
  render: (args) => (
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
    >
      {({ formattedValue }) => <Link isPseudo>{formattedValue}</Link>}
    </TimeRange>
  ),
};
