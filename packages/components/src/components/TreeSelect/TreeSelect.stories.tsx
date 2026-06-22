import { useState } from 'react';

import { type Key, useBoolean } from '@koobiq/react-core';
import { IconCrosshairs16 } from '@koobiq/react-icons';
import { Collection } from '@koobiq/react-primitives';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Tree } from '../Tree';
import { Typography } from '../Typography';

import { TreeSelect } from './index';

const meta = {
  title: 'Components/TreeSelect',
  component: TreeSelect,
  parameters: {
    layout: 'centered',
  },
  subcomponents: {
    'TreeSelect.Item': TreeSelect.Item,
    'TreeSelect.ItemContent': TreeSelect.ItemContent,
  },
  argTypes: {},
  tags: ['status:new', 'date:2026-06-15'],
} satisfies Meta<typeof TreeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    id: 1,
    title: 'app',
    type: 'directory',
    test: [
      {
        id: 2,
        title: 'Http',
        type: 'directory',
        test: [{ id: 3, title: 'index.html', type: 'file', test: [] }],
      },
      {
        id: 4,
        title: 'Providers',
        type: 'directory',
        test: [
          {
            id: 5,
            title: 'EventServiceProvider.js',
            type: 'file',
            test: [],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'config',
    type: 'directory',
    test: [
      { id: 7, title: 'app.js', type: 'file', test: [] },
      { id: 8, title: 'database.js', type: 'file', test: [] },
    ],
  },
  {
    id: 9,
    title: 'public',
    type: 'directory',
    test: [{ id: 10, title: 'logo.svg', type: 'file', test: [] }],
  },
  { id: 11, title: '.env', type: 'file', test: [] },
  { id: 12, title: '.gitignore', type: 'file', test: [] },
  { id: 13, title: 'README.md', type: 'file', test: [] },
];

export const Base: Story = {
  render: function Render() {
    return (
      <TreeSelect
        defaultValue={[9]}
        caption="My caption"
        label="Project files"
        placeholder="My placeholder"
        selectionMode="multiple"
        style={{ inlineSize: 320 }}
        isClearable
      >
        <TreeSelect.Item id={1} textValue="app">
          <TreeSelect.ItemContent>app</TreeSelect.ItemContent>
          <TreeSelect.Item id={2} textValue="Http">
            <TreeSelect.ItemContent>Http</TreeSelect.ItemContent>
            <TreeSelect.Item id={3} textValue="index.html">
              <TreeSelect.ItemContent>index.html</TreeSelect.ItemContent>
            </TreeSelect.Item>
          </TreeSelect.Item>
          <TreeSelect.Item id={4} textValue="Providers">
            <TreeSelect.ItemContent>Providers</TreeSelect.ItemContent>
            <TreeSelect.Item id={5} textValue="EventServiceProvider.js">
              <TreeSelect.ItemContent>
                EventServiceProvider.js
              </TreeSelect.ItemContent>
            </TreeSelect.Item>
          </TreeSelect.Item>
        </TreeSelect.Item>
        <TreeSelect.Item id={6} textValue="config">
          <TreeSelect.ItemContent>config</TreeSelect.ItemContent>
          <TreeSelect.Item id={7} textValue="app.js">
            <TreeSelect.ItemContent>app.js</TreeSelect.ItemContent>
          </TreeSelect.Item>
          <TreeSelect.Item id={8} textValue="database.js">
            <TreeSelect.ItemContent>database.js</TreeSelect.ItemContent>
          </TreeSelect.Item>
        </TreeSelect.Item>
        <TreeSelect.Item id={9} textValue="public">
          <TreeSelect.ItemContent>public</TreeSelect.ItemContent>
          <TreeSelect.Item id={10} textValue="logo.svg">
            <TreeSelect.ItemContent>logo.svg</TreeSelect.ItemContent>
          </TreeSelect.Item>
        </TreeSelect.Item>
        <TreeSelect.Item id={11} textValue=".env">
          <TreeSelect.ItemContent>.env</TreeSelect.ItemContent>
        </TreeSelect.Item>
        <TreeSelect.Item id={12} textValue=".gitignore">
          <TreeSelect.ItemContent>.gitignore</TreeSelect.ItemContent>
        </TreeSelect.Item>
        <TreeSelect.Item id={13} textValue="README.md">
          <TreeSelect.ItemContent>README.md</TreeSelect.ItemContent>
        </TreeSelect.Item>
      </TreeSelect>
    );
  },
};

export const Content: Story = {
  render: function Render() {
    return (
      <TreeSelect
        items={items}
        caption="Dynamic collection"
        label="Project files"
        style={{ inlineSize: 240 }}
        placeholder="Select a file"
      >
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Collection items={item.test}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </TreeSelect>
    );
  },
};

export const DisabledOptions: Story = {
  render: function Render() {
    return (
      <TreeSelect
        items={items}
        label="Project files"
        disabledKeys={[6, 9]}
        style={{ inlineSize: 240 }}
        placeholder="Select a file"
      >
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Collection items={item.test}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </TreeSelect>
    );
  },
};

export const Addons: Story = {
  render: function Render() {
    return (
      <TreeSelect
        items={items}
        defaultValue={9}
        label="Project files"
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        startAddon={<IconCrosshairs16 />}
      >
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Collection items={item.test}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </TreeSelect>
    );
  },
};

export const Invalid: Story = {
  render: function Render() {
    return (
      <TreeSelect
        items={items}
        label="Project files"
        style={{ inlineSize: 200 }}
        placeholder="Select an option"
        errorMessage="This field is required"
        isInvalid
      >
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Collection items={item.test}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </TreeSelect>
    );
  },
};

export const Required: Story = {
  render: function Render() {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        <TreeSelect
          items={items}
          caption="required"
          label="Project files"
          style={{ inlineSize: 200 }}
          placeholder="Select an option"
          isRequired
        >
          {function renderItem(item) {
            return (
              <Tree.Item key={item.id} textValue={item.title}>
                <Tree.ItemContent>{item.title}</Tree.ItemContent>
                <Collection items={item.test}>{renderItem}</Collection>
              </Tree.Item>
            );
          }}
        </TreeSelect>
        <TreeSelect
          items={items}
          label="Project files"
          style={{ inlineSize: 200 }}
          placeholder="Select an option"
          caption="required, without an indicator"
          slotProps={{ label: { isRequired: false } }}
          isRequired
        >
          {function renderItem(item) {
            return (
              <Tree.Item key={item.id} textValue={item.title}>
                <Tree.ItemContent>{item.title}</Tree.ItemContent>
                <Collection items={item.test}>{renderItem}</Collection>
              </Tree.Item>
            );
          }}
        </TreeSelect>
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
      <TreeSelect
        items={items}
        label="Project files"
        placeholder="Select an option"
        fullWidth
      >
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Collection items={item.test}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </TreeSelect>
    );
  },
};

export const LabelPlacementAlignment: Story = {
  name: 'Label placement and alignment',
  render: () => (
    <TreeSelect
      items={items}
      labelAlign="end"
      labelPlacement="side"
      label="Project files"
      placeholder="Select an option"
    >
      {function renderItem(item) {
        return (
          <Tree.Item key={item.id} textValue={item.title}>
            <Tree.ItemContent>{item.title}</Tree.ItemContent>
            <Collection items={item.test}>{renderItem}</Collection>
          </Tree.Item>
        );
      }}
    </TreeSelect>
  ),
};

export const SingleSelection: Story = {
  render: function Render() {
    const [value, setValue] = useState<Key | null>(9);

    return (
      <FlexBox direction="column" gap="s">
        <TreeSelect
          value={value}
          items={items}
          label="Project files"
          onChange={setValue}
          style={{ inlineSize: 240 }}
          placeholder="Select a file"
        >
          {function renderItem(item) {
            return (
              <Tree.Item key={item.id} textValue={item.title}>
                <Tree.ItemContent>{item.title}</Tree.ItemContent>
                <Collection items={item.test}>{renderItem}</Collection>
              </Tree.Item>
            );
          }}
        </TreeSelect>
        <Typography>Selected: {value ?? 'none'}</Typography>
      </FlexBox>
    );
  },
};

export const MultipleSelection: Story = {
  render: function Render() {
    const [value, setValue] = useState<Key[]>([9, 11]);

    return (
      <FlexBox direction="column" gap="s" style={{ inlineSize: 320 }}>
        <TreeSelect
          value={value}
          items={items}
          label="Project files"
          onChange={setValue}
          selectionMode="multiple"
          placeholder="Select files"
          style={{ inlineSize: 'inherit' }}
        >
          {function renderItem(item) {
            return (
              <Tree.Item key={item.id} textValue={item.title}>
                <Tree.ItemContent>{item.title}</Tree.ItemContent>
                <Collection items={item.test}>{renderItem}</Collection>
              </Tree.Item>
            );
          }}
        </TreeSelect>
        <Typography>Selected: {value.join(', ') || 'none'}</Typography>
      </FlexBox>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return (
      <TreeSelect
        items={items}
        defaultValue={9}
        caption="Disabled"
        label="Project files"
        style={{ inlineSize: 240 }}
        placeholder="Select a file"
        isDisabled
      >
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Collection items={item.test}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </TreeSelect>
    );
  },
};

export const ClearButton: Story = {
  render: function Render() {
    return (
      <TreeSelect
        items={items}
        defaultValue={9}
        label="Project files"
        style={{ inlineSize: 240 }}
        placeholder="Select a file"
        isClearable
      >
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Collection items={item.test}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </TreeSelect>
    );
  },
};

export const Open: Story = {
  render: function Render() {
    const [isOpen, { toggle, set }] = useBoolean(false);

    return (
      <FlexBox gap="m">
        <TreeSelect
          isOpen={isOpen}
          items={items}
          onOpenChange={set}
          label="Project files"
          placeholder="Select a file"
          style={{ inlineSize: 240 }}
          isLabelHidden
        >
          {function renderItem(item) {
            return (
              <Tree.Item key={item.id} textValue={item.title}>
                <Tree.ItemContent>{item.title}</Tree.ItemContent>
                <Collection items={item.test}>{renderItem}</Collection>
              </Tree.Item>
            );
          }}
        </TreeSelect>
        <Button onPress={toggle}>{isOpen ? 'Close' : 'Open'}</Button>
      </FlexBox>
    );
  },
};
