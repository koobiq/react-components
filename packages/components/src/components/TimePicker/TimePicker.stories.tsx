import { Time } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';

import { Grid } from '../Grid';

import { TimePicker } from './index.js';

const meta = {
  title: 'Components/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  tags: ['status:new'],
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => <TimePicker label="Time" {...args} />,
};

export const States: Story = {
  render: () => (
    <Grid gap="m" cols={{ xs: 1, s: 2, m: 2, l: 2 }}>
      <TimePicker
        label="Time"
        errorMessage="isInvalid"
        defaultValue={new Time(11, 45)}
        isInvalid
      />
      <TimePicker
        label="Time"
        caption="isDisabled"
        defaultValue={new Time(11, 45)}
        isDisabled
      />
      <TimePicker
        label="Time"
        caption="isRequired"
        defaultValue={new Time(11, 45)}
        isRequired
      />
      <TimePicker
        label="Time"
        caption="isReadOnly"
        defaultValue={new Time(11, 45)}
        isReadOnly
      />
    </Grid>
  ),
};
