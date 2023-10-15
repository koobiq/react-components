import type { CSSProperties } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { spacing, spacingGap, type SpacingProps } from './spacing';

const meta = {
  title: 'Mixins/spacing',
  component: spacing,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    m: {
      description: 'margin',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    mb: {
      description: 'margin-block',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    mi: {
      description: 'margin-inline',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    mis: {
      description: 'margin-inline-start',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    mbe: {
      description: 'margin-block-end',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    mie: {
      description: 'margin-inline-end',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    mbs: {
      description: 'margin-block-start',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    p: {
      description: 'padding',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    pb: {
      description: 'padding-block',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    pi: {
      description: 'padding-inline',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    pis: {
      description: 'padding-inline-start',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    pbe: {
      description: 'padding-block-end',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    pie: {
      description: 'padding-inline-end',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
    pbs: {
      description: 'padding-block-start',
      options: spacingGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'SpacingGap' },
      },
    },
  },
  args: {
    p: 'xl',
    m: 'xl',
    mi: '3xl',
  },
} satisfies Meta<typeof spacing>;

export default meta;
type Story = StoryObj<typeof meta>;

const wrapperStyle = {
  backgroundColor: '#b3d1ff',
  display: 'inline-block',
} as CSSProperties;

const blockStyle = {
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#06f',
} as CSSProperties;

export const Example: Story = (props: SpacingProps) => (
  <div style={wrapperStyle}>
    <div style={blockStyle} className={spacing(props)}>
      Content
    </div>
  </div>
);

Example.storyName = 'Example';
