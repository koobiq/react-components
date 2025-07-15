import { useState } from 'react';

import { getLocalTimeZone, parseDate } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox, Typography, useDateFormatter } from '../../index';

import { DatePicker } from './DatePicker';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => <DatePicker label="Birth day" />,
};

export const Uncontrolled: Story = {
  render: function Render() {
    return (
      <DatePicker
        label="Date (uncontrolled)"
        defaultValue={parseDate('2025-02-03')}
      />
    );
  },
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState(parseDate('2025-02-03'));
    const formatter = useDateFormatter({ dateStyle: 'full' });

    return (
      <FlexBox gap="m" direction="column" alignItems="center">
        <DatePicker
          label="Date (controlled)"
          value={value}
          onChange={(newValue) => setValue(newValue!)}
        />
        <Typography>
          Selected date:{' '}
          {value ? formatter.format(value.toDate(getLocalTimeZone())) : '--'}
        </Typography>
      </FlexBox>
    );
  },
};
