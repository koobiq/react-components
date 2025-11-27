import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox, checkboxPropSize } from '../Checkbox';
import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

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
    <CheckboxGroup
      label="What are you interested in?"
      defaultValue={['frontend']}
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

export const Size: Story = {
  render: (args) => (
    <FlexBox gap="3xl">
      {checkboxPropSize.map((size) => (
        <CheckboxGroup
          key={size}
          size={size}
          defaultValue={['one']}
          label={`size = ${size}`}
          {...args}
        >
          <Checkbox value="frontend">Frontend</Checkbox>
          <Checkbox value="backend">Backend</Checkbox>
          <Checkbox value="devops">DevOps</Checkbox>
          <Checkbox value="design">Design</Checkbox>
          <Checkbox value="product">Product</Checkbox>
        </CheckboxGroup>
      ))}
    </FlexBox>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <CheckboxGroup
      label="Label"
      defaultValue={['one']}
      errorMessage="This field is required"
      isInvalid
      {...args}
    >
      <Checkbox value="one">One</Checkbox>
      <Checkbox value="two">Two</Checkbox>
      <Checkbox value="three">Three</Checkbox>
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
      orientation="horizontal"
      label="What are you interested in?"
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

export const Disabled: Story = {
  render: (args) => (
    <FlexBox gap="3xl">
      <CheckboxGroup
        label="Disabled group"
        defaultValue={['one']}
        isDisabled
        {...args}
      >
        <Checkbox value="one">One</Checkbox>
        <Checkbox value="two">Two</Checkbox>
        <Checkbox value="three">Three</Checkbox>
      </CheckboxGroup>
      <CheckboxGroup
        label="Disabled third checkbox"
        defaultValue={['one']}
        {...args}
      >
        <Checkbox value="one">One</Checkbox>
        <Checkbox value="two">Two</Checkbox>
        <Checkbox value="three" isDisabled>
          Three
        </Checkbox>
      </CheckboxGroup>
    </FlexBox>
  ),
};

export const LabelPlacementAlignment: Story = {
  name: 'Label placement and alignment',
  render: (args) => (
    <CheckboxGroup
      labelAlign="end"
      labelPlacement="side"
      orientation="horizontal"
      defaultValue={['frontend']}
      label="What are you interested in?"
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

export const DefaultValue: Story = {
  render: function Render(args) {
    return (
      <CheckboxGroup label="Uncontrolled" defaultValue={['one']} {...args}>
        <Checkbox value="one">One</Checkbox>
        <Checkbox value="two">Two</Checkbox>
        <Checkbox value="three">Three</Checkbox>
      </CheckboxGroup>
    );
  },
};

export const ControlledValue: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(['one']);

    return (
      <FlexBox gap="m" direction="column">
        <CheckboxGroup
          value={value}
          label="Сontrolled"
          onChange={setValue}
          {...args}
        >
          <Checkbox value="one">One</Checkbox>
          <Checkbox value="two">Two</Checkbox>
          <Checkbox value="three">Three</Checkbox>
        </CheckboxGroup>
        <Typography>You have selected: {value.join(', ')}</Typography>
      </FlexBox>
    );
  },
};
