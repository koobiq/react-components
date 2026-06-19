import { useState } from 'react';

import { Collection } from '@koobiq/react-primitives';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import { TreeSelect, type TreeSelectProps } from './index';

type FileItem = {
  id: string;
  name: string;
  isDisabled?: boolean;
  children?: FileItem[];
};

const items: FileItem[] = [
  {
    id: 'app',
    name: 'app',
    children: [
      {
        id: 'http',
        name: 'Http',
        children: [{ id: 'index-html', name: 'index.html' }],
      },
      {
        id: 'providers',
        name: 'Providers',
        children: [
          { id: 'event-provider', name: 'EventServiceProvider.js' },
          { id: 'route-provider', name: 'RouteServiceProvider.js' },
        ],
      },
    ],
  },
  {
    id: 'config',
    name: 'config',
    children: [
      { id: 'config-app', name: 'app.js' },
      { id: 'config-database', name: 'database.js', isDisabled: true },
    ],
  },
  { id: 'readme', name: 'README.md' },
];

function renderItem(item: FileItem) {
  return (
    <TreeSelect.Item
      key={item.id}
      textValue={item.name}
      isDisabled={item.isDisabled}
    >
      <TreeSelect.ItemContent>{item.name}</TreeSelect.ItemContent>
      <Collection items={item.children}>{renderItem}</Collection>
    </TreeSelect.Item>
  );
}

const meta = {
  title: 'Components/TreeSelect',
  component: TreeSelect,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  tags: ['status:new', 'date:2026-06-15'],
} satisfies Meta<typeof TreeSelect>;

export default meta;

type TreeSelectStoryProps = Omit<
  TreeSelectProps<FileItem>,
  'children' | 'items'
>;
type Story = StoryObj<TreeSelectStoryProps>;

export const Base: Story = {
  render: (args) => (
    <TreeSelect
      items={items}
      aria-label="Project files"
      placeholder="Select file"
      defaultExpandedKeys={['app', 'config']}
      style={{ inlineSize: 320 }}
      {...args}
    >
      {renderItem}
    </TreeSelect>
  ),
};

export const StaticCollection: Story = {
  name: 'Static collection',
  render: (args) => (
    <TreeSelect
      label="Project files"
      placeholder="Select file"
      defaultExpandedKeys={['app', 'config']}
      style={{ inlineSize: 320 }}
      {...args}
    >
      <TreeSelect.Item id="app" textValue="app">
        <TreeSelect.ItemContent>app</TreeSelect.ItemContent>
        <TreeSelect.Item id="http" textValue="Http">
          <TreeSelect.ItemContent>Http</TreeSelect.ItemContent>
          <TreeSelect.Item id="index-html" textValue="index.html">
            <TreeSelect.ItemContent>index.html</TreeSelect.ItemContent>
          </TreeSelect.Item>
        </TreeSelect.Item>
        <TreeSelect.Item id="providers" textValue="Providers">
          <TreeSelect.ItemContent>Providers</TreeSelect.ItemContent>
          <TreeSelect.Item
            id="event-service-provider-js"
            textValue="EventServiceProvider.js"
          >
            <TreeSelect.ItemContent>
              EventServiceProvider.js
            </TreeSelect.ItemContent>
          </TreeSelect.Item>
        </TreeSelect.Item>
      </TreeSelect.Item>
      <TreeSelect.Item id="config" textValue="config">
        <TreeSelect.ItemContent>config</TreeSelect.ItemContent>
        <TreeSelect.Item id="config-app-js" textValue="app.js">
          <TreeSelect.ItemContent>app.js</TreeSelect.ItemContent>
        </TreeSelect.Item>
        <TreeSelect.Item id="database-js" textValue="database.js">
          <TreeSelect.ItemContent>database.js</TreeSelect.ItemContent>
        </TreeSelect.Item>
      </TreeSelect.Item>
      <TreeSelect.Item id="public" textValue="public">
        <TreeSelect.ItemContent>public</TreeSelect.ItemContent>
        <TreeSelect.Item id="logo-svg" textValue="logo.svg">
          <TreeSelect.ItemContent>logo.svg</TreeSelect.ItemContent>
        </TreeSelect.Item>
      </TreeSelect.Item>
      <TreeSelect.Item id="env-file" textValue=".env">
        <TreeSelect.ItemContent>.env</TreeSelect.ItemContent>
      </TreeSelect.Item>
      <TreeSelect.Item id="gitignore-file" textValue=".gitignore">
        <TreeSelect.ItemContent>.gitignore</TreeSelect.ItemContent>
      </TreeSelect.Item>
      <TreeSelect.Item id="readme-file" textValue="README.md">
        <TreeSelect.ItemContent>README.md</TreeSelect.ItemContent>
      </TreeSelect.Item>
    </TreeSelect>
  ),
};

export const DynamicCollection: Story = {
  name: 'Dynamic collection',
  render: function Render(args) {
    const nodes: FileItem[] = [
      {
        id: 'infrastructure',
        name: 'Infrastructure',
        children: [
          { id: 'network', name: 'Network' },
          { id: 'storage', name: 'Storage' },
        ],
      },
      {
        id: 'security',
        name: 'Security',
        children: [
          { id: 'firewall', name: 'Firewall' },
          { id: 'identity', name: 'Identity' },
        ],
      },
      { id: 'observability', name: 'Observability' },
    ];

    return (
      <TreeSelect
        items={nodes}
        label="Service area"
        placeholder="Select area"
        defaultExpandedKeys={['infrastructure', 'security']}
        style={{ inlineSize: 320 }}
        {...args}
      >
        {renderItem}
      </TreeSelect>
    );
  },
};

export const WithLabel: Story = {
  name: 'With label',
  render: (args) => (
    <TreeSelect
      items={items}
      label="Project files"
      placeholder="Select file"
      defaultExpandedKeys={['app', 'config']}
      style={{ inlineSize: 320 }}
      {...args}
    >
      {renderItem}
    </TreeSelect>
  ),
};

export const Controlled: Story = {
  name: 'Controlled selection',
  render: function Render(args) {
    const [selectedKey, setSelectedKey] = useState<string | null>('index-html');

    return (
      <FlexBox gap="m" direction="column">
        <TreeSelect
          items={items}
          label="Project files"
          placeholder="Select file"
          defaultExpandedKeys={['app', 'config']}
          style={{ inlineSize: 320 }}
          {...args}
          selectedKey={selectedKey}
          onSelectionChange={(key) =>
            setSelectedKey(key != null ? String(key) : null)
          }
        >
          {renderItem}
        </TreeSelect>
        <Typography variant="text-compact">
          Selected: {selectedKey ?? 'none'}
        </Typography>
      </FlexBox>
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <TreeSelect
      items={items}
      label="Project files"
      placeholder="Select file"
      defaultExpandedKeys={['app', 'config']}
      style={{ inlineSize: 320 }}
      isDisabled
      {...args}
    >
      {renderItem}
    </TreeSelect>
  ),
};
