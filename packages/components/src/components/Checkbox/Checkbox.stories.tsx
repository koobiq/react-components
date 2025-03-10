import { useState } from 'react';

import { clsx, useBoolean } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

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
  render: (args: CheckboxProps) => <Checkbox {...args}>Label</Checkbox>,
};

export const Size = {
  render: (args: CheckboxProps) => (
    <div className={flex({ gap: 'l', direction: 'column' })}>
      {checkboxPropSize.map((size) => (
        <Checkbox key={size} {...args} size={size} defaultChecked>
          size = {size}
        </Checkbox>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: (args: CheckboxProps) => (
    <div className={flex({ gap: 'l' })}>
      <Checkbox {...args} disabled>
        Label
      </Checkbox>
      <Checkbox {...args} disabled defaultChecked>
        Label
      </Checkbox>
    </div>
  ),
};

export const DefaultValue: Story = {
  render: function Render(args: CheckboxProps) {
    return (
      <Checkbox {...args} defaultChecked>
        Uncontrolled
      </Checkbox>
    );
  },
};

export const ControlledValue: Story = {
  render: function Render(args: CheckboxProps) {
    const [checked, { toggle }] = useBoolean(true);

    return (
      <div className={flex({ gap: 's', direction: 'column' })}>
        <Checkbox {...args} checked={checked} onChange={toggle}>
          Controlled
        </Checkbox>
        <Typography variant="tabular-compact">
          Checkbox is {checked ? 'checked' : 'unchecked'}
        </Typography>
      </div>
    );
  },
};

export const Error: Story = {
  render: (args: CheckboxProps) => (
    <Checkbox {...args} error defaultChecked>
      Label
    </Checkbox>
  ),
};

export const Indeterminate: Story = {
  render: function Render(args: CheckboxProps) {
    const [checked, setChecked] = useState([true, false]);

    const handleChange1: CheckboxProps['onChange'] = (value) => {
      setChecked([value, value]);
    };

    const handleChange2: CheckboxProps['onChange'] = (value) => {
      setChecked([value, checked[1]]);
    };

    const handleChange3: CheckboxProps['onChange'] = (value) => {
      setChecked([checked[0], value]);
    };

    const children = (
      <div
        className={clsx(
          flex({ gap: 's', direction: 'column' }),
          spacing({ mis: 'l' })
        )}
      >
        <Checkbox checked={checked[0]} onChange={handleChange2}>
          Child 1
        </Checkbox>
        <Checkbox checked={checked[1]} onChange={handleChange3}>
          Child 2
        </Checkbox>
      </div>
    );

    return (
      <div className={flex({ gap: 's', direction: 'column' })}>
        <Checkbox
          {...args}
          onChange={handleChange1}
          checked={checked[0] && checked[1]}
          indeterminate={checked[0] !== checked[1]}
        >
          Parent
        </Checkbox>
        {children}
      </div>
    );
  },
};

export const Description: Story = {
  render: (args: CheckboxProps) => (
    <Checkbox
      {...args}
      slotProps={{
        label: { className: flex({ direction: 'column', gap: '3xs' }) },
      }}
      defaultChecked
    >
      I agree to the terms and conditions
      <Typography color="contrast-secondary" variant="text-compact">
        By clicking this, you agree to our Terms and Privacy Policy.
      </Typography>
    </Checkbox>
  ),
};

export const WithoutLabel: Story = {
  render: (args: CheckboxProps) => (
    <Checkbox {...args} aria-label="Checkbox" defaultChecked />
  ),
};
