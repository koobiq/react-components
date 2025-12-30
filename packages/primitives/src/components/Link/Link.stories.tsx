import type { CSSProperties } from 'react';

import type { Meta } from '@storybook/react';

import { Link, type LinkProps } from './index.js';

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

export const Base = (args: LinkProps) => (
  <Link
    style={({ isHovered, isPressed, isFocusVisible, isDisabled }) => {
      const commonStyle: CSSProperties = {
        padding: 0,
        fontSize: 16,
        color: '#06f',
        outline: 'none',
        outlineWidth: 2,
        outlineOffset: 2,
        lineHeight: '24px',
        position: 'relative',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        outlineStyle: 'solid',
        textDecoration: 'none',
        outlineColor: 'transparent',
        fontFamily: 'Inter, Arial, sans-serif',
        transition:
          'opacity 120ms ease-in-out, outline-color 120ms ease-in-out',
      };

      return {
        ...commonStyle,
        ...(isHovered && { opacity: 0.9 }),
        ...(isPressed && { opacity: 0.8 }),
        ...(isFocusVisible && {
          outlineColor: '#06f',
        }),
        ...(isDisabled && {
          cursor: 'not-allowed',
          opacity: 0.4,
        }),
      };
    }}
    {...args}
  >
    {args.children ?? 'Link'}
  </Link>
);

export const Button = {
  render: Base,
  args: { children: 'Button', as: 'button', onPress: () => alert('Press!') },
};

export const Disabled = {
  render: Base,
  args: { isDisabled: true, children: 'Disabled Link' },
};
