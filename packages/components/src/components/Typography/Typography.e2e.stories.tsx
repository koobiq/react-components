import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Typography, typographyPropVariant } from './index.js';

const meta = {
  title: 'E2E/Typography',
  component: Typography,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof Typography>;

// `inherit` takes its styles from a context, which an isolated story does not have.
const variants = typographyPropVariant.filter(
  (variant) => variant !== 'inherit'
);

export const Variant: Story = {
  render: () => (
    <E2eGrid columns={1}>
      {variants.map((variant) => (
        <Typography key={variant} variant={variant}>
          {variant}
        </Typography>
      ))}
    </E2eGrid>
  ),
};
