import type { CSSProperties } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button, type ButtonBaseProps } from './index.js';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: ButtonBaseProps) => (
    <Button
      {...args}
      className="test"
      style={({ isHovered, isPressed }) => {
        const commonStyle: CSSProperties = {
          padding: 16,
          fontSize: 16,
          color: '#fff',
          border: 'none',
          outline: 'none',
          borderRadius: 12,
          cursor: 'pointer',
          position: 'relative',
          fontFamily: 'Inter, Arial, sans-serif',
          transition: 'opacity 120ms ease-in-out',
          background:
            'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        };

        return {
          ...commonStyle,
          ...(isHovered && { opacity: 0.9 }),
          ...(isPressed && { opacity: 0.8 }),
        };
      }}
    >
      {({ isFocusVisible }) => (
        <>
          {isFocusVisible && (
            <div
              style={{
                inset: 0,
                outlineOffset: 2,
                position: 'absolute',
                pointerEvents: 'none',
                borderRadius: 'inherit',
                outline: '2px solid blue',
                transition: 'outline-color 1200ms ease-in-out',
              }}
            />
          )}
          Button
        </>
      )}
    </Button>
  ),
};
