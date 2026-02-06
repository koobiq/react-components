import type { Meta, StoryObj } from '@storybook/react';

import type { SelectProps } from './index.js';
import { Select } from './index.js';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<SelectProps<object>>;

const Test = () => (
  <>
    <Select.Item id="bruteforce1">Bruteforce1</Select.Item>
    <Select.Item id="bruteforce2">Bruteforce2</Select.Item>
  </>
);

export const Base: Story = {
  render: (args) => (
    <Select
      label="Attack type"
      style={{ inlineSize: 200 }}
      defaultSelectedKeys={['bruteforce1']}
      placeholder="Select an option"
      selectionMode="single"
      {...args}
    >
      <Test />
    </Select>
  ),
};

export const Content: Story = {
  render: function Render() {
    const options = [
      { name: 'Bruteforce' },
      { name: 'Complex Attack' },
      { name: 'DDoS' },
      { name: 'DoS' },
      { name: 'HIPS Alert' },
      { name: 'IDS/IPS Alert' },
      { name: 'Identity Theft' },
      { name: 'Miscellaneous' },
      { name: 'Network Attack' },
      { name: 'Post Compromise' },
      { name: 'Potential Attack' },
    ];

    return (
      <Select
        items={options}
        label="Attack type"
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        caption="Dynamic collections"
        selectionMode="multiple"
      >
        {(item) => <Select.Item id={item.name}>{item.name}</Select.Item>}
      </Select>
    );
  },
};
