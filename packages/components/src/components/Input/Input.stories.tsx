import { useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconEye16,
  IconEyeSlash16,
  IconGlobe16,
  IconMagnifyingGlass16,
} from '@koobiq/react-icons';
import * as Icons from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { AnimatedIcon } from '../AnimatedIcon';
import { Button } from '../Button';
import { DatePicker } from '../DatePicker';
import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { FormField } from '../FormField';
import { IconButton } from '../IconButton';
import { InputNumber } from '../InputNumber';
import { Radio, RadioGroup } from '../RadioGroup';
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
  tags: ['status:updated'],
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
      <Input
        aria-label="addons"
        caption="startAddon + endAddon"
        startAddon={<Typography>https://</Typography>}
        endAddon={<IconGlobe16 />}
        slotProps={{
          group: {
            slotProps: {
              startAddon: {
                style: { marginInlineEnd: 0, pointerEvents: 'none' },
              },
            },
          },
        }}
        placeholder="yourwebsite.com"
        {...args}
      />
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

export const Validation: Story = {
  render: (args) => (
    <Form>
      <Input
        label="Email"
        name="email"
        type="email"
        isRequired
        validationBehavior="native"
        {...args}
      />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const CreateForm: Story = {
  parameters: {
    layout: 'padded',
  },
  name: 'Create a form',
  render: function Render() {
    return (
      <Form
        labelPlacement={{ xs: 'top', m: 'side' }}
        labelInlineSize="2/5"
        style={{ maxWidth: 400 }}
      >
        <Select label="Select" placeholder="Select an option">
          <Select.Item key="1">Option 1</Select.Item>
          <Select.Item key="2">Option 2</Select.Item>
          <Select.Item key="3">Option 3</Select.Item>
        </Select>
        <Input label="Input" placeholder="Type a word..." />
        <Textarea label="Textarea" placeholder="Type a word..." />
        <InputNumber label="InputNumber" placeholder="Type a number..." />
        <SearchInput label="SearchInput" placeholder="Type a word..." />
        <TimePicker label="TimePicker" />
        <DatePicker label="DatePicker" />
        <RadioGroup label="RadioGroup" defaultValue="windows">
          <Radio value="windows">Windows</Radio>
          <Radio value="macos">macOS</Radio>
          <Radio value="linux">Linux</Radio>
          <Radio value="other">Other</Radio>
        </RadioGroup>
        <FormField>
          <FormField.Label as="span">Inputs</FormField.Label>
          <FlexBox gap="m" style={{ inlineSize: '100%' }}>
            <Input aria-label="first" placeholder="Input 1" />
            <Input aria-label="second" placeholder="Input 2" />
          </FlexBox>
        </FormField>
      </Form>
    );
  },
};
