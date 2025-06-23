import { useState } from 'react';

import type { DateValue } from '@koobiq/react-primitives';
import {
  today,
  isWeekend,
  parseDate,
  CalendarDate,
  getLocalTimeZone,
} from '@koobiq/react-primitives';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { ButtonToggle, ButtonToggleGroup } from '../ButtonToggleGroup';
import { FlexBox } from '../FlexBox';
import { Provider, useLocale } from '../Provider';

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
  render: function Render(args: CalendarProps<DateValue>) {
    return (
      <div style={containerStyle}>
        <Calendar aria-label="Event date" {...args} />
      </div>
    );
  },
};

export const Value: Story = {
  render: function Render() {
    const [value, setValue] = useState(parseDate('2025-02-03'));

    return (
      <FlexBox gap="l">
        <Calendar
          aria-label="Date (uncontrolled)"
          defaultValue={parseDate('2025-02-03')}
        />
        <Calendar
          aria-label="Date (controlled)"
          value={value}
          onChange={setValue}
        />
      </FlexBox>
    );
  },
};

export const Locale: Story = {
  render: function Render(args: CalendarProps<DateValue>) {
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
  render: function Render(args: CalendarProps<DateValue>) {
    return (
      <div style={containerStyle}>
        <Calendar aria-label="Event date" isDisabled {...args} />
      </div>
    );
  },
};

export const MinMaxValues: Story = {
  name: 'MinValue and MaxValue',
  render: function Render(args: CalendarProps<DateValue>) {
    const [value, setValue] = useState<DateValue>(parseDate('2025-05-01'));

    return (
      <div style={containerStyle}>
        <Calendar
          aria-label="Event date"
          minValue={today(getLocalTimeZone())}
          maxValue={today(getLocalTimeZone()).add({ months: 8 })}
          value={value}
          onChange={setValue}
          {...args}
        />
      </div>
    );
  },
};

export const UnavailableDates: Story = {
  name: 'Unavailable dates',
  render: function Render() {
    const { locale } = useLocale();

    const isDateUnavailable = (date: DateValue) => isWeekend(date, locale);

    return (
      <Calendar
        aria-label="Appointment date"
        isDateUnavailable={isDateUnavailable}
      />
    );
  },
};

export const FocusedDate: Story = {
  name: 'Controlling the focused date',
  render: function Render() {
    const defaultDate = new CalendarDate(2024, 7, 1);
    const [focusedDate, setFocusedDate] = useState(defaultDate);

    return (
      <FlexBox direction="column" gap="l" alignItems="center">
        <Button onPress={() => setFocusedDate(defaultDate)}>
          Reset focused date
        </Button>
        <Calendar focusedValue={focusedDate} onFocusChange={setFocusedDate} />
      </FlexBox>
    );
  },
};
