import { useState } from 'react';

import {
  IconPencil16,
  IconSquareMultipleO16,
  IconTrash16,
  IconBoxArchiveArrowDown16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import type { Selection } from '../../index';
import { List } from '../List';

import { ActionsPanel, ActionsPanelContainer } from './index';

const meta = {
  title: 'Components/ActionsPanel',
  component: ActionsPanel,
  subcomponents: {
    ActionsPanelContainer,
  },
  argTypes: {},
  tags: ['status:new'],
} satisfies Meta<typeof ActionsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: function Render(args) {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    return (
      <ActionsPanelContainer>
        <List
          aria-label="List with actions panel"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <List.Item key="item1">Item 1</List.Item>
          <List.Item key="item2">Item 2</List.Item>
          <List.Item key="item3">Item 3</List.Item>
          <List.Item key="item4">Item 4</List.Item>
          <List.Item key="item5">Item 5</List.Item>
          <List.Item key="item6">Item 6</List.Item>
          <List.Item key="item7">Item 7</List.Item>
          <List.Item key="item8">Item 8</List.Item>
          <List.Item key="item9">Item 9</List.Item>
          <List.Item key="item10">Item 10</List.Item>
        </List>
        <ActionsPanel
          selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
          onClearSelection={() => {
            setSelectedKeys(new Set());
          }}
          onAction={(key) => alert(`submit ${key} action`)}
          {...args}
        >
          <ActionsPanel.Action key="edit" startIcon={<IconPencil16 />}>
            Edit
          </ActionsPanel.Action>
          <ActionsPanel.Action key="copy" startIcon={<IconSquareMultipleO16 />}>
            Copy
          </ActionsPanel.Action>
          <ActionsPanel.Action key="delete" startIcon={<IconTrash16 />}>
            Delete
          </ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );
  },
};

export const Overflow: Story = {
  render: function Render(args) {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['item1'])
    );

    return (
      <ActionsPanelContainer
        style={{
          minWidth: 89,
          maxWidth: '100%',
          overflow: 'hidden',
          resize: 'horizontal',
        }}
      >
        <List
          aria-label="List with actions panel"
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <List.Item key="item1">Item 1</List.Item>
          <List.Item key="item2">Item 2</List.Item>
          <List.Item key="item3">Item 3</List.Item>
          <List.Item key="item4">Item 4</List.Item>
          <List.Item key="item5">Item 5</List.Item>
          <List.Item key="item6">Item 6</List.Item>
          <List.Item key="item7">Item 7</List.Item>
          <List.Item key="item8">Item 8</List.Item>
          <List.Item key="item9">Item 9</List.Item>
          <List.Item key="item10">Item 10</List.Item>
        </List>
        <ActionsPanel
          selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
          onClearSelection={() => {
            setSelectedKeys(new Set());
          }}
          onAction={(key) => alert(`submit ${key} action`)}
          {...args}
        >
          <ActionsPanel.Action key="edit" startIcon={<IconPencil16 />}>
            Edit
          </ActionsPanel.Action>
          <ActionsPanel.Action key="copy" startIcon={<IconSquareMultipleO16 />}>
            Copy
          </ActionsPanel.Action>
          <ActionsPanel.Action
            key="archive"
            startIcon={<IconBoxArchiveArrowDown16 />}
          >
            Archive
          </ActionsPanel.Action>
          <ActionsPanel.Action key="delete" startIcon={<IconTrash16 />}>
            Delete
          </ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );
  },
};
