import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ButtonToggle, ButtonToggleGroup } from '../ButtonToggleGroup';
import { FlexBox } from '../FlexBox';
import { Provider } from '../Provider';

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

const containerStyle = {
  borderRadius: 'var(--kbq-size-m)',
  boxShadow: 'var(--kbq-shadow-overlay)',
};

export const Base: Story = {
  render: function Render(args: CalendarProps) {
    return (
      <div style={containerStyle}>
        <Calendar aria-label="Event date" {...args} />
      </div>
    );
  },
};

export const Locale: Story = {
  render: function Render(args: CalendarProps) {
    const [selected, setSelected] = useState<string | number>('system');

    return (
      <FlexBox direction="column" gap="l">
        <ButtonToggleGroup
          selectedKey={selected}
          onSelectionChange={setSelected}
        >
          <ButtonToggle id="system">System</ButtonToggle>
          <ButtonToggle id="english">English</ButtonToggle>
        </ButtonToggleGroup>
        <Provider locale={selected === 'system' ? undefined : 'en-US'}>
          <div style={containerStyle}>
            <Calendar
              aria-label="Event date"
              firstDayOfWeek={selected === 'system' ? undefined : 'sun'}
              {...args}
            />
          </div>
        </Provider>
      </FlexBox>
    );
  },
};

export const Disabled: Story = {
  render: function Render(args: CalendarProps) {
    return (
      <div style={containerStyle}>
        <Calendar aria-label="Event date" isDisabled {...args} />
      </div>
    );
  },
};
