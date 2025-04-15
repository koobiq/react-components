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

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { ListItem, ListSection } from '../List';
import { ListItemText } from '../List/components';
import { useBreakpoints } from '../Provider';
import { Typography } from '../Typography';

import type { SelectKey, SelectProps } from './index.js';
import { Select } from './index.js';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  subcomponents: { ListItem, ListSection, ListItemText },
  argTypes: {},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

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
  render: (args: SelectProps<object>) => (
    <Select
      label="Attack type"
      style={{ inlineSize: 200 }}
      defaultSelectedKey="bruteforce"
      placeholder="Select an option"
      {...args}
    >
      <ListItem key="bruteforce">Bruteforce</ListItem>
      <ListItem key="complex-attack">Complex Attack</ListItem>
      <ListItem key="ddos">DDoS</ListItem>
      <ListItem key="dos">DoS</ListItem>
      <ListItem key="hips-alert">HIPS Alert</ListItem>
      <ListItem key="ids-ips-alert">IDS/IPS Alert</ListItem>
      <ListItem key="identity-theft">Identity Theft</ListItem>
      <ListItem key="miscellaneous">Miscellaneous</ListItem>
      <ListItem key="network-attack">Network Attack</ListItem>
      <ListItem key="post-compromise">Post Compromise</ListItem>
      <ListItem key="potential-attack">Potential Attack</ListItem>
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
        {(item) => <ListItem key={item.name}>{item.name}</ListItem>}
      </Select>
    );
  },
};

export const Selection: Story = {
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

    const [attack, setAttack] = useState<SelectKey>('Bruteforce');

    return (
      <FlexBox direction="column" gap="s">
        <Select
          items={options}
          label="Attack type"
          selectedKey={attack}
          style={{ inlineSize: 200 }}
          placeholder="Select an option"
          onSelectionChange={(selected) => setAttack(selected)}
        >
          {(item) => <ListItem key={item.name}>{item.name}</ListItem>}
        </Select>
        <Typography>Selected: {attack}</Typography>
      </FlexBox>
    );
  },
};

export const Error: Story = {
  render: function Render() {
    return (
      <Select
        items={options}
        label="Attack type"
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        errorMessage="This field is required"
        error
      >
        {(item) => <ListItem>{item.name}</ListItem>}
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
        disabled
      >
        {(item) => <ListItem>{item.name}</ListItem>}
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
        {(item) => <ListItem>{item.name}</ListItem>}
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
          required
        >
          {(item) => <ListItem>{item.name}</ListItem>}
        </Select>
        <Select
          items={options}
          label="Attack type"
          style={{ inlineSize: 200 }}
          placeholder="Select an option"
          caption="required, without indicator"
          slotProps={{ label: { required: false } }}
          required
        >
          {(item) => <ListItem>{item.name}</ListItem>}
        </Select>
      </FlexBox>
    );
  },
};

export const FullWidth: Story = {
  render: function Render() {
    const { l } = useBreakpoints();

    return (
      <div style={{ inlineSize: l ? 320 : 260 }}>
        <Select
          items={options}
          label="Attack type"
          placeholder="Select an option"
          fullWidth
        >
          {(item) => <ListItem>{item.name}</ListItem>}
        </Select>
      </div>
    );
  },
};

export const Open: Story = {
  render: function Render() {
    const [open, { toggle, set }] = useBoolean(false);

    return (
      <FlexBox gap="m">
        <Select
          open={open}
          items={options}
          hiddenLabel
          onOpenChange={set}
          label="Attack type"
          placeholder="Select an option"
          style={{ inlineSize: 200 }}
        >
          {(item) => <ListItem>{item.name}</ListItem>}
        </Select>
        <Button onClick={toggle}>{open ? 'Close' : 'Open'}</Button>
      </FlexBox>
    );
  },
};

export const WithIcons: Story = {
  name: 'With icons',
  render: function Render() {
    const [selected, setSelected] = useState<SelectKey>('First');

    const options = [
      { id: 'First', icon: IconServer16 },
      { id: 'Second', icon: IconBug16 },
      { id: 'Third', icon: IconAnomaly16 },
      { id: 'Fourth', icon: IconDesktop16 },
      { id: 'Fifth', icon: IconSwords16 },
    ];

    return (
      <Select
        selectedKey={selected}
        items={options}
        label="Options"
        onSelectionChange={setSelected}
        placeholder="Select an option"
        style={{ inlineSize: 200 }}
      >
        {({ id, icon: Icon }) => (
          <ListItem>
            <Icon />
            <ListItemText>{id}</ListItemText>
          </ListItem>
        )}
      </Select>
    );
  },
};

export const WithItemDetails: Story = {
  name: 'With item details',
  render: function Render() {
    const [selected, setSelected] = useState<SelectKey>('First');

    const options = [
      { id: 'First', caption: 'Helper text' },
      { id: 'Second', caption: 'Helper text' },
      { id: 'Third', caption: 'Helper text' },
      { id: 'Fourth', caption: 'Helper text' },
      { id: 'Fifth', caption: 'Helper text' },
    ];

    return (
      <Select
        selectedKey={selected}
        items={options}
        label="Options"
        onSelectionChange={setSelected}
        placeholder="Select an option"
        style={{ inlineSize: 200 }}
      >
        {({ id, caption }) => (
          <ListItem>
            <ListItemText caption={caption}>{id}</ListItemText>
          </ListItem>
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
          <ListSection key={item.name} items={item.children} title={item.name}>
            {(item) => <ListItem>{item.name}</ListItem>}
          </ListSection>
        )}
      </Select>
    );
  },
};
