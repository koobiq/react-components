import { Collection } from '@koobiq/react-primitives';
import type { Meta, StoryObj } from '@storybook/react';

import { Tree } from './Tree';

const meta = {
  title: 'Components/Tree',
  component: Tree,
  parameters: {
    layout: 'centered',
  },
  subcomponents: {
    'Tree.Item': Tree.Item,
  },
  argTypes: {},
  tags: ['status:new', 'date:2026-03-02'],
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <Tree selectionMode="multiple" aria-label="Files" {...args}>
      <Tree.Item title="Documents">
        <Tree.Item title="Project">
          <Tree.Item title="Weekly Report" />
        </Tree.Item>
      </Tree.Item>
      <Tree.Item title="Photos">
        <Tree.Item title="Image 1" />
        <Tree.Item title="Image 2" />
      </Tree.Item>
    </Tree>
  ),
};

export const Content: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
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

    return (
      <Tree
        aria-label="Files"
        defaultExpandedKeys={[1, 4]}
        items={items}
        selectionMode="multiple"
      >
        {function renderItem(item) {
          return (
            <Tree.Item title={item.title}>
              {/* recursively render children */}
              <Collection items={item.children}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </Tree>
    );
  },
};
