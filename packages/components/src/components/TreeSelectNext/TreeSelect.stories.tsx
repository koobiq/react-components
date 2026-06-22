import { IconCrosshairs16 } from '@koobiq/react-icons';
import { Collection } from '@koobiq/react-primitives';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Tree } from '../Tree';

import { TreeSelect } from './index';

const meta = {
  title: 'Components/TreeSelectNext',
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
        items={items}
        defaultSelectedKeys={new Set([9])}
        caption="My caption"
        label="Project files"
        placeholder="My placeholder"
        selectionMode="multiple"
        style={{ inlineSize: 320 }}
        isClearable
      >
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              {/* recursively render children */}
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
        // TODO:
        // defaultValue={1}
        defaultSelectedKeys={new Set([9])}
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
