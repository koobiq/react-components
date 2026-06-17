import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import { TreeSelect, type TreeSelectNode, type TreeSelectProps } from './index';

const items: TreeSelectNode[] = [
  {
    id: 'app',
    label: 'app',
    children: [
      {
        id: 'http',
        label: 'Http',
        children: [{ id: 'index-html', label: 'index.html' }],
      },
      {
        id: 'providers',
        label: 'Providers',
        children: [
          { id: 'event-provider', label: 'EventServiceProvider.js' },
          { id: 'route-provider', label: 'RouteServiceProvider.js' },
        ],
      },
    ],
  },
  {
    id: 'config',
    label: 'config',
    children: [
      { id: 'config-app', label: 'app.js' },
      { id: 'config-database', label: 'database.js', isDisabled: true },
    ],
  },
  { id: 'readme', label: 'README.md' },
];

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

type TreeSelectStoryProps = Omit<TreeSelectProps, 'items'>;
type Story = StoryObj<TreeSelectStoryProps>;

export const Base: Story = {
  render: (args) => (
    <TreeSelect
      items={items}
      aria-label="Project files"
      placeholder="Select file"
      searchPlaceholder="Filter files"
      defaultExpandedKeys={['app', 'config']}
      style={{ inlineSize: 320 }}
      {...args}
    />
  ),
};

export const StaticCollection: Story = {
  name: 'Static collection',
  render: (args) => (
    <TreeSelect
      label="Project files"
      placeholder="Select file"
      searchPlaceholder="Filter files"
      defaultExpandedKeys={['app', 'config']}
      style={{ inlineSize: 320 }}
      {...args}
    >
      <TreeSelect.Item id="app" textValue="app">
        app
        <TreeSelect.Item id="http" textValue="Http">
          Http
          <TreeSelect.Item id="index-html" textValue="index.html">
            index.html
          </TreeSelect.Item>
        </TreeSelect.Item>
        <TreeSelect.Item id="providers" textValue="Providers">
          Providers
          <TreeSelect.Item
            id="event-service-provider-js"
            textValue="EventServiceProvider.js"
          >
            EventServiceProvider.js
          </TreeSelect.Item>
        </TreeSelect.Item>
      </TreeSelect.Item>
      <TreeSelect.Item id="config" textValue="config">
        config
        <TreeSelect.Item id="config-app-js" textValue="app.js">
          app.js
        </TreeSelect.Item>
        <TreeSelect.Item id="database-js" textValue="database.js">
          database.js
        </TreeSelect.Item>
      </TreeSelect.Item>
      <TreeSelect.Item id="public" textValue="public">
        public
        <TreeSelect.Item id="logo-svg" textValue="logo.svg">
          logo.svg
        </TreeSelect.Item>
      </TreeSelect.Item>
      <TreeSelect.Item id="env-file" textValue=".env">
        .env
      </TreeSelect.Item>
      <TreeSelect.Item id="gitignore-file" textValue=".gitignore">
        .gitignore
      </TreeSelect.Item>
      <TreeSelect.Item id="readme-file" textValue="README.md">
        README.md
      </TreeSelect.Item>
    </TreeSelect>
  ),
};

export const DynamicCollection: Story = {
  name: 'Dynamic collection',
  render: function Render(args) {
    const nodes: TreeSelectNode[] = [
      {
        id: 'infrastructure',
        label: 'Infrastructure',
        children: [
          { id: 'network', label: 'Network' },
          { id: 'storage', label: 'Storage' },
        ],
      },
      {
        id: 'security',
        label: 'Security',
        children: [
          { id: 'firewall', label: 'Firewall' },
          { id: 'identity', label: 'Identity' },
        ],
      },
      { id: 'observability', label: 'Observability' },
    ];

    return (
      <TreeSelect
        items={nodes}
        label="Service area"
        placeholder="Select area"
        searchPlaceholder="Filter areas"
        defaultExpandedKeys={['infrastructure', 'security']}
        style={{ inlineSize: 320 }}
        {...args}
      />
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
      searchPlaceholder="Filter files"
      defaultExpandedKeys={['app', 'config']}
      style={{ inlineSize: 320 }}
      {...args}
    />
  ),
};

/** The selection survives filtering: pick a node, then filter it out. */
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
          searchPlaceholder="Filter files"
          defaultExpandedKeys={['app', 'config']}
          style={{ inlineSize: 320 }}
          {...args}
          selectedKey={selectedKey}
          onSelectionChange={setSelectedKey}
        />
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
      searchPlaceholder="Filter files"
      defaultExpandedKeys={['app', 'config']}
      style={{ inlineSize: 320 }}
      isDisabled
      {...args}
    />
  ),
};
