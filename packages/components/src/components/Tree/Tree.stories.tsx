import type { Meta, StoryObj } from '@storybook/react';

import { Tree, TreeItem } from './index';

const meta = {
  title: 'Components/Tree',
  component: Tree,
  parameters: {
    layout: 'centered',
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
      <TreeItem title="Documents">
        <TreeItem title="Project">
          <TreeItem title="Weekly Report" />
        </TreeItem>
      </TreeItem>
      <TreeItem title="Photos">
        <TreeItem title="Image 1" />
        <TreeItem title="Image 2" />
      </TreeItem>
    </Tree>
  ),
};
