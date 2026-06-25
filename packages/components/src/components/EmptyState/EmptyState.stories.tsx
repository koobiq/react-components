import { IconBoxOpen24 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { EmptyState } from './index';

const meta = {
  title: 'Components/EmptyState',
  component: EmptyState,
  subcomponents: {
    'EmptyState.Media': EmptyState.Media,
    'EmptyState.Title': EmptyState.Title,
    'EmptyState.Content': EmptyState.Content,
    'EmptyState.Actions': EmptyState.Actions,
  },
  tags: ['status:new', 'date:2026-06-25'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    size: 'normal',
    state: 'default',
  },
  render: (args) => (
    <EmptyState {...args}>
      <EmptyState.Media>
        <IconBoxOpen24 />
      </EmptyState.Media>
      <EmptyState.Title>No data</EmptyState.Title>
      <EmptyState.Content>
        There is nothing here yet. Create your first item to get started.
      </EmptyState.Content>
      <EmptyState.Actions>
        <Button variant="contrast-filled">Create</Button>
      </EmptyState.Actions>
    </EmptyState>
  ),
};
