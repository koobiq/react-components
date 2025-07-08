import { useState } from 'react';

import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import { IconCalendarO16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Grid } from '../Grid';

import { DateInput, type DateInputProps } from './index.js';

const meta = {
  title: 'Components/DateInput',
  component: DateInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: DateInputProps) => <DateInput data-testid="kamil" {...args} />,
};

export const States: Story = {
  render: () => (
    <Grid gap="m" cols={{ xs: 1, s: 2, m: 3, l: 4 }}>
      <DateInput label="Date" caption="Default" />
      <DateInput label="Date" errorMessage="Error" isInvalid />
      <DateInput
        label="Date"
        caption="isDisabled"
        defaultValue={today(getLocalTimeZone())}
        isDisabled
      />
      <DateInput label="Date" caption="isRequired" isRequired />
      <DateInput
        label="Date"
        caption="isReadOnly"
        defaultValue={today(getLocalTimeZone())}
        isReadOnly
      />
      <DateInput
        label="Date"
        caption="startAddon"
        startAddon={<IconCalendarO16 />}
      />
      <DateInput
        label="Date"
        caption="endAddon"
        endAddon={<IconCalendarO16 />}
      />
      <DateInput
        label="Date"
        caption="isInvalid + endAddon"
        endAddon={<IconCalendarO16 />}
        isInvalid
      />
    </Grid>
  ),
};

export const Value: Story = {
  render: function Render() {
    const [value, setValue] = useState<ReturnType<typeof parseDate> | null>(
      parseDate('2025-02-03')
    );

    return (
      <FlexBox gap="m" direction="column">
        <DateInput
          label="Date (uncontrolled)"
          defaultValue={parseDate('2025-02-03')}
        />
        <DateInput
          label="Date (controlled)"
          value={value}
          onChange={setValue}
        />
      </FlexBox>
    );
  },
};
