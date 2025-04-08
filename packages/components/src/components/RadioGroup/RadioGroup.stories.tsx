import { useState } from 'react';

import type { StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import {
  RadioGroup,
  Radio,
  radioGroupPropSize,
  type RadioGroupBaseProps,
} from './index';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  subcomponents: { Radio },
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: RadioGroupBaseProps) => (
    <RadioGroup label="Which OS do you use?" defaultValue="windows" {...args}>
      <Radio value="windows">Windows</Radio>
      <Radio value="macos">macOS</Radio>
      <Radio value="linux">Linux</Radio>
      <Radio value="other">Other</Radio>
    </RadioGroup>
  ),
};

export const Size = {
  render: (args: RadioGroupBaseProps) => (
    <FlexBox gap="3xl">
      {radioGroupPropSize.map((size) => (
        <RadioGroup
          key={size}
          size={size}
          defaultValue="one"
          label={`size = ${size}`}
          {...args}
        >
          <Radio value="one">One</Radio>
          <Radio value="two">Two</Radio>
          <Radio value="three">Three</Radio>
        </RadioGroup>
      ))}
    </FlexBox>
  ),
};

export const Disabled: Story = {
  render: (args: RadioGroupBaseProps) => (
    <FlexBox gap="3xl">
      <RadioGroup label="Disabled group" defaultValue="one" disabled {...args}>
        <Radio value="one">One</Radio>
        <Radio value="two">Two</Radio>
        <Radio value="three">Three</Radio>
      </RadioGroup>

      <RadioGroup label="Disabled third radio" defaultValue="one" {...args}>
        <Radio value="one">One</Radio>
        <Radio value="two">Two</Radio>
        <Radio value="three" disabled>
          Three
        </Radio>
      </RadioGroup>
    </FlexBox>
  ),
};

export const Error: Story = {
  render: (args: RadioGroupBaseProps) => (
    <RadioGroup label="Label" defaultValue="one" error {...args}>
      <Radio value="one">One</Radio>
      <Radio value="two">Two</Radio>
      <Radio value="three">Three</Radio>
    </RadioGroup>
  ),
};

export const DefaultValue: Story = {
  render: function Render(args: RadioGroupBaseProps) {
    return (
      <RadioGroup label="Uncontrolled" defaultValue="one" {...args}>
        <Radio value="one">One</Radio>
        <Radio value="two">Two</Radio>
        <Radio value="three">Three</Radio>
      </RadioGroup>
    );
  },
};

export const ControlledValue: Story = {
  render: function Render(args: RadioGroupBaseProps) {
    const [value, setValue] = useState('one');

    return (
      <FlexBox gap="m" direction="column">
        <RadioGroup
          label="Сontrolled"
          onChange={setValue}
          value={value}
          {...args}
        >
          <Radio value="one">One</Radio>
          <Radio value="two">Two</Radio>
          <Radio value="three">Three</Radio>
        </RadioGroup>
        <Typography>You have selected: {value}</Typography>
      </FlexBox>
    );
  },
};

export const Description: Story = {
  render: (args: RadioGroupBaseProps) => (
    <RadioGroup
      label="Favorite fruit:"
      description="Please select a fruit."
      {...args}
    >
      <Radio value="banana">Banana</Radio>
      <Radio value="apple">Apple</Radio>
      <Radio value="peach">Peach</Radio>
    </RadioGroup>
  ),
};

export const Orientation: Story = {
  render: (args: RadioGroupBaseProps) => (
    <RadioGroup label="Favorite fruit:" orientation="horizontal" {...args}>
      <Radio value="banana">Banana</Radio>
      <Radio value="apple">Apple</Radio>
      <Radio value="peach">Peach</Radio>
    </RadioGroup>
  ),
};
