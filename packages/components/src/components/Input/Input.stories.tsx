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
import { FlexBox } from '../FlexBox';
import { IconButton } from '../IconButton';
import { useBreakpoints } from '../Provider';
import { Typography } from '../Typography';

import { Input, type InputProps, inputPropVariant } from './index';

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
  render: (args: InputProps) => (
    <Input
      label="Name"
      placeholder="Sophia"
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

export const Error: Story = {
  render: function Render(args: InputProps) {
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
            error
            {...args}
          />
        ))}
      </FlexBox>
    );
  },
};

export const FullWidth: Story = {
  render: function Render(args: InputProps) {
    const { l } = useBreakpoints();

    return (
      <div style={{ inlineSize: l ? 320 : 260 }}>
        <Input
          aria-label="fullWidth"
          placeholder="fullWidth"
          fullWidth
          {...args}
        />
      </div>
    );
  },
};

export const LongLabel: Story = {
  render: (args: InputProps) => (
    <div style={{ inlineSize: 220 }}>
      <Input label="A very-very-very long label font the input" {...args} />
    </div>
  ),
};

export const Disabled: Story = {
  render: function Render(args: InputProps) {
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
            disabled
            {...args}
          />
        ))}
      </FlexBox>
    );
  },
};

export const Required: Story = {
  render: function Render(args: InputProps) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        <Input
          label="Name"
          caption="required"
          placeholder="Sophia"
          required
          {...args}
        />
        <Input
          label="Name"
          caption="required, without indicator"
          placeholder="Sophia"
          slotProps={{ label: { required: false } }}
          required
          {...args}
        />
      </FlexBox>
    );
  },
};

export const ReadOnly: Story = {
  render: function Render(args: InputProps) {
    return (
      <Input
        label="Name"
        caption="read-only"
        defaultValue="Sophia"
        placeholder="read-only"
        readonly
        {...args}
      />
    );
  },
};

export const Autofill: Story = {
  render: (args: InputProps) => (
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
  render: function Render(args: InputProps) {
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

export const DefaultValue: Story = {
  render: function Render(args: InputProps) {
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
  render: function Render(args: InputProps) {
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
  render: function Render(args: InputProps) {
    const [hiddenPassword, { toggle }] = useBoolean(true);

    return (
      <Input
        label="Password"
        placeholder="Password"
        defaultValue="p@ssw0rd"
        {...(hiddenPassword && { type: 'password' })}
        endAddon={
          <IconButton
            onClick={toggle}
            variant="fade-contrast"
            style={{ marginInlineEnd: '-8px' }}
            aria-label={hiddenPassword ? 'show password' : 'hide password'}
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
  render: (args: InputProps) => (
    <FlexBox gap="m">
      <Input aria-label="input" placeholder="Placeholder" {...args} />
      <Button>Button</Button>
    </FlexBox>
  ),
};
