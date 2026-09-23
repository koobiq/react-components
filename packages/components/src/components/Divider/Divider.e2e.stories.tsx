import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Divider } from './index.js';

const meta = {
  title: 'E2E/Divider',
  component: Divider,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Divider>;

export default meta;

type Story = StoryObj<typeof Divider>;

// A divider fills its parent, so each one gets a box that also shows the paddings.
export const Orientation: Story = {
  render: () => (
    <E2eGrid columns={2}>
      {(['horizontal', 'vertical'] as const).flatMap((orientation) =>
        [false, true].map((disablePaddings) => (
          <div
            key={`${orientation}-${disablePaddings}`}
            style={{
              inlineSize: 40,
              blockSize: 40,
              backgroundColor: 'var(--kbq-background-bg-secondary)',
            }}
          >
            <Divider
              orientation={orientation}
              disablePaddings={disablePaddings}
            />
          </div>
        ))
      )}
    </E2eGrid>
  ),
};
