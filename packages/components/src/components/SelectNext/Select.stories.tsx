import { useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconAnomaly16,
  IconBug16,
  IconDesktop16,
  IconServer16,
  IconSwords16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import type { Selection } from '../../types';
import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import type { SelectProps } from './index.js';
import { Select } from './index.js';

const meta = {
  title: 'Components/SelectNext',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  subcomponents: {
    'Select.Item': Select.Item,
    'Select.Section': Select.Section,
    'Select.ItemText': Select.ItemText,
  },
  argTypes: {},
  tags: ['status:new'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<SelectProps<object>>;

const options = [
  { id: 1, name: 'Bruteforce' },
  { id: 2, name: 'Complex Attack' },
  { id: 3, name: 'DDoS' },
  { id: 4, name: 'DoS' },
  { id: 5, name: 'HIPS Alert' },
  { id: 6, name: 'IDS/IPS Alert' },
  { id: 7, name: 'Identity Theft' },
  { id: 8, name: 'Miscellaneous' },
  { id: 9, name: 'Network Attack' },
  { id: 10, name: 'Post Compromise' },
  { id: 11, name: 'Potential Attack' },
];

export const Base: Story = {
  render: (args) => (
    <Select
      label="Attack type"
      style={{ inlineSize: 400 }}
      placeholder="Select an option"
      selectionMode="multiple"
      isClearable
      {...args}
    >
      <Select.Item key="bruteforce">Bruteforce</Select.Item>
      <Select.Item key="complex-attack">Complex Attack</Select.Item>
      <Select.Item key="ddos">DDoS</Select.Item>
      <Select.Item key="dos">DoS</Select.Item>
      <Select.Item key="hips-alert">HIPS Alert</Select.Item>
      <Select.Item key="ids-ips-alert">IDS/IPS Alert</Select.Item>
      <Select.Item key="identity-theft">Identity Theft</Select.Item>
      <Select.Item key="miscellaneous">Miscellaneous</Select.Item>
      <Select.Item key="network-attack">Network Attack</Select.Item>
      <Select.Item key="post-compromise">Post Compromise</Select.Item>
      <Select.Item key="potential-attack">Potential Attack</Select.Item>
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
      >
        {(item) => <Select.Item key={item.name}>{item.name}</Select.Item>}
      </Select>
    );
  },
};

export const SingleSelection: Story = {
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

    const [attack, setAttack] = useState<Selection>(new Set(['Bruteforce']));

    return (
      <FlexBox direction="column" gap="s">
        <Select
          items={options}
          label="Attack type"
          selectedKeys={attack}
          style={{ inlineSize: 200 }}
          placeholder="Select an option"
          onSelectionChange={(selected) => setAttack(selected!)}
        >
          {(item) => <Select.Item key={item.name}>{item.name}</Select.Item>}
        </Select>
        <Typography>Selected: {attack}</Typography>
      </FlexBox>
    );
  },
};

export const MultipleSelection: Story = {
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

    const [attack, setAttack] = useState<Selection>(new Set(['Bruteforce']));

    return (
      <FlexBox direction="column" gap="s" style={{ inlineSize: 200 }}>
        <Select
          items={options}
          label="Attack type"
          selectionMode="multiple"
          selectedKeys={attack}
          style={{ inlineSize: 'inherit' }}
          placeholder="Select an option"
          onSelectionChange={(selected) => setAttack(selected!)}
        >
          {(item) => <Select.Item key={item.name}>{item.name}</Select.Item>}
        </Select>
        <Typography>Selected: {Array.from(attack).join(', ')}</Typography>
      </FlexBox>
    );
  },
};

export const Invalid: Story = {
  render: function Render() {
    return (
      <Select
        items={options}
        label="Attack type"
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        errorMessage="This field is required"
        isInvalid
      >
        {(item) => <Select.Item>{item.name}</Select.Item>}
      </Select>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return (
      <Select
        items={options}
        caption="disabled"
        label="Attack type"
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        isDisabled
      >
        {(item) => <Select.Item>{item.name}</Select.Item>}
      </Select>
    );
  },
};

export const DisabledOptions: Story = {
  render: function Render() {
    return (
      <Select
        items={options}
        caption="disabled"
        label="Attack type"
        disabledKeys={[4, 5]}
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
      >
        {(item) => <Select.Item>{item.name}</Select.Item>}
      </Select>
    );
  },
};

export const Required: Story = {
  render: function Render() {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        <Select
          items={options}
          caption="required"
          label="Attack type"
          style={{ inlineSize: 200 }}
          placeholder="Select an option"
          isRequired
        >
          {(item) => <Select.Item>{item.name}</Select.Item>}
        </Select>
        <Select
          items={options}
          label="Attack type"
          style={{ inlineSize: 200 }}
          placeholder="Select an option"
          caption="required, without an indicator"
          slotProps={{ label: { isRequired: false } }}
          isRequired
        >
          {(item) => <Select.Item>{item.name}</Select.Item>}
        </Select>
      </FlexBox>
    );
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    return (
      <Select
        items={options}
        label="Attack type"
        placeholder="Select an option"
        fullWidth
      >
        {(item) => <Select.Item>{item.name}</Select.Item>}
      </Select>
    );
  },
};

export const Open: Story = {
  render: function Render() {
    const [isOpen, { toggle, set }] = useBoolean(false);

    return (
      <FlexBox gap="m">
        <Select
          isOpen={isOpen}
          items={options}
          onOpenChange={set}
          label="Attack type"
          placeholder="Select an option"
          style={{ inlineSize: 200 }}
          isLabelHidden
        >
          {(item) => <Select.Item>{item.name}</Select.Item>}
        </Select>
        <Button onPress={toggle}>{isOpen ? 'Close' : 'Open'}</Button>
      </FlexBox>
    );
  },
};

export const WithIcons: Story = {
  name: 'With icons',
  render: function Render() {
    const [selected, setSelected] = useState<Selection>(new Set(['First']));

    const options = [
      { id: 'First', icon: IconServer16 },
      { id: 'Second', icon: IconBug16 },
      { id: 'Third', icon: IconAnomaly16 },
      { id: 'Fourth', icon: IconDesktop16 },
      { id: 'Fifth', icon: IconSwords16 },
    ];

    return (
      <Select
        selectedKeys={selected}
        items={options}
        label="Options"
        onSelectionChange={(key) => setSelected(key!)}
        placeholder="Select an option"
        style={{ inlineSize: 200 }}
      >
        {({ id, icon: Icon }) => (
          <Select.Item textValue={id}>
            <Icon />
            <Select.ItemText>{id}</Select.ItemText>
          </Select.Item>
        )}
      </Select>
    );
  },
};

export const WithItemDetails: Story = {
  name: 'With item details',
  render: function Render() {
    const [selected, setSelected] = useState<Selection>(new Set(['First']));

    const options = [
      { id: 'First', caption: 'Helper text' },
      { id: 'Second', caption: 'Helper text' },
      { id: 'Third', caption: 'Helper text' },
      { id: 'Fourth', caption: 'Helper text' },
      { id: 'Fifth', caption: 'Helper text' },
    ];

    return (
      <Select
        selectedKeys={selected}
        items={options}
        label="Options"
        onSelectionChange={(key) => setSelected(key!)}
        placeholder="Select an option"
        style={{ inlineSize: 200 }}
      >
        {({ id, caption }) => (
          <Select.Item textValue={id}>
            <Select.ItemText caption={caption}>{id}</Select.ItemText>
          </Select.Item>
        )}
      </Select>
    );
  },
};

export const Section: Story = {
  render: function Render() {
    const options = [
      {
        name: 'Group 1',
        children: [
          { id: 2, name: 'Item 1' },
          { id: 3, name: 'Item 2' },
          { id: 4, name: 'Item 3' },
        ],
      },
      {
        name: 'Group 2',
        children: [
          { id: 6, name: 'Item 4' },
          { id: 7, name: 'Item 5' },
          { id: 8, name: 'Item 6' },
        ],
      },
    ];

    return (
      <Select
        items={options}
        label="Options"
        placeholder="Select an option"
        style={{ inlineSize: 200 }}
      >
        {(item) => (
          <Select.Section
            key={item.name}
            items={item.children}
            title={item.name}
          >
            {(item) => <Select.Item>{item.name}</Select.Item>}
          </Select.Section>
        )}
      </Select>
    );
  },
};
