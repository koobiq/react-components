import { useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconEye16,
  IconEyeSlash16,
  IconMagnifyingGlass16,
} from '@koobiq/react-icons';
import * as Icons from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { AnimatedIcon } from '../AnimatedIcon';
import { DatePicker } from '../DatePicker';
import type { FormControlProps } from '../FieldComponents';
import { FlexBox } from '../FlexBox';
import { IconButton } from '../IconButton';
import { InputNumber } from '../InputNumber';
import { SearchInput } from '../SearchInput';
import { Select } from '../Select';
import { Textarea } from '../Textarea';
import { TimePicker } from '../TimePicker';
import { Typography } from '../Typography';

import { Input, inputPropVariant } from './index';

const mappingIcons = Object.entries(Icons).reduce((acc, [key, Icon]) => ({
  ...acc,
  [key]: <Icon />,
}));

const meta = {
  title: 'Components/Input',
  component: Input,
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
    endAddon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <Input
      label="Name"
      placeholder="Sophia"
      maxLength={100}
      caption="Maximum 100 characters"
      {...args}
    />
  ),
};

export const Variant: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {inputPropVariant.map((variant) => (
          <Input
            key={variant}
            variant={variant}
            aria-label="variant"
            placeholder={`variant = ${variant}`}
            startAddon={<IconMagnifyingGlass16 />}
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
        {inputPropVariant.map((variant) => (
          <Input
            key={variant}
            variant={variant}
            aria-label="error"
            placeholder={`variant = ${variant}`}
            startAddon={<IconMagnifyingGlass16 />}
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
      <Input
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
        {inputPropVariant.map((variant) => (
          <Input
            key={variant}
            variant={variant}
            caption="disabled"
            aria-label="disabled"
            placeholder={`variant = ${variant}`}
            startAddon={<IconMagnifyingGlass16 />}
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
        <Input
          label="Name"
          caption="required"
          placeholder="Sophia"
          isRequired
          {...args}
        />
        <Input
          label="Name"
          caption="required, without an indicator"
          placeholder="Sophia"
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
      <Input
        label="Name"
        caption="read-only"
        defaultValue="Sophia"
        placeholder="read-only"
        isReadOnly
        {...args}
      />
    );
  },
};

export const Autofill: Story = {
  render: (args) => (
    <FlexBox gap="m" direction="column" style={{ inlineSize: 220 }}>
      <Typography>
        Click on the text box and choose any option suggested by your browser.
      </Typography>
      <Input
        id="name"
        name="name"
        aria-label="autofill"
        placeholder="Autofill"
        fullWidth
        {...args}
      />
    </FlexBox>
  ),
};

export const Addons: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        <Input
          label="startAddon"
          startAddon={<IconMagnifyingGlass16 />}
          placeholder="Seacrh"
          {...args}
        />
        <Input
          label="endAddon"
          endAddon={<IconMagnifyingGlass16 />}
          placeholder="Seacrh"
          {...args}
        />
      </FlexBox>
    );
  },
};

export const LabelPlacementAlignment: Story = {
  name: 'Label placement and alignment',
  render: (args) => (
    <Input
      label="Name"
      placeholder="Sophia"
      maxLength={100}
      caption="Maximum 100 characters"
      labelPlacement="side"
      labelAlign="end"
      fullWidth
      {...args}
    />
  ),
};

export const DefaultValue: Story = {
  render: function Render(args) {
    return (
      <Input
        label="Name"
        defaultValue="Sophia"
        placeholder="Sophia"
        {...args}
      />
    );
  },
};

export const ControlledValue: Story = {
  render: function Render(args) {
    const [value, setState] = useState('Sophia');

    return (
      <FlexBox gap="m" direction="column" alignItems="stretch">
        <Input
          label="Name"
          value={value}
          onChange={setState}
          placeholder="Sophia"
          {...args}
        />
        <Typography ellipsis>Current value: {value}</Typography>
      </FlexBox>
    );
  },
};

export const Password: Story = {
  render: function Render(args) {
    const [hiddenPassword, { toggle }] = useBoolean(true);

    return (
      <Input
        label="Password"
        placeholder="Password"
        defaultValue="p@ssw0rd"
        {...(hiddenPassword && { type: 'password' })}
        endAddon={
          <IconButton
            onPress={toggle}
            variant="fade-contrast"
            style={{ marginInlineEnd: '-8px' }}
            aria-label={hiddenPassword ? 'show password' : 'hide password'}
            preventFocusOnPress
          >
            <AnimatedIcon
              activeIndex={+hiddenPassword}
              icons={[
                <IconEye16 key="eye" />,
                <IconEyeSlash16 key="eye-slash" />,
              ]}
            />
          </IconButton>
        }
        {...args}
      />
    );
  },
};

export const Composition: Story = {
  render: () => {
    const containerStyle = {
      display: 'table',
      borderSpacing: '0 var(--kbq-size-m)',
      width: 400,
    };

    const labelProps: Pick<FormControlProps, 'labelPlacement' | 'labelAlign'> =
      {
        labelPlacement: 'side',
        labelAlign: 'end',
      };

    const formControlProps = {
      style: { display: 'table-row' },
      slotProps: {
        label: { style: { display: 'table-cell' } },
      },
      ...labelProps,
      fullWidth: true,
    };

    return (
      <form style={containerStyle}>
        <Select
          label="Select"
          placeholder="Select an option"
          {...formControlProps}
        >
          <Select.Item key="1">Option 1</Select.Item>
          <Select.Item key="2">Option 2</Select.Item>
          <Select.Item key="3">Option 3</Select.Item>
        </Select>
        <Input
          label="Input"
          placeholder="Type a word..."
          {...formControlProps}
        />
        <Textarea
          label="Textarea"
          placeholder="Type a word..."
          {...formControlProps}
        />
        <InputNumber
          label="InputNumber"
          placeholder="Type a number..."
          {...formControlProps}
        />
        <SearchInput
          label="SearchInput"
          placeholder="Type a word..."
          {...formControlProps}
        />
        <TimePicker label="TimePicker" {...formControlProps} />
        <DatePicker label="DatePicker" {...formControlProps} />
      </form>
    );
  },
};
