import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { Typography } from '../Typography';

import { Highlight, highlightPropVariant } from './index.js';

const meta = {
  title: 'E2E/Highlight',
  component: Highlight,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Highlight>;

export default meta;

type Story = StoryObj<typeof Highlight>;

// Highlight inherits the text styles, so Typography sets them.
export const Variant: Story = {
  render: () => (
    <E2eGrid columns={1}>
      {highlightPropVariant.map((variant) => (
        <Typography key={variant}>
          <Highlight text="Manchester United" query="man" variant={variant} />
        </Typography>
      ))}
    </E2eGrid>
  ),
};
