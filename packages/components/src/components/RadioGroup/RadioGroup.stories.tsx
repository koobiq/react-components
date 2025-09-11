import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import { RadioGroup, Radio, radioGroupPropSize } from './index';

const meta = {
  title: 'Components/RadioGroup',
  component: RadioGroup,
  subcomponents: { Radio },
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  tags: ['status:updated'],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <RadioGroup label="Which OS do you use?" defaultValue="windows" {...args}>
      <Radio value="windows">Windows</Radio>
      <Radio value="macos">macOS</Radio>
      <Radio value="linux">Linux</Radio>
      <Radio value="other">Other</Radio>
    </RadioGroup>
  ),
};

export const Size: Story = {
  render: (args) => (
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
  render: (args) => (
    <FlexBox gap="3xl">
      <RadioGroup
        label="Disabled group"
        defaultValue="one"
        isDisabled
        {...args}
      >
        <Radio value="one">One</Radio>
        <Radio value="two">Two</Radio>
        <Radio value="three">Three</Radio>
      </RadioGroup>

      <RadioGroup label="Disabled third radio" defaultValue="one" {...args}>
        <Radio value="one">One</Radio>
        <Radio value="two">Two</Radio>
        <Radio value="three" isDisabled>
          Three
        </Radio>
      </RadioGroup>
    </FlexBox>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <RadioGroup
      label="Label"
      defaultValue="one"
      errorMessage="This field is required"
      isInvalid
      {...args}
    >
      <Radio value="one">One</Radio>
      <Radio value="two">Two</Radio>
      <Radio value="three">Three</Radio>
    </RadioGroup>
  ),
};

export const LabelPlacementAlignment: Story = {
  name: 'Label placement and alignment',
  render: (args) => (
    <RadioGroup
      label="Which OS do you use?"
      defaultValue="windows"
      labelPlacement="side"
      orientation="horizontal"
      labelAlign="end"
      {...args}
    >
      <Radio value="windows">Windows</Radio>
      <Radio value="macos">macOS</Radio>
      <Radio value="linux">Linux</Radio>
      <Radio value="other">Other</Radio>
    </RadioGroup>
  ),
};

export const DefaultValue: Story = {
  render: function Render(args) {
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
  render: function Render(args) {
    const [value, setValue] = useState('one');

    return (
      <FlexBox gap="m" direction="column">
        <RadioGroup
          value={value}
          label="Сontrolled"
          onChange={setValue}
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

export const Caption: Story = {
  render: (args) => (
    <RadioGroup
      label="Favorite fruit:"
      caption="Please select a fruit."
      {...args}
    >
      <Radio value="banana">Banana</Radio>
      <Radio value="apple">Apple</Radio>
      <Radio value="peach">Peach</Radio>
    </RadioGroup>
  ),
};

export const Orientation: Story = {
  render: (args) => (
    <RadioGroup label="Favorite fruit:" orientation="horizontal" {...args}>
      <Radio value="banana">Banana</Radio>
      <Radio value="apple">Apple</Radio>
      <Radio value="peach">Peach</Radio>
    </RadioGroup>
  ),
};

export const Validation: Story = {
  render: (args) => (
    <FlexBox as="form" direction="column" gap="m">
      <RadioGroup
        label="Numbers"
        name="numbers"
        isRequired
        validationBehavior="native"
        {...args}
      >
        <Radio value="one">One</Radio>
        <Radio value="two">Two</Radio>
        <Radio value="three">Three</Radio>
      </RadioGroup>
      <Button type="submit">Submit</Button>
    </FlexBox>
  ),
};
