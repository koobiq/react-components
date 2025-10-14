import { useState } from 'react';

import { Time, parseAbsoluteToLocal } from '@internationalized/date';
import { IconInfoCircle16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import {
  ButtonToggle,
  ButtonToggleGroup,
  Provider,
  Typography,
  useDateFormatter,
} from '../../index';
import { dateInputPropVariant } from '../DateInput';
import { FlexBox } from '../FlexBox';
import { Grid } from '../Grid';

import { TimePicker } from './index.js';

const meta = {
  title: 'Components/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => <TimePicker label="Time" {...args} />,
};

export const States: Story = {
  render: () => (
    <Grid gap="m" cols={{ xs: 1, s: 2, m: 2, l: 2 }}>
      <TimePicker
        label="Time"
        errorMessage="isInvalid"
        defaultValue={new Time(11, 45)}
        isInvalid
      />
      <TimePicker
        label="Time"
        caption="isDisabled"
        defaultValue={new Time(11, 45)}
        isDisabled
      />
      <TimePicker
        label="Time"
        caption="isRequired"
        defaultValue={new Time(11, 45)}
        isRequired
      />
      <TimePicker
        label="Time"
        caption="isReadOnly"
        defaultValue={new Time(11, 45)}
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
          <TimePicker
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
      <TimePicker
        label="Addon"
        endAddon={<IconInfoCircle16 />}
        isLabelHidden
        {...args}
      />
    );
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render(args) {
    return <TimePicker aria-label="fullWidth" fullWidth {...args} />;
  },
};

export const LabelPlacementAlignment: Story = {
  name: 'Label placement and alignment',
  render: (args) => (
    <TimePicker label="Time" labelPlacement="side" labelAlign="end" {...args} />
  ),
};

export const Uncontrolled: Story = {
  render: function Render() {
    return (
      <TimePicker
        label="Date (uncontrolled)"
        defaultValue={parseAbsoluteToLocal('2025-04-07T12:30:00Z')}
      />
    );
  },
};

export const Controlled: Story = {
  render: function Render() {
    const [date, setDate] = useState(
      parseAbsoluteToLocal('2025-04-07T12:30:00Z')
    );

    const formatter = useDateFormatter({
      dateStyle: 'long',
      timeStyle: 'long',
    });

    return (
      <FlexBox gap="m" direction="column" alignItems="center">
        <TimePicker
          label="Date (controlled)"
          value={date}
          onChange={(newValue) => setDate(newValue!)}
        />
        <Typography>
          Selected date and time:{' '}
          {(date?.toDate && formatter.format(date.toDate())) ||
            (date && date.toString()) ||
            '--'}
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
          <TimePicker aria-label="Event date" />
        </Provider>
      </FlexBox>
    );
  },
};

export const MinMaxValues: Story = {
  render: function Render() {
    return (
      <TimePicker
        label="Meeting time"
        minValue={new Time(9)}
        maxValue={new Time(17)}
        defaultValue={new Time(8)}
      />
    );
  },
};
