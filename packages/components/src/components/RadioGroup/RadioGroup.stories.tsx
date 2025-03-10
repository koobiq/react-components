import { useState } from 'react';

import type { StoryObj } from '@storybook/react';

import { flex } from '../layout';
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
    <div className={flex({ gap: '3xl' })}>
      {radioGroupPropSize.map((size) => (
        <RadioGroup
          key={size}
          size={size}
          label={`size = ${size}`}
          defaultValue="one"
          {...args}
        >
          <Radio value="one">One</Radio>
          <Radio value="two">Two</Radio>
          <Radio value="three">Three</Radio>
        </RadioGroup>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: (args: RadioGroupBaseProps) => (
    <div className={flex({ gap: '3xl' })}>
      <RadioGroup label="Disabled group" disabled defaultValue="one" {...args}>
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
    </div>
  ),
};

export const Error: Story = {
  render: (args: RadioGroupBaseProps) => (
    <RadioGroup label="Label" error defaultValue="one" {...args}>
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
      <div className={flex({ gap: 'm', direction: 'column' })}>
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
      </div>
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
