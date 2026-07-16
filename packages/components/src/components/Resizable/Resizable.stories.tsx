import { useState } from 'react';

import { clsx } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { Typography } from '../Typography';

import s from './__stories__/styles.module.css';
import { Resizable } from './Resizable';
import type { ResizableProps, ResizableSize } from './types';

const meta = {
  title: 'Components/Resizable',
  component: Resizable,
  subcomponents: {
    'Resizable.Handle': Resizable.Handle,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-07-16'],
} satisfies Meta<typeof Resizable>;

export default meta;
type Story = StoryObj<ResizableProps>;

const handleClassName = s.handle;

function Handles() {
  return (
    <>
      <Resizable.Handle className={handleClassName} direction={[-1, -1]} />
      <Resizable.Handle className={handleClassName} direction={[0, -1]} />
      <Resizable.Handle className={handleClassName} direction={[1, -1]} />
      <Resizable.Handle className={handleClassName} direction={[-1, 0]} />
      <Resizable.Handle className={handleClassName} direction={[1, 0]} />
      <Resizable.Handle className={handleClassName} direction={[-1, 1]} />
      <Resizable.Handle className={handleClassName} direction={[0, 1]} />
      <Resizable.Handle className={handleClassName} direction={[1, 1]} />
    </>
  );
}

export const Base: Story = {
  render: function Render(args) {
    const [size, setSize] = useState<ResizableSize>({
      width: 400,
      height: 300,
    });

    return (
      <Resizable
        {...args}
        size={size}
        className={s.content}
        minSize={{ width: 200, height: 150 }}
        maxSize={{ width: 800, height: 600 }}
        onResize={setSize}
      >
        <Typography>
          {Math.round(size.width)} × {Math.round(size.height)} px
        </Typography>
        <Handles />
      </Resizable>
    );
  },
};

export const Uncontrolled: Story = {
  render: (args) => (
    <Resizable
      {...args}
      className={s.content}
      defaultSize={{ width: 360, height: 240 }}
      minSize={{ width: 200, height: 120 }}
      maxSize={{ width: 560, height: 400 }}
    >
      <Typography>Uncontrolled size</Typography>
      <Handles />
    </Resizable>
  ),
};

export const IntrinsicSize: Story = {
  render: (args) => (
    <Resizable
      {...args}
      className={clsx(s.content, s.intrinsic)}
      minSize={{ width: 160, height: 80 }}
      maxSize={{ width: 560, height: 400 }}
    >
      <Typography>
        This element keeps its intrinsic size until a handle is moved
      </Typography>
      <Handles />
    </Resizable>
  ),
};

export const SingleDirection: Story = {
  render: (args) => (
    <Resizable
      {...args}
      className={s.content}
      defaultSize={{ width: 400, height: 240 }}
      minSize={{ width: 200 }}
      maxSize={{ width: 600 }}
    >
      <Typography>Resize from the right edge</Typography>
      <Resizable.Handle className={handleClassName} direction={[1, 0]} />
    </Resizable>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Resizable
      {...args}
      className={s.content}
      defaultSize={{ width: 400, height: 240 }}
      isDisabled
    >
      <Typography>Resizing is disabled</Typography>
      <Handles />
    </Resizable>
  ),
};
