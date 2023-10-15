import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { flex } from '../layout';

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

export const Caption: Story = {
  render: (args: CheckboxProps) => (
    <Checkbox {...args} caption="Caption">
      Label
    </Checkbox>
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
      <Checkbox {...args} caption="Caption" disabled defaultChecked>
        Label
      </Checkbox>
    </div>
  ),
};

export const Value: Story = {
  render: function Render(args: CheckboxProps) {
    const [checked, setChecked] = useState(true);

    return (
      <div className={flex({ gap: 'l' })}>
        <Checkbox {...args} defaultChecked>
          Controlled
        </Checkbox>
        <Checkbox {...args} checked={checked} onChange={setChecked}>
          Uncontrolled
        </Checkbox>
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
  render: (args: CheckboxProps) => (
    <Checkbox {...args} indeterminate>
      Label
    </Checkbox>
  ),
};

export const WithoutLabel: Story = {
  render: (args: CheckboxProps) => (
    <Checkbox {...args} aria-label="Checkbox" defaultChecked />
  ),
};
