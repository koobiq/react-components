import { useState } from 'react';

import { IconRuler16 } from '@koobiq/react-icons';
import * as Icons from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { Grid, GridItem } from '../Grid';
import { Typography } from '../Typography';

import { InputNumber, inputNumberPropVariant } from './index';

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
  render: (args) => (
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
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {inputNumberPropVariant.map((variant) => (
          <InputNumber
            key={variant}
            variant={variant}
            aria-label="variant"
            placeholder={`variant = ${variant}`}
            {...args}
          />
        ))}
      </FlexBox>
    );
  },
};

export const Invalid: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {inputNumberPropVariant.map((variant) => (
          <InputNumber
            key={variant}
            variant={variant}
            aria-label="error"
            placeholder={`variant = ${variant}`}
            errorMessage="This field is required"
            isInvalid
            {...args}
          />
        ))}
      </FlexBox>
    );
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render(args) {
    return (
      <InputNumber
        aria-label="fullWidth"
        placeholder="fullWidth"
        fullWidth
        {...args}
      />
    );
  },
};

export const Disabled: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {inputNumberPropVariant.map((variant) => (
          <InputNumber
            key={variant}
            variant={variant}
            caption="disabled"
            aria-label="disabled"
            placeholder={`variant = ${variant}`}
            isDisabled
            {...args}
          />
        ))}
      </FlexBox>
    );
  },
};

export const Required: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        <InputNumber
          label="Number"
          caption="required"
          placeholder="Enter a number"
          isRequired
          {...args}
        />
        <InputNumber
          label="Number"
          caption="required, without an indicator"
          placeholder="Enter a number"
          slotProps={{ label: { isRequired: false } }}
          isRequired
          {...args}
        />
      </FlexBox>
    );
  },
};

export const ReadOnly: Story = {
  render: function Render(args) {
    return (
      <InputNumber
        label="Number"
        caption="read-only"
        defaultValue={100}
        placeholder="read-only"
        isReadOnly
        {...args}
      />
    );
  },
};

export const Addons: Story = {
  render: function Render(args) {
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

export const LabelPlacementAlignment: Story = {
  name: 'Label placement and alignment',
  render: (args) => (
    <InputNumber
      label="Age"
      placeholder="Enter your age"
      labelPlacement="side"
      labelAlign="end"
      {...args}
    />
  ),
};

export const DefaultValue: Story = {
  render: function Render(args) {
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
  render: function Render(args) {
    const [value, setState] = useState(100);

    return (
      <FlexBox gap="m" direction="column" alignItems="stretch">
        <InputNumber
          label="Number"
          onChange={setState}
          value={value}
          placeholder="Enter a number"
          {...args}
        />
        <Typography ellipsis>Current value: {value}</Typography>
      </FlexBox>
    );
  },
};

export const NumberFormatting: Story = {
  name: 'Number formatting',
  render: function Render(args) {
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

export const Validation: Story = {
  render: (args) => (
    <Form>
      <InputNumber
        label="Width"
        name="width"
        isRequired
        validationBehavior="native"
        {...args}
      />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const MinimumMaximumValues: Story = {
  name: 'Minimum and maximum',
  render: function Render(args) {
    return (
      <InputNumber
        label="Age"
        defaultValue={1}
        minValue={0}
        placeholder="Enter your age"
        {...args}
      />
    );
  },
};

export const StepValues: Story = {
  name: 'Step values',
  render: function Render() {
    return (
      <FlexBox gap="m" direction="column">
        <InputNumber label="Step" step={10} />
        <InputNumber label="Step + minValue" minValue={2} step={3} />
        <InputNumber
          label="Step + minValue + maxValue"
          minValue={2}
          maxValue={21}
          step={3}
        />
      </FlexBox>
    );
  },
};
