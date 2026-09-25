import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { ProgressBar } from './index.js';
import type { ProgressBarProps } from './index.js';

const meta = {
  title: 'E2E/ProgressBar',
  component: ProgressBar,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof ProgressBar>;

export default meta;

type Story = StoryObj<typeof ProgressBar>;

const states: ProgressBarProps[] = [
  { value: 0 },
  { value: 40 },
  { value: 100 },
];

export const Value: Story = {
  render: () => (
    <E2eGrid columns={1}>
      {states.map((state, index) => (
        <ProgressBar
          key={index}
          aria-label="Loading"
          style={{ inlineSize: 200 }}
          {...state}
        />
      ))}
    </E2eGrid>
  ),
};
