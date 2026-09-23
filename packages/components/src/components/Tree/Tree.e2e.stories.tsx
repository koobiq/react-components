import { IconFolder16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Tree } from './index.js';

const meta = {
  title: 'E2E/Tree',
  component: Tree,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Tree>;

export default meta;

type Story = StoryObj<typeof Tree>;

// Hover, press and focus come from React Aria as data attributes, so only the states set by props.
export const State: Story = {
  render: () => (
    <E2eGrid columns={1}>
      <Tree
        aria-label="States"
        selectionMode="single"
        defaultExpandedKeys={['expanded']}
        defaultSelectedKeys={['selected']}
        disabledKeys={['disabled']}
        style={{ inlineSize: 240 }}
      >
        <Tree.Item id="expanded" textValue="expanded">
          <Tree.ItemContent>
            <Tree.ItemContentAddon>
              <IconFolder16 />
            </Tree.ItemContentAddon>
            <Tree.ItemContentText>expanded</Tree.ItemContentText>
          </Tree.ItemContent>
          <Tree.Item id="selected" textValue="selected">
            <Tree.ItemContent>selected</Tree.ItemContent>
          </Tree.Item>
          <Tree.Item id="disabled" textValue="disabled">
            <Tree.ItemContent>disabled</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id="collapsed" textValue="collapsed">
          <Tree.ItemContent>
            <Tree.ItemContentAddon>
              <IconFolder16 />
            </Tree.ItemContentAddon>
            <Tree.ItemContentText>collapsed</Tree.ItemContentText>
          </Tree.ItemContent>
          <Tree.Item id="child" textValue="child">
            <Tree.ItemContent>child</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
        <Tree.Item id="normal" textValue="normal">
          <Tree.ItemContent>normal</Tree.ItemContent>
        </Tree.Item>
      </Tree>
    </E2eGrid>
  ),
};
