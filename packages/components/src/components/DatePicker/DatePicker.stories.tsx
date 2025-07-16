import { useState } from 'react';

import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';

import {
  FlexBox,
  Grid,
  Provider,
  Typography,
  ButtonToggle,
  useDateFormatter,
  ButtonToggleGroup,
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
  render: (args) => <DatePicker label="Birth day" {...args} />,
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

export const States: Story = {
  render: () => (
    <Grid gap="m" cols={{ xs: 1, s: 2, m: 2, l: 2 }}>
      <DatePicker label="Date" errorMessage="isInvalid" isInvalid />
      <DatePicker
        label="Date"
        caption="isDisabled"
        defaultValue={today(getLocalTimeZone())}
        isDisabled
      />
      <DatePicker label="Date" caption="isRequired" isRequired />
      <DatePicker
        label="Date"
        caption="isReadOnly"
        defaultValue={today(getLocalTimeZone())}
        isReadOnly
      />
    </Grid>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render(args) {
    return <DatePicker aria-label="fullWidth" fullWidth {...args} />;
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

export const MinMaxValues: Story = {
  name: 'MinValue and MaxValue',
  render: function Render() {
    const [value, setValue] = useState(parseDate('2025-05-01'));

    return (
      <DatePicker
        value={value}
        aria-label="Event date"
        minValue={today(getLocalTimeZone())}
        onChange={(value) => setValue(value!)}
        maxValue={today(getLocalTimeZone()).add({ months: 8 })}
      />
    );
  },
};
