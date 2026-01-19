import { type CSSProperties, useState } from 'react';

import type { Meta } from '@storybook/react';

import { Button, type ButtonProps } from './index.js';

import './__stroies__/style.css';

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Button>;

export default meta;

const LoadingIcon = () => (
  <svg
    style={{
      inlineSize: 20,
      blockSize: 20,
      animation: 'spin 1s linear infinite',
    }}
    fill="none"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      style={{ opacity: 0.25 }}
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      style={{ opacity: 0.75 }}
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      fill="currentColor"
    ></path>
  </svg>
);

export const Base = (args: ButtonProps) => {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  return (
    <Button
      style={({
        isHovered,
        isPressed,
        isFocusVisible,
        isDisabled,
        isLoading,
      }) => {
        const commonStyle: CSSProperties = {
          paddingInline: 16,
          fontSize: 16,
          color: '#fff',
          border: 'none',
          gap: '0.5em',
          display: 'inline-flex',
          alignItems: 'center',
          position: 'relative',
          outline: 'none',
          blockSize: 40,
          outlineWidth: 2,
          overflow: 'hidden',
          borderRadius: 12,
          cursor: 'pointer',
          outlineOffset: 2,
          outlineStyle: 'solid',
          textDecoration: 'none',
          outlineColor: 'transparent',
          fontFamily: 'Inter, Arial, sans-serif',
          transition:
            'opacity 120ms ease-in-out, transform 120ms ease-in-out, outline-color 120ms ease-in-out',
          background: '#06f',
        };

        return {
          ...commonStyle,
          ...(isHovered && { opacity: 0.9 }),
          ...(isPressed && { opacity: 0.9, transform: 'scale(0.95)' }),
          ...(isFocusVisible && {
            outlineColor: '#06f',
          }),
          ...(isLoading && {
            cursor: 'default',
            opacity: 1,
            transform: 'scale(1)',
          }),
          ...(isDisabled && {
            cursor: 'not-allowed',
            opacity: 0.4,
          }),
        };
      }}
      {...args}
      onPress={(e) => {
        setCoords({ x: e.x, y: e.y });
        args?.onPress?.(e);
      }}
    >
      {({ isLoading }) => (
        <>
          {isLoading && <LoadingIcon />}
          {args.children ?? 'Button'}
          {coords && (
            <div
              key={`${coords.x},${coords.y}`}
              style={{
                width: '2em',
                height: '2em',
                left: coords.x - 15,
                top: coords.y - 15,
                position: 'absolute',
                borderRadius: '9999px',
                animation: 'ripple 600ms linear forwards',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
              }}
              onAnimationEnd={() => setCoords(null)}
            />
          )}
        </>
      )}
    </Button>
  );
};

export const Link = {
  render: Base,
  args: { as: 'a', href: 'https://react.koobiq.io', children: 'Link' },
};

export const Disabled = {
  render: Base,
  args: { isDisabled: true },
};

export const Loading = {
  render: Base,
  args: { isLoading: true, children: 'Loading' },
};
