import { IconBell16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { Button } from '../Button';

import { EmptyState, emptyStatePropSize } from './index.js';

const meta = {
  title: 'E2E/EmptyState',
  component: EmptyState,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Size: Story = {
  render: () => (
    <E2eGrid columns={emptyStatePropSize.length}>
      {[false, true].flatMap((isInvalid) =>
        emptyStatePropSize.map((size) => (
          <EmptyState
            key={`${isInvalid}-${size}`}
            size={size}
            isInvalid={isInvalid}
          >
            <EmptyState.Media>
              <IconBell16 />
            </EmptyState.Media>
            <EmptyState.Title>{size}</EmptyState.Title>
            <EmptyState.Content>Content</EmptyState.Content>
            <EmptyState.Actions>
              <Button>Action</Button>
            </EmptyState.Actions>
          </EmptyState>
        ))
      )}
      {emptyStatePropSize.map((size) => (
        <EmptyState key={size} size={size}>
          <EmptyState.Title>{size}</EmptyState.Title>
          <EmptyState.Content>Content</EmptyState.Content>
        </EmptyState>
      ))}
    </E2eGrid>
  ),
};
