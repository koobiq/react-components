import { IconFileLines16, IconFolder16 } from '@koobiq/react-icons';
import { Collection } from '@koobiq/react-primitives';
import type { Meta, StoryObj } from '@storybook/react';

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
    <Tree selectionMode="multiple" aria-label="Files" {...args}>
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
