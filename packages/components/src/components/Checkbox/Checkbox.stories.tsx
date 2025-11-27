import { useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { flex, spacing } from '../layout';
import { Typography } from '../Typography';

import { Checkbox } from './index';
import { type CheckboxProps, checkboxPropSize } from './index';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => <Checkbox {...args}>Label</Checkbox>,
};

export const Size: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="column">
      {checkboxPropSize.map((size) => (
        <Checkbox key={size} {...args} size={size} defaultSelected>
          size = {size}
        </Checkbox>
      ))}
    </FlexBox>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <FlexBox gap="l">
      <Checkbox {...args} isDisabled>
        Label
      </Checkbox>
      <Checkbox {...args} isDisabled defaultSelected>
        Label
      </Checkbox>
    </FlexBox>
  ),
};

export const DefaultValue: Story = {
  render: function Render(args) {
    return (
      <Checkbox {...args} defaultSelected>
        Uncontrolled
      </Checkbox>
    );
  },
};

export const ControlledValue: Story = {
  render: function Render(args) {
    const [isSelected, { toggle }] = useBoolean(true);

    return (
      <FlexBox gap="s" direction="column">
        <Checkbox {...args} isSelected={isSelected} onChange={toggle}>
          Controlled
        </Checkbox>
        <Typography variant="tabular-compact">
          Checkbox is {isSelected ? 'checked' : 'unchecked'}
        </Typography>
      </FlexBox>
    );
  },
};

export const Invalid: Story = {
  render: (args) => (
    <Checkbox {...args} isInvalid defaultSelected>
      Label
    </Checkbox>
  ),
};

export const ReadOnly: Story = {
  render: (args) => (
    <Checkbox {...args} isReadOnly defaultSelected>
      Label
    </Checkbox>
  ),
};

export const Indeterminate: Story = {
  render: function Render(args) {
    const [selectedGroup, setSelectedGroup] = useState([true, false]);

    const handleChange1: CheckboxProps['onChange'] = (value) => {
      setSelectedGroup([value, value]);
    };

    const handleChange2: CheckboxProps['onChange'] = (value) => {
      setSelectedGroup([value, selectedGroup[1]]);
    };

    const handleChange3: CheckboxProps['onChange'] = (value) => {
      setSelectedGroup([selectedGroup[0], value]);
    };

    const children = (
      <FlexBox gap="s" direction="column" className={spacing({ mis: 'l' })}>
        <Checkbox isSelected={selectedGroup[0]} onChange={handleChange2}>
          Child 1
        </Checkbox>
        <Checkbox isSelected={selectedGroup[1]} onChange={handleChange3}>
          Child 2
        </Checkbox>
      </FlexBox>
    );

    return (
      <FlexBox gap="s" direction="column">
        <Checkbox
          {...args}
          onChange={handleChange1}
          isSelected={selectedGroup[0] && selectedGroup[1]}
          isIndeterminate={selectedGroup[0] !== selectedGroup[1]}
        >
          Parent
        </Checkbox>
        {children}
      </FlexBox>
    );
  },
};

export const Description: Story = {
  render: (args) => (
    <Checkbox
      {...args}
      slotProps={{
        label: { className: flex({ direction: 'column', gap: '3xs' }) },
      }}
      defaultSelected
    >
      I agree to the terms and conditions
      <Typography color="contrast-secondary" variant="text-compact">
        By clicking this, you agree to our Terms and Privacy Policy.
      </Typography>
    </Checkbox>
  ),
};

export const WithoutLabel: Story = {
  render: (args) => (
    <Checkbox {...args} aria-label="Checkbox" defaultSelected />
  ),
};

export const HtmlForms: Story = {
  render: (args) => (
    <Checkbox
      {...args}
      aria-label="Newsletter"
      name="newsletter"
      value="subscribe"
    >
      Subscribe
    </Checkbox>
  ),
};
