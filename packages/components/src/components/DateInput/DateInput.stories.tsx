import { IconCalendarO16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

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
  render: (args: DateInputProps) => <DateInput {...args} />,
};

export const States: Story = {
  render: () => (
    <Grid gap="m" cols={{ xs: 1, s: 2, m: 3, l: 4 }}>
      <DateInput label="Date" caption="Caption" />
      <DateInput label="Date" errorMessage="Error" isInvalid />
      <DateInput label="Date" caption="Disabled" isDisabled />
      <DateInput label="Date" caption="Required" isRequired />
      <DateInput label="Date" caption="Read only" isReadOnly />
      <DateInput
        label="Date"
        caption="Caption"
        startAddon={<IconCalendarO16 />}
      />
      <DateInput
        label="Date"
        caption="Caption"
        endAddon={<IconCalendarO16 />}
      />
    </Grid>
  ),
};
