import { useState, useCallback } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconBug16,
  IconServer16,
  IconSwords16,
  IconAnomaly16,
  IconDesktop16,
  IconCrosshairs16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import type { SelectNextProps as SelectProps } from './index.js';
import { SelectNext as Select } from './index.js';

const meta = {
  title: 'Components/SelectNext',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  subcomponents: {
    'Select.Item': Select.Item,
    'Select.Section': Select.Section,
    'Select.Divider': Select.Divider,
    'Select.ItemText': Select.ItemText,
  },
  argTypes: {},
  tags: ['status:new', 'date:2026-02-13'],
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
      style={{ inlineSize: 200 }}
      placeholder="Select an option"
      {...args}
    >
      <Select.Item id="bruteforce">Bruteforce</Select.Item>
      <Select.Item id="complex-attack">Complex Attack</Select.Item>
      <Select.Item id="ddos">DDoS</Select.Item>
      <Select.Item id="dos">DoS</Select.Item>
      <Select.Item id="hips-alert">HIPS Alert</Select.Item>
      <Select.Item id="ids-ips-alert">IDS/IPS Alert</Select.Item>
      <Select.Item id="identity-theft">Identity Theft</Select.Item>
      <Select.Item id="miscellaneous">Miscellaneous</Select.Item>
      <Select.Item id="network-attack">Network Attack</Select.Item>
      <Select.Item id="post-compromise">Post Compromise</Select.Item>
      <Select.Item id="potential-attack">Potential Attack</Select.Item>
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
        {(item) => <Select.Item id={item.name}>{item.name}</Select.Item>}
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

    const [attack, setAttack] = useState<string | number | null>('Bruteforce');

    return (
      <FlexBox direction="column" gap="s">
        <Select
          value={attack}
          items={options}
          label="Attack type"
          onChange={setAttack}
          style={{ inlineSize: 200 }}
          placeholder="Select an option"
        >
          {(item) => <Select.Item id={item.name}>{item.name}</Select.Item>}
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

    const [attack, setAttack] = useState<(string | number)[]>(['Bruteforce']);

    return (
      <FlexBox direction="column" gap="s" style={{ inlineSize: 200 }}>
        <Select
          value={attack}
          items={options}
          label="Attack type"
          onChange={setAttack}
          selectionMode="multiple"
          placeholder="Select an option"
          style={{ inlineSize: 'inherit' }}
        >
          {(item) => <Select.Item id={item.name}>{item.name}</Select.Item>}
        </Select>
        <Typography>Selected: {attack?.join(', ')}</Typography>
      </FlexBox>
    );
  },
};

export const SelectedTagsOverflow: Story = {
  render: function Render() {
    return (
      <FlexBox gap="m" direction="column">
        <Select
          items={options}
          label="Attack type"
          selectionMode="multiple"
          style={{ inlineSize: 220 }}
          placeholder="Select an option"
          caption="selectedTagsOverflow = responsive (default)"
        >
          {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
        </Select>
        <Select
          items={options}
          label="Attack type"
          selectionMode="multiple"
          style={{ inlineSize: 220 }}
          placeholder="Select an option"
          selectedTagsOverflow="multiline"
          caption="selectedTagsOverflow = multiline"
        >
          {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
        </Select>
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
        {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
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
        selectionMode="multiple"
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        isDisabled
      >
        {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
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
        {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
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
          {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
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
          {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
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
        {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
      </Select>
    );
  },
};

export const LabelPlacementAlignment: Story = {
  name: 'Label placement and alignment',
  render: () => (
    <Select
      items={options}
      labelAlign="end"
      labelPlacement="side"
      label={`Attack\u00A0type`}
      placeholder="Select an option"
    >
      {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
    </Select>
  ),
};

export const ClearButton: Story = {
  render: function Render() {
    return (
      <Select
        items={options}
        defaultValue={1}
        label="Attack type"
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        isClearable
      >
        {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
      </Select>
    );
  },
};

export const Addons: Story = {
  render: function Render() {
    return (
      <Select
        items={options}
        defaultValue={1}
        label="Attack type"
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        startAddon={<IconCrosshairs16 />}
      >
        {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
      </Select>
    );
  },
};

export const Searchable: Story = {
  render: function Render() {
    return (
      <Select
        items={options}
        defaultValue={1}
        label="Attack type"
        onInputChange={console.log}
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        isSearchable
      >
        {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
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
          {(item) => <Select.Item id={item.name}>{item.name}</Select.Item>}
        </Select>
        <Button onPress={toggle}>{isOpen ? 'Close' : 'Open'}</Button>
      </FlexBox>
    );
  },
};

export const NoItems: Story = {
  render: function Render() {
    return (
      <FlexBox gap="m" direction="column">
        <Select<{ name: string }>
          items={[]}
          aria-label="No items"
          placeholder="Select an option"
          caption="No options available"
          style={{ inlineSize: 200 }}
          allowsEmptyCollection
        >
          {(item) => <Select.Item id={item.name}>{item.name}</Select.Item>}
        </Select>
        <Select<{ name: string }>
          items={[]}
          aria-label="No items"
          placeholder="Select an option"
          noItemsText="No results found"
          caption="No results found"
          style={{ inlineSize: 200 }}
          allowsEmptyCollection
        >
          {(item) => <Select.Item id={item.name}>{item.name}</Select.Item>}
        </Select>
      </FlexBox>
    );
  },
};

export const WithIcons: Story = {
  name: 'With icons',
  render: function Render() {
    const options = [
      { id: 'First', icon: IconServer16 },
      { id: 'Second', icon: IconBug16 },
      { id: 'Third', icon: IconAnomaly16 },
      { id: 'Fourth', icon: IconDesktop16 },
      { id: 'Fifth', icon: IconSwords16 },
    ];

    const [selected, setSelected] = useState<string | number | null>('First');

    return (
      <Select
        value={selected}
        items={options}
        label="Options"
        onChange={setSelected}
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
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
    const [selected, setSelected] = useState<string | number | null>('First');

    const options = [
      { id: 'First', caption: 'Helper text' },
      { id: 'Second', caption: 'Helper text' },
      { id: 'Third', caption: 'Helper text' },
      { id: 'Fourth', caption: 'Helper text' },
      { id: 'Fifth', caption: 'Helper text' },
    ];

    return (
      <Select
        value={selected}
        items={options}
        label="Options"
        onChange={setSelected}
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
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
      >
        {(section) => (
          <Select.Section
            id={section.name}
            title={section.name}
            items={section.children}
          >
            {(item) => <Select.Item id={item.id}>{item.name}</Select.Item>}
          </Select.Section>
        )}
      </Select>
    );
  },
};

export const AsynchronousLoading: Story = {
  render: function Render() {
    type Product = {
      id: number;
      title: string;
      thumbnail: string;
    };

    const ITEMS_PER_PAGE = 5;

    const [products, setProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);

    const fetchProducts = useCallback(async () => {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${ITEMS_PER_PAGE}&skip=${page * ITEMS_PER_PAGE}`
      );

      const data = await response.json();

      if (data.products.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setPage((prevPage) => prevPage + 1);
      }
    }, [page]);

    return (
      <Select
        label="Products"
        items={products}
        isLoading={hasMore}
        onLoadMore={fetchProducts}
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        allowsEmptyCollection
      >
        {(item) => (
          <Select.Item key={item.id} textValue={item.title}>
            <Select.ItemText>{item.title}</Select.ItemText>
          </Select.Item>
        )}
      </Select>
    );
  },
};
