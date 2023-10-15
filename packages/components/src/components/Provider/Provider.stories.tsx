import type { Meta, StoryObj } from '@storybook/react';

import { Typography } from '../Typography';

import { Provider, useBreakpoints } from './index';

const meta = {
  title: 'Components/Provider',
  component: Provider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Provider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Breakpoints: Story = {
  render: function Render() {
    const { s } = useBreakpoints();
    const isMobile = !s;

    return (
      <Typography variant={isMobile ? 'text-compact' : 'text-big'}>
        Text
      </Typography>
    );
  },
};
