import type { CSSProperties } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import {
  flex,
  flexPropAlignItems,
  flexPropDirection,
  flexPropFlex,
  flexPropGap,
  flexPropJustifyContent,
  flexPropOrder,
  type FlexProps,
  flexPropWrap,
} from './flex';

const meta = {
  title: 'Mixins/flex',
  component: flex,
  args: {
    gap: 'xl',
  },
  argTypes: {
    alignItems: {
      options: flexPropAlignItems,
      control: { type: 'select' },
      table: {
        type: { summary: 'FlexPropAlignItems' },
      },
    },
    justifyContent: {
      options: flexPropJustifyContent,
      control: { type: 'select' },
      table: {
        type: { summary: 'FlexPropJustifyContent' },
      },
    },
    flex: {
      options: flexPropFlex,
      control: { type: 'select' },
      table: {
        type: { summary: 'FlexPropFlex' },
      },
    },
    wrap: {
      options: flexPropWrap,
      control: { type: 'select' },
      table: {
        type: { summary: 'FlexPropWrap' },
      },
    },
    direction: {
      options: flexPropDirection,
      control: { type: 'select' },
      table: {
        type: { summary: 'FlexPropDirection' },
      },
    },
    gap: {
      options: flexPropGap,
      control: { type: 'select' },
      table: {
        type: { summary: 'FlexPropGap' },
      },
    },
    order: {
      options: flexPropOrder,
      control: { type: 'select' },
      table: {
        type: { summary: 'FlexPropOrder' },
      },
    },
  },
} satisfies Meta<typeof flex>;

export default meta;
type Story = StoryObj<typeof meta>;

const blockStyle = {
  width: '6em',
  color: '#fff',
  height: '3em',
  backgroundColor: '#06f',
} as CSSProperties;

export const Example: Story = (props: FlexProps) => (
  <div className={flex(props)}>
    <div
      style={blockStyle}
      className={flex({
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      item-1
    </div>
    <div
      style={blockStyle}
      className={flex({
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      item-2
    </div>
    <div
      style={blockStyle}
      className={flex({
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      item-3
    </div>
    <div
      style={blockStyle}
      className={flex({
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      item-4
    </div>
    <div
      style={blockStyle}
      className={flex({
        alignItems: 'center',
        justifyContent: 'center',
        order: props.order,
      })}
    >
      item-5
    </div>
  </div>
);

Example.storyName = 'Example';
