import { useState } from 'react';

import { useInterval } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { flex } from '../layout';

import { ProgressSpinner, progressSpinnerPropSize } from './index.js';
import type { ProgressSpinnerBaseProps } from './index.js';

const meta = {
  title: 'Components/ProgressSpinner',
  component: ProgressSpinner,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ProgressSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: ProgressSpinnerBaseProps) => (
    <ProgressSpinner aria-label="Loading data…" value={75} {...args} />
  ),
};

export const Size: Story = {
  render: (args: ProgressSpinnerBaseProps) => (
    <div className={flex({ gap: 'l' })}>
      {progressSpinnerPropSize.map((size) => (
        <ProgressSpinner
          key={size}
          size={size}
          aria-label="Loading data…"
          value={75}
          {...args}
        />
      ))}
    </div>
  ),
};

export const Value: Story = {
  render: (args: ProgressSpinnerBaseProps) => (
    <div className={flex({ gap: 'l' })}>
      <ProgressSpinner aria-label="Loading…" value={25} {...args} />
      <ProgressSpinner aria-label="Loading…" value={50} {...args} />
      <ProgressSpinner aria-label="Loading…" value={75} {...args} />
      <ProgressSpinner aria-label="Loading…" value={100} {...args} />
    </div>
  ),
};

export const MinMaxValues: Story = {
  name: 'MinValue and MaxValue',
  render: (args: ProgressSpinnerBaseProps) => (
    <ProgressSpinner
      aria-label="Loading…"
      minValue={50}
      maxValue={150}
      value={100}
      {...args}
    />
  ),
};

export const Indeterminate: Story = {
  render: (args: ProgressSpinnerBaseProps) => (
    <ProgressSpinner aria-label="Loading…" variant="indeterminate" {...args} />
  ),
};

export const LoadingEmulation: Story = {
  name: 'Loading emulation',
  render: function Render(args: ProgressSpinnerBaseProps) {
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

    return <ProgressSpinner aria-label="Loading…" value={progress} {...args} />;
  },
};
