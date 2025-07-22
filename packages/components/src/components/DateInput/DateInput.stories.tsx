import { useState } from 'react';

import {
  now,
  today,
  parseDate,
  getLocalTimeZone,
  parseZonedDateTime,
} from '@internationalized/date';
import { IconCalendarO16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { useDateFormatter } from '../../index';
import { ButtonToggle, ButtonToggleGroup } from '../ButtonToggleGroup';
import { FlexBox } from '../FlexBox';
import { Grid } from '../Grid';
import { Provider } from '../Provider';
import { Typography } from '../Typography';

import { DateInput, dateInputPropVariant } from './index.js';

const meta = {
  title: 'Components/DateInput',
  component: DateInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => <DateInput label="Date" isLabelHidden {...args} />,
};

export const States: Story = {
  render: () => (
    <Grid gap="m" cols={{ xs: 1, s: 2, m: 2, l: 2 }}>
      <DateInput label="Date" errorMessage="isInvalid" isInvalid />
      <DateInput
        label="Date"
        caption="isDisabled"
        defaultValue={today(getLocalTimeZone())}
        isDisabled
      />
      <DateInput label="Date" caption="isRequired" isRequired />
      <DateInput
        label="Date"
        caption="isReadOnly"
        defaultValue={today(getLocalTimeZone())}
        isReadOnly
      />
    </Grid>
  ),
};

export const Variant: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {dateInputPropVariant.map((variant) => (
          <DateInput
            key={variant}
            variant={variant}
            aria-label="variant"
            {...args}
          />
        ))}
      </FlexBox>
    );
  },
};

export const Addons: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        <DateInput
          label="startAddon"
          startAddon={<IconCalendarO16 />}
          {...args}
        />
        <DateInput label="endAddon" endAddon={<IconCalendarO16 />} {...args} />
      </FlexBox>
    );
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render(args) {
    return <DateInput aria-label="fullWidth" fullWidth {...args} />;
  },
};

export const Uncontrolled: Story = {
  render: function Render() {
    return (
      <DateInput
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
        <DateInput
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
          <DateInput aria-label="Event date" />
        </Provider>
      </FlexBox>
    );
  },
};

export const DateTime: Story = {
  render: function Render() {
    const today = parseZonedDateTime(now(getLocalTimeZone()).toString());
    const [value, setValue] = useState(today);

    return (
      <DateInput
        hideTimeZone
        hourCycle={24}
        value={value}
        onChange={(newValue) => setValue(newValue!)}
        label="Event date"
      />
    );
  },
};
