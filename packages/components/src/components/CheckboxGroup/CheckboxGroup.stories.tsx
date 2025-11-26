import type { Meta, StoryObj } from '@storybook/react';

import { CheckboxGroup } from './index';

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  tags: ['status:new'],
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => <CheckboxGroup {...args}>Label</CheckboxGroup>,
};
