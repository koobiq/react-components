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
import { Button } from '../Button';
import { DatePicker } from '../DatePicker';
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

export const LabelPlacement: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="column" style={{ width: 400 }}>
      <Input
        label="Name"
        placeholder="Sophia"
        maxLength={100}
        caption="Maximum 100 characters"
        fullWidth
        {...args}
      />
      <Input
        label="Name"
        placeholder="Sophia"
        maxLength={100}
        caption="Maximum 100 characters"
        labelPlacement="side"
        fullWidth
        {...args}
      />
      <Select
        labelPlacement="side"
        label="Attack type"
        placeholder="Select an option"
        fullWidth
      >
        <Select.Item key="bruteforce">Bruteforce</Select.Item>
        <Select.Item key="complex-attack">Complex Attack</Select.Item>
        <Select.Item key="ddos">DDoS</Select.Item>
        <Select.Item key="dos">DoS</Select.Item>
        <Select.Item key="hips-alert">HIPS Alert</Select.Item>
        <Select.Item key="ids-ips-alert">IDS/IPS Alert</Select.Item>
        <Select.Item key="identity-theft">Identity Theft</Select.Item>
        <Select.Item key="miscellaneous">Miscellaneous</Select.Item>
        <Select.Item key="network-attack">Network Attack</Select.Item>
        <Select.Item key="post-compromise">Post Compromise</Select.Item>
        <Select.Item key="potential-attack">Potential Attack</Select.Item>
      </Select>
      <div
        style={{
          display: 'table',
          borderSpacing: '0 var(--kbq-size-m)',
          width: 400,
        }}
      >
        <Select
          labelPlacement="side"
          style={{ display: 'table-row' }}
          slotProps={{
            label: { style: { display: 'table-cell' } },
          }}
          label="Attack type"
          labelAlign="end"
          placeholder="Select an option"
          fullWidth
        >
          <Select.Item key="bruteforce">Bruteforce</Select.Item>
          <Select.Item key="complex-attack">Complex Attack</Select.Item>
          <Select.Item key="ddos">DDoS</Select.Item>
          <Select.Item key="dos">DoS</Select.Item>
          <Select.Item key="hips-alert">HIPS Alert</Select.Item>
          <Select.Item key="ids-ips-alert">IDS/IPS Alert</Select.Item>
          <Select.Item key="identity-theft">Identity Theft</Select.Item>
          <Select.Item key="miscellaneous">Miscellaneous</Select.Item>
          <Select.Item key="network-attack">Network Attack</Select.Item>
          <Select.Item key="post-compromise">Post Compromise</Select.Item>
          <Select.Item key="potential-attack">Potential Attack</Select.Item>
        </Select>
        <Input
          label="Name"
          placeholder="Sophia"
          maxLength={100}
          labelPlacement="side"
          style={{ display: 'table-row' }}
          slotProps={{
            label: { style: { display: 'table-cell' } },
          }}
          fullWidth
          {...args}
        />
        <Input
          label="Long name for a test"
          placeholder="Sophia"
          maxLength={100}
          caption="Maximum 100 characters"
          labelPlacement="side"
          style={{ display: 'table-row' }}
          slotProps={{
            label: { style: { display: 'table-cell' } },
          }}
          fullWidth
          {...args}
        />
        <Textarea
          label="Tell us your story"
          placeholder="Your story"
          labelPlacement="side"
          defaultValue="It was a dark and stormy night..."
          style={{ display: 'table-row' }}
          slotProps={{
            label: { style: { display: 'table-cell' } },
          }}
          fullWidth
        />
        <InputNumber
          label="Age"
          placeholder="Enter your age"
          minValue={0}
          defaultValue={25}
          labelPlacement="side"
          style={{ display: 'table-row' }}
          slotProps={{
            label: { style: { display: 'table-cell' } },
          }}
          fullWidth
        />
        <SearchInput
          label="Search"
          placeholder="Type a word..."
          style={{ display: 'table-row' }}
          labelPlacement="side"
          slotProps={{
            label: { style: { display: 'table-cell' } },
          }}
          fullWidth
        />
        <TimePicker
          label="Time"
          style={{ display: 'table-row' }}
          labelPlacement="side"
          slotProps={{
            label: { style: { display: 'table-cell' } },
          }}
          fullWidth
        />
        <DatePicker
          style={{ display: 'table-row' }}
          slotProps={{
            label: { style: { display: 'table-cell' } },
          }}
          labelPlacement="side"
          label="Date (uncontrolled)"
          fullWidth
        />
      </div>
    </FlexBox>
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
  render: (args) => (
    <FlexBox gap="m">
      <Input aria-label="input" placeholder="Placeholder" {...args} />
      <Button>Button</Button>
    </FlexBox>
  ),
};
