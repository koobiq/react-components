import { useState } from 'react';

import { useInterval } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar, type ProgressBarBaseProps } from './index.js';

const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: ProgressBarBaseProps) => (
    <ProgressBar
      aria-label="Loading data…"
      style={{ inlineSize: 260 }}
      value={50}
      {...args}
    />
  ),
};

export const Value: Story = {
  render: (args: ProgressBarBaseProps) => (
    <ProgressBar
      aria-label="Loading…"
      value={25}
      style={{ inlineSize: 260 }}
      {...args}
    />
  ),
};

export const MinMaxValues: Story = {
  name: 'MinValue and MaxValue',
  render: (args: ProgressBarBaseProps) => (
    <ProgressBar
      style={{ inlineSize: 260 }}
      aria-label="Loading…"
      minValue={50}
      maxValue={150}
      value={100}
      {...args}
    />
  ),
};

export const Indeterminate: Story = {
  render: (args: ProgressBarBaseProps) => (
    <ProgressBar
      aria-label="System scan…"
      style={{ inlineSize: 260 }}
      variant="indeterminate"
      {...args}
    />
  ),
};

export const LoadingEmulation: Story = {
  name: 'Loading emulation',
  render: function Render(args: ProgressBarBaseProps) {
    const [progress, setProgress] = useState(0);

    useInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }

        const diff = Math.random() * 10;

        return Math.min(oldProgress + diff, 100);
      });
    }, 260);

    return (
      <ProgressBar
        aria-label="Loading…"
        style={{ inlineSize: 260 }}
        value={progress}
        {...args}
      />
    );
  },
};
