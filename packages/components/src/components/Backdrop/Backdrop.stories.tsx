import type { CSSProperties } from 'react';

import { useBoolean } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { ProgressSpinner } from '../ProgressSpinner';

import { Backdrop, type BackdropProps } from './index';

const meta = {
  title: 'Components/Backdrop',
  component: Backdrop,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Backdrop>;

export default meta;
type Story = StoryObj<BackdropProps>;

export const Base: Story = {
  render: function Render(args) {
    const [isOpen, { on, off }] = useBoolean(true);

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
        <Button onPress={on}>Show the backdrop</Button>
        <Backdrop
          isOpen={isOpen}
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
