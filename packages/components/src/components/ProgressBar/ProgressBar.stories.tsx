import { useState } from 'react';

import { useInterval } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { ProgressBar } from './index.js';

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
  render: (args) => (
    <ProgressBar
      value={50}
      aria-label="Loading data…"
      style={{ inlineSize: 260 }}
      {...args}
    />
  ),
};

export const Value: Story = {
  render: (args) => (
    <ProgressBar
      value={25}
      aria-label="Loading…"
      style={{ inlineSize: 260 }}
      {...args}
    />
  ),
};

export const MinMaxValues: Story = {
  name: 'MinValue and MaxValue',
  render: (args) => (
    <ProgressBar
      value={100}
      minValue={50}
      maxValue={150}
      style={{ inlineSize: 260 }}
      aria-label="Loading…"
      {...args}
    />
  ),
};

export const Indeterminate: Story = {
  render: (args) => (
    <ProgressBar
      aria-label="System scan…"
      style={{ inlineSize: 260 }}
      isIndeterminate
      {...args}
    />
  ),
};

export const LoadingEmulation: Story = {
  name: 'Loading emulation',
  render: function Render(args) {
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
        value={progress}
        aria-label="Loading…"
        style={{ inlineSize: 260 }}
        {...args}
      />
    );
  },
};
