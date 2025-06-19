import type { Meta, StoryObj } from '@storybook/react';

import { Calendar, type CalendarProps } from './index.js';

const meta = {
  title: 'Components/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: function Render(args: CalendarProps) {
    const containerStyle = {
      borderRadius: 'var(--kbq-size-m)',
      boxShadow: 'var(--kbq-shadow-overlay)',
    };

    return (
      <div style={containerStyle}>
        <Calendar aria-label="Event date" {...args} />
      </div>
    );
  },
};
