import type { Meta, StoryObj } from '@storybook/react';

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

export const Description: Story = {
  render: (args: DateInputProps) => (
    <DateInput description="Description" {...args} />
  ),
};
