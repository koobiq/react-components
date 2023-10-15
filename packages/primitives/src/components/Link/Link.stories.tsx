import type { CSSProperties } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Link, type LinkBaseProps } from './index.js';

const meta = {
  title: 'Primitives/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  args: {
    href: 'https://react.koobiq.io',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: LinkBaseProps) => (
    <Link
      {...args}
      style={({ hovered, pressed }) => {
        const commonStyle: CSSProperties = {
          fontSize: 16,
          color: 'light-dark(#000, #fff)',
          lineHeight: 24,
          outline: 'none',
          position: 'relative',
          textDecoration: 'none',
          fontFamily: 'Inter, Arial, sans-serif',
          transition: 'opacity 120ms ease-in-out',
        };

        return {
          ...commonStyle,
          ...(hovered && { opacity: 0.9 }),
          ...(pressed && { opacity: 0.8 }),
        };
      }}
    >
      {({ hovered, focusVisible }) => (
        <>
          {
            <div
              style={
                {
                  transform: 'translateY(0)',
                  ...((hovered || focusVisible) && {
                    transform: 'translateY(2px)',
                  }),
                  height: 2,
                  bottom: 0,
                  content: '',
                  width: '100%',
                  display: 'block',
                  position: 'absolute',
                  transition: 'transform 120ms ease-in-out',
                  background:
                    'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
                } as CSSProperties
              }
            />
          }
          Anchor
        </>
      )}
    </Link>
  ),
};
