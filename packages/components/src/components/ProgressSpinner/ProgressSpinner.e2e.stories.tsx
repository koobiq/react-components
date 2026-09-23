import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { ProgressSpinner, progressSpinnerPropSize } from './index.js';
import type { ProgressSpinnerProps } from './index.js';

const meta = {
  title: 'E2E/ProgressSpinner',
  component: ProgressSpinner,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof ProgressSpinner>;

export default meta;

type Story = StoryObj<typeof ProgressSpinner>;

const states: ProgressSpinnerProps[] = [
  { value: 0 },
  { value: 40 },
  { value: 100 },
  { isIndeterminate: true },
];

export const SizeAndValue: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {progressSpinnerPropSize.flatMap((size) =>
        states.map((state, index) => (
          <ProgressSpinner
            key={`${size}-${index}`}
            size={size}
            aria-label="Loading"
            {...state}
          />
        ))
      )}
    </E2eGrid>
  ),
};
