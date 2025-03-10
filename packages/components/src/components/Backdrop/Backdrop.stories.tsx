import type { CSSProperties } from 'react';

import { useBoolean } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { ProgressSpinner } from '../ProgressSpinner';

import { Backdrop, type BackdropBaseProps } from './index';

const meta = {
  title: 'Components/Backdrop',
  component: Backdrop,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Backdrop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: function Render(args: BackdropBaseProps) {
    const [open, { on, off }] = useBoolean(true);

    const containerStyle = {
      inlineSize: 240,
      blockSize: 240,
      display: 'flex',
      overflow: 'auto',
      borderRadius: '0.5em',
      alignItems: 'center',
      transform: 'scale(1)',
      justifyContent: 'center',
      border: '1px solid var(--kbq-line-contrast-fade)',
    } as CSSProperties;

    const progressStyle = {
      '--progressbar-spin-color': 'var(--kbq-white-default)',
    } as CSSProperties;

    return (
      <div style={containerStyle}>
        <Button onClick={on}>Show the backdrop</Button>
        <Backdrop
          open={open}
          zIndex={5}
          onClick={off}
          style={{ cursor: 'pointer' }}
          {...args}
        >
          <ProgressSpinner
            aria-label="loading"
            size="big"
            style={progressStyle}
          />
        </Backdrop>
      </div>
    );
  },
};
