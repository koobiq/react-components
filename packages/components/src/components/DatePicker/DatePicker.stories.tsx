import { useState } from 'react';

import { getLocalTimeZone, parseDate } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';

import {
  ButtonToggle,
  ButtonToggleGroup,
  FlexBox,
  Provider,
  Typography,
  useDateFormatter,
} from '../../index';

import { DatePicker } from './DatePicker';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => <DatePicker label="Birth day" />,
};

export const Uncontrolled: Story = {
  render: function Render() {
    return (
      <DatePicker
        label="Date (uncontrolled)"
        defaultValue={parseDate('2025-02-03')}
      />
    );
  },
};

export const Controlled: Story = {
  render: function Render() {
    const [value, setValue] = useState(parseDate('2025-02-03'));
    const formatter = useDateFormatter({ dateStyle: 'full' });

    return (
      <FlexBox gap="m" direction="column" alignItems="center">
        <DatePicker
          label="Date (controlled)"
          value={value}
          onChange={(newValue) => setValue(newValue!)}
        />
        <Typography>
          Selected date:{' '}
          {value ? formatter.format(value.toDate(getLocalTimeZone())) : '--'}
        </Typography>
      </FlexBox>
    );
  },
};

export const Locale: Story = {
  render: function Render() {
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
          <DatePicker aria-label="Event date" />
        </Provider>
      </FlexBox>
    );
  },
};
