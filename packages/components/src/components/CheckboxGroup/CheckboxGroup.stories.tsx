import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '../Checkbox';

import { CheckboxGroup } from './index';

const meta = {
  title: 'Components/CheckboxGroup',
  component: CheckboxGroup,
  subcomponents: { Checkbox },
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  tags: ['status:new'],
} satisfies Meta<typeof CheckboxGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <CheckboxGroup label="What are you interested in?" {...args}>
      <Checkbox value="frontend">Frontend</Checkbox>
      <Checkbox value="backend">Backend</Checkbox>
      <Checkbox value="devops">DevOps</Checkbox>
      <Checkbox value="design">Design</Checkbox>
      <Checkbox value="product">Product</Checkbox>
    </CheckboxGroup>
  ),
};

export const Caption: Story = {
  render: (args) => (
    <CheckboxGroup
      label="What are you interested in?"
      caption="Select all options that apply."
      {...args}
    >
      <Checkbox value="frontend">Frontend</Checkbox>
      <Checkbox value="backend">Backend</Checkbox>
      <Checkbox value="devops">DevOps</Checkbox>
      <Checkbox value="design">Design</Checkbox>
      <Checkbox value="product">Product</Checkbox>
    </CheckboxGroup>
  ),
};

export const Orientation: Story = {
  render: (args) => (
    <CheckboxGroup
      label="What are you interested in?"
      orientation="horizontal"
      {...args}
    >
      <Checkbox value="frontend">Frontend</Checkbox>
      <Checkbox value="backend">Backend</Checkbox>
      <Checkbox value="devops">DevOps</Checkbox>
      <Checkbox value="design">Design</Checkbox>
      <Checkbox value="product">Product</Checkbox>
    </CheckboxGroup>
  ),
};
