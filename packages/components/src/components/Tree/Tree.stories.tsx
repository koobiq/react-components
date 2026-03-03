import { useState } from 'react';

import { useHover } from '@koobiq/react-core';
import { IconEllipsisVertical16, IconFolder16 } from '@koobiq/react-icons';
import { Collection } from '@koobiq/react-primitives';
import type { Meta, StoryObj } from '@storybook/react';

import { useAsyncList } from '../../index';
import type { Selection } from '../../index';
import { IconButton } from '../IconButton';
import { spacing } from '../layout';
import { Menu } from '../Menu';
import { Typography } from '../Typography';

import { Tree } from './Tree';

const meta = {
  title: 'Components/Tree',
  component: Tree,
  parameters: {
    layout: 'centered',
  },
  subcomponents: {
    'Tree.Item': Tree.Item,
    'Tree.ItemContent': Tree.ItemContent,
    'Tree.LoadMoreItem': Tree.LoadMoreItem,
  },
  argTypes: {},
  tags: ['status:new', 'date:2026-03-02'],
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    id: 1,
    title: 'app',
    type: 'directory',
    children: [
      {
        id: 2,
        title: 'Http',
        type: 'directory',
        children: [{ id: 3, title: 'index.html', type: 'file', children: [] }],
      },
      {
        id: 4,
        title: 'Providers',
        type: 'directory',
        children: [
          {
            id: 5,
            title: 'EventServiceProvider.js',
            type: 'file',
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: 6,
    title: 'config',
    type: 'directory',
    children: [
      { id: 7, title: 'app.js', type: 'file', children: [] },
      { id: 8, title: 'database.js', type: 'file', children: [] },
    ],
  },
  {
    id: 9,
    title: 'public',
    type: 'directory',
    children: [{ id: 10, title: 'logo.svg', type: 'file', children: [] }],
  },
  { id: 11, title: '.env', type: 'file', children: [] },
  { id: 12, title: '.gitignore', type: 'file', children: [] },
  { id: 13, title: 'README.md', type: 'file', children: [] },
];

export const Base: Story = {
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <Tree aria-label="Project files" {...args}>
      <Tree.Item id="app" textValue="app">
        <Tree.ItemContent>app</Tree.ItemContent>
        <Tree.Item id="http" textValue="Http">
          <Tree.ItemContent>Http</Tree.ItemContent>
          <Tree.Item id="index-html" textValue="index.html">
            <Tree.ItemContent>index.html</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id="providers" textValue="Providers">
          <Tree.ItemContent>Providers</Tree.ItemContent>
          <Tree.Item
            id="event-service-provider-js"
            textValue="EventServiceProvider.js"
          >
            <Tree.ItemContent>EventServiceProvider.js</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
      </Tree.Item>
      <Tree.Item id="config" textValue="config">
        <Tree.ItemContent>config</Tree.ItemContent>
        <Tree.Item id="config-app-js" textValue="app.js">
          <Tree.ItemContent>app.js</Tree.ItemContent>
        </Tree.Item>
        <Tree.Item id="database-js" textValue="database.js">
          <Tree.ItemContent>database.js</Tree.ItemContent>
        </Tree.Item>
      </Tree.Item>
      <Tree.Item id="public" textValue="public">
        <Tree.ItemContent>public</Tree.ItemContent>
        <Tree.Item id="logo-svg" textValue="logo.svg">
          <Tree.ItemContent>logo.svg</Tree.ItemContent>
        </Tree.Item>
      </Tree.Item>
      <Tree.Item id="env-file" textValue=".env">
        <Tree.ItemContent>.env</Tree.ItemContent>
      </Tree.Item>
      <Tree.Item id="gitignore-file" textValue=".gitignore">
        <Tree.ItemContent>.gitignore</Tree.ItemContent>
      </Tree.Item>
      <Tree.Item id="readme-file" textValue="README.md">
        <Tree.ItemContent>README.md</Tree.ItemContent>
      </Tree.Item>
    </Tree>
  ),
};

export const MultipleSelection: Story = {
  name: 'Multiple selection',
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['index-html', 'logo-svg', 'readme-file'])
    );

    return (
      <>
        <Tree
          aria-label="Project files"
          selectionMode="multiple"
          selectionBehavior="toggle"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          defaultExpandedKeys={['app', 'http']}
        >
          <Tree.Item id="app" textValue="app">
            <Tree.ItemContent>app</Tree.ItemContent>
            <Tree.Item id="http" textValue="Http">
              <Tree.ItemContent>Http</Tree.ItemContent>
              <Tree.Item id="index-html" textValue="index.html">
                <Tree.ItemContent>index.html</Tree.ItemContent>
              </Tree.Item>
            </Tree.Item>
            <Tree.Item id="providers" textValue="Providers">
              <Tree.ItemContent>Providers</Tree.ItemContent>
              <Tree.Item
                id="event-service-provider-js"
                textValue="EventServiceProvider.js"
              >
                <Tree.ItemContent>EventServiceProvider.js</Tree.ItemContent>
              </Tree.Item>
            </Tree.Item>
          </Tree.Item>
          <Tree.Item id="config" textValue="config">
            <Tree.ItemContent>config</Tree.ItemContent>
            <Tree.Item id="config-app-js" textValue="app.js">
              <Tree.ItemContent>app.js</Tree.ItemContent>
            </Tree.Item>
            <Tree.Item id="database-js" textValue="database.js">
              <Tree.ItemContent>database.js</Tree.ItemContent>
            </Tree.Item>
          </Tree.Item>
          <Tree.Item id="public" textValue="public">
            <Tree.ItemContent>public</Tree.ItemContent>
            <Tree.Item id="logo-svg" textValue="logo.svg">
              <Tree.ItemContent>logo.svg</Tree.ItemContent>
            </Tree.Item>
          </Tree.Item>
          <Tree.Item id="env-file" textValue=".env">
            <Tree.ItemContent>.env</Tree.ItemContent>
          </Tree.Item>
          <Tree.Item id="gitignore-file" textValue=".gitignore">
            <Tree.ItemContent>.gitignore</Tree.ItemContent>
          </Tree.Item>
          <Tree.Item id="readme-file" textValue="README.md">
            <Tree.ItemContent>README.md</Tree.ItemContent>
          </Tree.Item>
        </Tree>
        <Typography className={spacing({ pbs: 'm' })}>
          Selected keys: {Array.from(selectedKeys).join(', ') || 'none'}
        </Typography>
      </>
    );
  },
};

export const Content: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    return (
      <Tree items={items} aria-label="Project files">
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              {/* recursively render children */}
              <Collection items={item.children}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </Tree>
    );
  },
};

export const Slots: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    function MyTreeItemContent({
      title,
      type,
      isHovered,
    }: {
      title: string;
      type: string;
      isHovered: boolean;
    }) {
      const [isMenuOpen, setIsMenuOpen] = useState(false);

      return (
        <Tree.ItemContent>
          {type === 'directory' && <IconFolder16 />}
          <Typography>{title}</Typography>
          {(isHovered || isMenuOpen) && (
            <Menu
              onOpenChange={setIsMenuOpen}
              control={(props) => (
                <IconButton
                  {...props}
                  size="l"
                  variant="fade-contrast"
                  aria-label="More actions"
                  className={spacing({ mis: 'auto' })}
                  isCompact
                >
                  <IconEllipsisVertical16 />
                </IconButton>
              )}
            >
              <Menu.Item key="edit">Edit</Menu.Item>
              <Menu.Item key="copy">Copy</Menu.Item>
              <Menu.Item key="delete">Delete</Menu.Item>
            </Menu>
          )}
        </Tree.ItemContent>
      );
    }

    function MyTreeItem({ item }: { item: (typeof items)[number] }) {
      const { hoverProps, isHovered } = useHover({});

      return (
        <Tree.Item key={item.id} textValue={item.title} {...hoverProps}>
          <MyTreeItemContent
            title={item.title}
            type={item.type}
            isHovered={isHovered}
          />
          <Collection items={item.children}>
            {(child) => <MyTreeItem item={child} />}
          </Collection>
        </Tree.Item>
      );
    }

    return (
      <Tree items={items} aria-label="Project files">
        {(item) => <MyTreeItem item={item} />}
      </Tree>
    );
  },
};

export const EmptyState: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    return (
      <Tree
        aria-label="Search results"
        renderEmptyState={() => 'No results found.'}
      >
        {[]}
      </Tree>
    );
  },
};

export const Disabled: Story = {
  name: 'Disabled items',
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    return (
      <Tree
        items={items}
        aria-label="Project files"
        defaultExpandedKeys={[1, 2, 9]}
        disabledKeys={[3, 8, 11]}
      >
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Collection items={item.children}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </Tree>
    );
  },
};

interface Product {
  id: number;
  title: string;
  brand: string;
}

export const Links: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    return (
      <Tree aria-label="Documentation links" defaultExpandedKeys={['react']}>
        <Tree.Item id="react" textValue="React" href="https://react.dev/">
          <Tree.ItemContent>React</Tree.ItemContent>
          <Tree.Item
            id="components"
            textValue="Components"
            href="https://react.dev/reference/react"
          >
            <Tree.ItemContent>Components</Tree.ItemContent>
          </Tree.Item>
          <Tree.Item
            id="hooks"
            textValue="Hooks"
            href="https://react.dev/reference/react/hooks"
          >
            <Tree.ItemContent>Hooks</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item
          id="storybook"
          textValue="Storybook"
          href="https://storybook.js.org/docs"
        >
          <Tree.ItemContent>Storybook</Tree.ItemContent>
          <Tree.Item
            id="essentials"
            textValue="Essentials"
            href="https://storybook.js.org/docs/essentials"
          >
            <Tree.ItemContent>Essentials</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
      </Tree>
    );
  },
};

export const SelectionAndActions: Story = {
  name: 'Selection and actions',
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['index-html'])
    );

    const [lastAction, setLastAction] = useState('none');

    return (
      <>
        <Tree
          aria-label="Project files"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          onAction={(key) => setLastAction(String(key))}
          defaultExpandedKeys={['app', 'http', 'providers', 'config']}
        >
          <Tree.Item id="app" textValue="app">
            <Tree.ItemContent>app</Tree.ItemContent>
            <Tree.Item id="http" textValue="Http">
              <Tree.ItemContent>Http</Tree.ItemContent>
              <Tree.Item id="index-html" textValue="index.html">
                <Tree.ItemContent>index.html</Tree.ItemContent>
              </Tree.Item>
            </Tree.Item>
            <Tree.Item id="providers" textValue="Providers">
              <Tree.ItemContent>Providers</Tree.ItemContent>
              <Tree.Item
                id="event-service-provider-js"
                textValue="EventServiceProvider.js"
              >
                <Tree.ItemContent>EventServiceProvider.js</Tree.ItemContent>
              </Tree.Item>
            </Tree.Item>
          </Tree.Item>
          <Tree.Item id="config" textValue="config">
            <Tree.ItemContent>config</Tree.ItemContent>
            <Tree.Item id="config-app-js" textValue="app.js">
              <Tree.ItemContent>app.js</Tree.ItemContent>
            </Tree.Item>
            <Tree.Item id="database-js" textValue="database.js">
              <Tree.ItemContent>database.js</Tree.ItemContent>
            </Tree.Item>
          </Tree.Item>
          <Tree.Item id="public" textValue="public">
            <Tree.ItemContent>public</Tree.ItemContent>
            <Tree.Item id="logo-svg" textValue="logo.svg">
              <Tree.ItemContent>logo.svg</Tree.ItemContent>
            </Tree.Item>
          </Tree.Item>
          <Tree.Item id="env-file" textValue=".env">
            <Tree.ItemContent>.env</Tree.ItemContent>
          </Tree.Item>
          <Tree.Item id="gitignore-file" textValue=".gitignore">
            <Tree.ItemContent>.gitignore</Tree.ItemContent>
          </Tree.Item>
          <Tree.Item id="readme-file" textValue="README.md">
            <Tree.ItemContent>README.md</Tree.ItemContent>
          </Tree.Item>
        </Tree>
        <Typography className={spacing({ pbs: 'm' })}>
          Selected keys: {Array.from(selectedKeys).join(', ') || 'none'}
        </Typography>
        <Typography>Last action: {lastAction}</Typography>
      </>
    );
  },
};

export const AsyncLoading: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    const ITEMS_PER_PAGE = 5;

    const smartphonesList = useAsyncList<Product>({
      async load({ signal, cursor }) {
        const skip = Number(cursor ?? 0);

        const response = await fetch(
          `https://dummyjson.com/products/category/smartphones?limit=${ITEMS_PER_PAGE}&skip=${skip}`,
          { signal }
        );

        const data = await response.json();
        const nextSkip = skip + ITEMS_PER_PAGE;

        return {
          items: data.products ?? [],
          cursor: nextSkip < data.total ? String(nextSkip) : undefined,
        };
      },
    });

    const mobileAccessoriesList = useAsyncList<Product>({
      async load({ signal, cursor }) {
        const skip = Number(cursor ?? 0);

        const response = await fetch(
          `https://dummyjson.com/products/category/mobile-accessories?limit=${ITEMS_PER_PAGE}&skip=${skip}`,
          { signal }
        );

        const data = await response.json();
        const nextSkip = skip + ITEMS_PER_PAGE;

        return {
          items: data.products ?? [],
          cursor: nextSkip < data.total ? String(nextSkip) : undefined,
        };
      },
    });

    return (
      <Tree aria-label="Async loading tree" style={{ height: 300 }}>
        <Tree.Item id="smartphones" textValue="Smartphones">
          <Tree.ItemContent>Smartphones</Tree.ItemContent>
          <Collection items={smartphonesList.items}>
            {(item) => (
              <Tree.Item
                id={`smartphone-${item.id}`}
                textValue={`${item.brand} ${item.title}`}
              >
                <Tree.ItemContent>
                  {item.brand} {item.title}
                </Tree.ItemContent>
              </Tree.Item>
            )}
          </Collection>
          <Tree.LoadMoreItem
            onLoadMore={smartphonesList.loadMore}
            isLoading={smartphonesList.loadingState === 'loadingMore'}
          />
        </Tree.Item>
        <Tree.Item id="mobile-accessories" textValue="Mobile accessories">
          <Tree.ItemContent>Mobile accessories</Tree.ItemContent>
          <Collection items={mobileAccessoriesList.items}>
            {(item) => (
              <Tree.Item
                id={`mobile-accessory-${item.id}`}
                textValue={`${item.brand} ${item.title}`}
              >
                <Tree.ItemContent>
                  {item.brand} {item.title}
                </Tree.ItemContent>
              </Tree.Item>
            )}
          </Collection>
          <Tree.LoadMoreItem
            onLoadMore={mobileAccessoriesList.loadMore}
            isLoading={mobileAccessoriesList.loadingState === 'loadingMore'}
          />
        </Tree.Item>
      </Tree>
    );
  },
};
