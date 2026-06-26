import { IconBell16, IconTriangleExclamation16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { IconItem } from '../IconItem';
import { Link } from '../Link';

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
  render: (args) => (
    <EmptyState {...args}>
      <EmptyState.Media>
        <IconItem size="big" color="contrast" variant="fade">
          <IconBell16 />
        </IconItem>
      </EmptyState.Media>
      <EmptyState.Title>No documents yet</EmptyState.Title>
      <EmptyState.Content>
        Create your first document to get started, or import an existing one.
      </EmptyState.Content>
      <EmptyState.Actions>
        <Button variant="contrast-filled">Create</Button>
        <Button variant="fade-contrast-outline">Import</Button>
      </EmptyState.Actions>
    </EmptyState>
  ),
};

export const Sizes: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <FlexBox
      gap="3xl"
      alignItems="flex-start"
      justifyContent="center"
      wrap="wrap"
    >
      {(['big', 'normal', 'compact'] as const).map((size) => (
        <EmptyState key={size} {...args} size={size}>
          <EmptyState.Media>
            <IconItem size="big" color="contrast" variant="fade">
              <IconBell16 />
            </IconItem>
          </EmptyState.Media>
          <EmptyState.Title>No documents yet</EmptyState.Title>
          <EmptyState.Content>
            Create your first document to get started.
          </EmptyState.Content>
          <EmptyState.Actions>
            <Button variant="contrast-filled">Create</Button>
          </EmptyState.Actions>
        </EmptyState>
      ))}
    </FlexBox>
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <EmptyState isInvalid {...args}>
      <EmptyState.Media>
        <IconItem size="big" color="error" variant="fade">
          <IconTriangleExclamation16 />
        </IconItem>
      </EmptyState.Media>
      <EmptyState.Title>Failed to load documents</EmptyState.Title>
      <EmptyState.Content>
        Something went wrong while loading the data. Please try again.
      </EmptyState.Content>
      <EmptyState.Actions>
        <Button variant="contrast-filled">Retry</Button>
      </EmptyState.Actions>
    </EmptyState>
  ),
};

export const Align: Story = {
  parameters: { layout: 'padded' },
  render: (args) => (
    <FlexBox
      style={{
        blockSize: 360,
        border: '1px dashed var(--kbq-line-contrast-less)',
      }}
    >
      <EmptyState align="start" {...args}>
        <EmptyState.Media>
          <IconItem size="big" color="contrast" variant="fade">
            <IconBell16 />
          </IconItem>
        </EmptyState.Media>
        <EmptyState.Title>No documents yet</EmptyState.Title>
        <EmptyState.Content>
          The content is aligned to the start of the available space.
        </EmptyState.Content>
      </EmptyState>
    </FlexBox>
  ),
};

export const TextOnly: Story = {
  render: (args) => (
    <EmptyState {...args}>
      <EmptyState.Title>Nothing found</EmptyState.Title>
      <EmptyState.Content>
        Try changing the search query or{' '}
        <Link href="#" isPseudo>
          reset the filters
        </Link>
        .
      </EmptyState.Content>
    </EmptyState>
  ),
};
