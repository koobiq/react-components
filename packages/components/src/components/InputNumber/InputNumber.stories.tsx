import { useState } from 'react';

import { IconRuler16 } from '@koobiq/react-icons';
import * as Icons from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Grid, GridItem } from '../Grid';
import { flex } from '../layout';
import { useBreakpoints } from '../Provider';
import { Typography } from '../Typography';

import {
  InputNumber,
  type InputNumberProps,
  inputNumberPropVariant,
} from './index';

const mappingIcons = Object.entries(Icons).reduce((acc, [key, Icon]) => ({
  ...acc,
  [key]: <Icon />,
}));

const meta = {
  title: 'Components/InputNumber',
  component: InputNumber,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    startAddon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof InputNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: InputNumberProps) => (
    <InputNumber
      label="Age"
      placeholder="Enter your age"
      minValue={0}
      defaultValue={25}
      {...args}
    />
  ),
};

export const Variant: Story = {
  render: function Render(args) {
    const { l } = useBreakpoints();

    return (
      <div className={flex({ gap: 'm', direction: l ? 'row' : 'column' })}>
        {inputNumberPropVariant.map((variant) => (
          <InputNumber
            key={variant}
            variant={variant}
            aria-label="variant"
            placeholder={`variant = ${variant}`}
            {...args}
          />
        ))}
      </div>
    );
  },
};

export const Error: Story = {
  render: function Render(args: InputNumberProps) {
    const { l } = useBreakpoints();

    return (
      <div className={flex({ gap: 'm', direction: l ? 'row' : 'column' })}>
        {inputNumberPropVariant.map((variant) => (
          <InputNumber
            key={variant}
            variant={variant}
            aria-label="error"
            placeholder={`variant = ${variant}`}
            errorMessage="This field is required"
            error
            {...args}
          />
        ))}
      </div>
    );
  },
};

export const FullWidth: Story = {
  render: function Render(args: InputNumberProps) {
    const { l } = useBreakpoints();

    return (
      <div style={{ inlineSize: l ? 320 : 260 }}>
        <InputNumber
          aria-label="fullWidth"
          placeholder="fullWidth"
          fullWidth
          {...args}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function Render(args: InputNumberProps) {
    const { l } = useBreakpoints();

    return (
      <div className={flex({ gap: 'm', direction: l ? 'row' : 'column' })}>
        {inputNumberPropVariant.map((variant) => (
          <InputNumber
            key={variant}
            variant={variant}
            caption="disabled"
            aria-label="disabled"
            placeholder={`variant = ${variant}`}
            disabled
            {...args}
          />
        ))}
      </div>
    );
  },
};

export const Required: Story = {
  render: function Render(args: InputNumberProps) {
    const { l } = useBreakpoints();

    return (
      <div className={flex({ gap: 'm', direction: l ? 'row' : 'column' })}>
        <InputNumber
          label="Number"
          caption="required"
          placeholder="Enter a number"
          required
          {...args}
        />
        <InputNumber
          label="Number"
          caption="required, without indicator"
          placeholder="Enter a number"
          slotProps={{ label: { required: false } }}
          required
          {...args}
        />
      </div>
    );
  },
};

export const ReadOnly: Story = {
  render: function Render(args: InputNumberProps) {
    return (
      <InputNumber
        label="Number"
        caption="read-only"
        defaultValue={100}
        placeholder="read-only"
        readonly
        {...args}
      />
    );
  },
};

export const Addons: Story = {
  render: function Render(args: InputNumberProps) {
    return (
      <InputNumber
        label="addon"
        startAddon={<IconRuler16 />}
        defaultValue={30}
        formatOptions={{
          style: 'unit',
          unit: 'centimeter',
          unitDisplay: 'short',
        }}
        placeholder="Centimeter"
        {...args}
      />
    );
  },
};

export const DefaultValue: Story = {
  render: function Render(args: InputNumberProps) {
    return (
      <InputNumber
        label="Number"
        defaultValue={100}
        placeholder="Enter a number"
        {...args}
      />
    );
  },
};

export const ControlledValue: Story = {
  render: function Render(args: InputNumberProps) {
    const [value, setState] = useState(100);

    return (
      <div
        className={flex({
          gap: 'm',
          direction: 'column',
          alignItems: 'stretch',
        })}
      >
        <InputNumber
          label="Number"
          onChange={setState}
          value={value}
          placeholder="Enter a number"
          {...args}
        />
        <Typography ellipsis>Current value: {value}</Typography>
      </div>
    );
  },
};

export const NumberFormatting: Story = {
  name: 'Number formatting',
  render: function Render(args: InputNumberProps) {
    return (
      <Grid cols={{ xs: 1, s: 2, m: 3 }} gap="xl">
        <GridItem>
          <InputNumber
            label="Decimals"
            defaultValue={0.5}
            placeholder="Enter a number"
            formatOptions={{
              signDisplay: 'exceptZero',
              minimumFractionDigits: 1,
              maximumFractionDigits: 2,
            }}
            fullWidth
            {...args}
          />
        </GridItem>
        <GridItem>
          <InputNumber
            label="Currency"
            defaultValue={1000}
            placeholder="Enter a number"
            formatOptions={{
              style: 'currency',
              currency: 'EUR',
              currencyDisplay: 'symbol',
            }}
            fullWidth
            {...args}
          />
        </GridItem>
        <GridItem>
          <InputNumber
            label="Percent"
            defaultValue={0.6}
            placeholder="Enter a number"
            formatOptions={{
              style: 'percent',
              minimumFractionDigits: 1,
              maximumFractionDigits: 2,
            }}
            fullWidth
            {...args}
          />
        </GridItem>
        <GridItem>
          <InputNumber
            label="Sign display"
            defaultValue={50}
            placeholder="Enter a number"
            formatOptions={{ signDisplay: 'always' }}
            fullWidth
            {...args}
          />
        </GridItem>
        <GridItem>
          <InputNumber
            label="Temperature"
            defaultValue={10}
            placeholder="Enter a number"
            formatOptions={{
              style: 'unit',
              unit: 'celsius',
              unitDisplay: 'short',
            }}
            fullWidth
            {...args}
          />
        </GridItem>
        <GridItem>
          <InputNumber
            label="Engineering"
            defaultValue={123456789}
            placeholder="Enter a number"
            formatOptions={{
              notation: 'engineering',
            }}
            fullWidth
            {...args}
          />
        </GridItem>
      </Grid>
    );
  },
};

export const MinimumMaximumValues: Story = {
  name: 'Minimum and maximum',
  render: function Render(args: InputNumberProps) {
    return (
      <InputNumber
        label="Age"
        defaultValue={1}
        minValue={0}
        placeholder="Enter a your agr"
        {...args}
      />
    );
  },
};

export const StepValues: Story = {
  name: 'Step values',
  render: function Render() {
    return (
      <div
        className={flex({
          gap: 'm',
          direction: 'column',
        })}
      >
        <InputNumber label="Step" step={10} />
        <InputNumber label="Step + minValue" minValue={2} step={3} />
        <InputNumber
          label="Step + minValue + maxValue"
          minValue={2}
          maxValue={21}
          step={3}
        />
      </div>
    );
  },
};
