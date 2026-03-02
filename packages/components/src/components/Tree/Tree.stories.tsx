import { useState } from 'react';

import { IconFileLines16, IconFolder16 } from '@koobiq/react-icons';
import { Collection } from '@koobiq/react-primitives';
import type { Meta, StoryObj } from '@storybook/react';

import { useAsyncList } from '../../index';
import type { Selection } from '../../index';
import { Badge } from '../Badge';
import { spacing } from '../layout';
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
    title: 'Documents',
    type: 'directory',
    children: [
      {
        id: 2,
        title: 'Project',
        type: 'directory',
        children: [
          { id: 3, title: 'Weekly Report', type: 'file', children: [] },
          { id: 4, title: 'Budget', type: 'file', children: [] },
        ],
      },
    ],
  },
  {
    id: 5,
    title: 'Photos',
    type: 'directory',
    children: [
      { id: 6, title: 'Image 1', type: 'file', children: [] },
      { id: 7, title: 'Image 2', type: 'file', children: [] },
    ],
  },
];

export const Base: Story = {
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <Tree aria-label="Files" {...args}>
      <Tree.Item id="documents" textValue="Documents">
        <Tree.ItemContent>Departments</Tree.ItemContent>
        <Tree.Item id="project" textValue="Project">
          <Tree.ItemContent>Project</Tree.ItemContent>
          <Tree.Item id="weekly Report" textValue="Weekly Report">
            <Tree.ItemContent>Weekly Report</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
      </Tree.Item>
      <Tree.Item id="photos" textValue="Photos">
        <Tree.ItemContent>Photos</Tree.ItemContent>
        <Tree.Item id="image 1" textValue="Image 1">
          <Tree.ItemContent>Image 1</Tree.ItemContent>
        </Tree.Item>
        <Tree.Item id="image 2" textValue="Image 2">
          <Tree.ItemContent>Image 2</Tree.ItemContent>
        </Tree.Item>
      </Tree.Item>
    </Tree>
  ),
};

export const Content: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    return (
      <Tree
        items={items}
        aria-label="Files"
        selectionMode="multiple"
        defaultExpandedKeys={[1, 4]}
      >
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
    return (
      <Tree
        items={items}
        aria-label="Files"
        selectionMode="multiple"
        defaultExpandedKeys={[1, 4]}
      >
        {function renderItem(item) {
          return (
            <Tree.Item key={item.id} textValue={item.title}>
              <Tree.ItemContent>
                {item.type === 'directory' ? (
                  <IconFolder16 />
                ) : (
                  <IconFileLines16 />
                )}
                <Typography>{item.title}</Typography>
                <Badge
                  size="compact"
                  variant="theme"
                  className={spacing({ mis: 'auto' })}
                >
                  Badge
                </Badge>
              </Tree.ItemContent>
              {/* recursively render children */}
              <Collection items={item.children}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
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
      new Set(['components'])
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
          defaultExpandedKeys={['docs', 'src']}
        >
          <Tree.Item id="docs" textValue="docs">
            <Tree.ItemContent>docs</Tree.ItemContent>
            <Tree.Item id="components" textValue="components">
              <Tree.ItemContent>components</Tree.ItemContent>
            </Tree.Item>
            <Tree.Item id="guides" textValue="guides">
              <Tree.ItemContent>guides</Tree.ItemContent>
            </Tree.Item>
          </Tree.Item>
          <Tree.Item id="src" textValue="src">
            <Tree.ItemContent>src</Tree.ItemContent>
            <Tree.Item id="tree" textValue="Tree.tsx">
              <Tree.ItemContent>Tree.tsx</Tree.ItemContent>
            </Tree.Item>
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
