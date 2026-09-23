import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Badge, badgePropSize, badgePropVariant } from './index.js';

const meta = {
  title: 'E2E/Badge',
  component: Badge,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof Badge>;

// The variants go in threes of one color: filled, fade and outline.
export const Variant: Story = {
  render: () => (
    <E2eGrid columns={3}>
      {badgePropSize.flatMap((size) =>
        badgePropVariant.map((variant) => (
          <Badge key={`${size}-${variant}`} size={size} variant={variant}>
            {variant}
          </Badge>
        ))
      )}
    </E2eGrid>
  ),
};
