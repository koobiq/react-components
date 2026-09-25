import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { ClampedText } from './index.js';

const meta = {
  title: 'E2E/ClampedText',
  component: ClampedText,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof ClampedText>;

export default meta;

type Story = StoryObj<typeof ClampedText>;

const text =
  'In a distributed denial-of-service attack, the incoming traffic flooding the victim originates from many different sources, so blocking a single source is not enough to stop it.';

export const CollapsedAndExpanded: Story = {
  render: () => (
    <E2eGrid columns={2}>
      {[false, true].map((defaultExpanded) => (
        <ClampedText
          key={String(defaultExpanded)}
          rows={2}
          defaultExpanded={defaultExpanded}
          style={{ inlineSize: 240 }}
        >
          {text}
        </ClampedText>
      ))}
    </E2eGrid>
  ),
};
