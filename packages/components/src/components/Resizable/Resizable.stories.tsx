import { useState } from 'react';

import { clsx } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { Tooltip } from '../Tooltip';
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

export const CustomHandle: Story = {
  render: (args) => (
    <>
      <style>{`
        .custom-resizable-handle {
          --kbq-resizable-handle-transform: translate(100%, 0px);

          outline: none;
        }

        .custom-resizable-handle::after {
          position: absolute;
          inset-block-start: 50%;
          inset-inline-start: 50%;
          inline-size: var(--kbq-size-xxs);
          block-size: var(--kbq-size-7xl);
          border-radius: var(--kbq-size-xxs);
          background-color: var(--kbq-line-contrast-less);
          content: '';
          opacity: 0;
          pointer-events: none;
          transform: translate(-50%, -50%);
          transition: opacity var(--kbq-transition-default);
        }

        .custom-resizable-handle:is(
          [data-hovered],
          [data-focus-visible],
          [data-resizing]
        )::after {
          opacity: 1;
        }
      `}</style>

      <Resizable
        {...args}
        className={s.content}
        defaultSize={{ width: 360, height: 240 }}
        minSize={{ width: 200 }}
        maxSize={{ width: 600 }}
      >
        <Typography>Hover over the right edge</Typography>
        <Tooltip
          placement="end"
          shouldCloseOnPress={false}
          control={(controlProps) => (
            <Resizable.Handle
              {...controlProps}
              aria-label="Resize"
              className="custom-resizable-handle"
              direction={[1, 0]}
            />
          )}
        >
          Resize
        </Tooltip>
      </Resizable>
    </>
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
