import { useState } from 'react';

import {
  IconPencil16,
  IconSquareMultipleO16,
  IconTrash16,
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
          <List.Item key="first">First</List.Item>
          <List.Item key="second">Second</List.Item>
          <List.Item key="third">Third</List.Item>
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
