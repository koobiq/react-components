import type { KeyboardEvent } from 'react';
import { useMemo, useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconCheckS16,
  IconEye16,
  IconEyeSlash16,
  IconGlobe16,
  IconMagnifyingGlass16,
  IconXmarkS16,
} from '@koobiq/react-icons';
import * as Icons from '@koobiq/react-icons';
import { maskitoNumberOptionsGenerator } from '@maskito/kit';
import { useMaskito } from '@maskito/react';
import type { Meta, StoryObj } from '@storybook/react';

import { AnimatedIcon } from '../AnimatedIcon';
import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { IconButton } from '../IconButton';
import { Tooltip } from '../Tooltip';
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
  tags: ['status:updated', 'date:2025-12-26'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <Input
      label="Name"
      maxLength={100}
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
            errorMessage="This field is required"
            startAddon={<IconMagnifyingGlass16 />}
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
        endAddon={<IconGlobe16 />}
        caption="startAddon + endAddon"
        startAddon={<Typography>https://</Typography>}
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
      maxLength={100}
      labelAlign="end"
      placeholder="Sophia"
      labelPlacement="side"
      caption="Maximum 100 characters"
      fullWidth
      {...args}
    />
  ),
};

export const ClearButton: Story = {
  render: function Render() {
    return (
      <Input
        label="Name"
        maxLength={100}
        placeholder="Sophia"
        defaultValue="Sophia"
        style={{ inlineSize: 200 }}
        caption="Maximum 100 characters"
        isClearable
      />
    );
  },
};

export const DefaultValue: Story = {
  render: function Render(args) {
    return (
      <Input
        label="Name"
        placeholder="Sophia"
        defaultValue="Sophia"
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
    const passwordRuleStateColor = {
      neutral: 'var(--kbq-foreground-contrast-tertiary)',
      success: 'var(--kbq-foreground-success)',
      error: 'var(--kbq-foreground-error)',
    } as const;

    type PasswordRuleState = keyof typeof passwordRuleStateColor;
    type PasswordRule = {
      id: string;
      label: string;
      test: (value: string) => boolean;
    };

    const disallowedPasswordCharacters =
      /[^ !"#$%&'()*+,\-./\\:;<=>?@[\]^_`{|}~A-Za-z0-9]/;

    const passwordRules: PasswordRule[] = [
      {
        id: 'length',
        label: '8 to 15 characters',
        test: (value) => value.length >= 8 && value.length <= 15,
      },
      {
        id: 'uppercase',
        label: 'Uppercase Latin letter',
        test: (value) => /[A-Z]/.test(value),
      },
      {
        id: 'lowercase',
        label: 'Lowercase Latin letter',
        test: (value) => /[a-z]/.test(value),
      },
      {
        id: 'digit',
        label: 'Number',
        test: (value) => /\d/.test(value),
      },
      {
        id: 'special',
        label: 'Only Latin letters, numbers, spaces, and special characters',
        test: (value) =>
          value.length > 0 && !disallowedPasswordCharacters.test(value),
      },
      {
        id: 'uppercase-count',
        label: 'At least 5 uppercase letters',
        test: (value) => (value.match(/[A-Z]/g)?.length ?? 0) >= 5,
      },
    ];

    const [value, setValue] = useState('');
    const [isInvalid, { on: showError, off: hideError }] = useBoolean(false);

    const [isPasswordHidden, { toggle: togglePasswordVisibility }] =
      useBoolean(true);

    const [isEdited, { on: markEdited }] = useBoolean(false);

    const hasValue = value !== '';
    const isPasswordValid = passwordRules.every((rule) => rule.test(value));
    const passwordType = isPasswordHidden ? 'password' : 'text';

    const passwordVisibilityText = isPasswordHidden
      ? 'Show password'
      : 'Hide password';

    const getPasswordRuleState = (isRulePassed: boolean): PasswordRuleState => {
      if (!isEdited) return 'neutral';

      return isRulePassed ? 'success' : 'error';
    };

    const renderPasswordRequirement = (rule: PasswordRule) => {
      const isRulePassed = rule.test(value);
      const state = getPasswordRuleState(isRulePassed);
      const Icon = isEdited && isRulePassed ? IconCheckS16 : IconXmarkS16;

      return (
        <FlexBox key={rule.id} as="span" gap="xs" alignItems="center">
          <Icon style={{ color: passwordRuleStateColor[state] }} />
          {rule.label}
        </FlexBox>
      );
    };

    const handleChange = (nextValue: string) => {
      markEdited();
      hideError();
      setValue(nextValue);
    };

    const handleBlur = () => {
      if (hasValue && !isPasswordValid) {
        showError();

        return;
      }

      hideError();
    };

    return (
      <Input
        label="Password"
        value={value}
        onChange={handleChange}
        isInvalid={isInvalid}
        placeholder="Password"
        type={passwordType}
        onBlur={handleBlur}
        endAddon={
          <Tooltip
            control={(props) => (
              <IconButton
                {...props}
                onPress={togglePasswordVisibility}
                variant={isInvalid ? 'error' : 'fade-contrast'}
                style={{ marginInlineEnd: '-8px' }}
                aria-label={passwordVisibilityText}
                preventFocusOnPress
              >
                <AnimatedIcon
                  activeIndex={+isPasswordHidden}
                  icons={[
                    <IconEye16 key="eye" />,
                    <IconEyeSlash16 key="eye-slash" />,
                  ]}
                />
              </IconButton>
            )}
          >
            {passwordVisibilityText}
          </Tooltip>
        }
        caption={
          <FlexBox as="span" direction="column" gap="xs">
            {passwordRules.map(renderPasswordRequirement)}
          </FlexBox>
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
        name="email"
        type="email"
        label="Email"
        validationBehavior="native"
        isRequired
        {...args}
      />
      <Button type="submit">Submit</Button>
    </Form>
  ),
};

export const Mask: Story = {
  render: function Render(args) {
    const hex = /[\dA-Fa-f]/;
    const alphanumeric = /[\dA-Za-z]/;

    const toUpperCase = ({
      value,
      selection,
    }: {
      value: string;
      selection: readonly [number, number];
    }) => ({ value: value.toUpperCase(), selection });

    const ipv4Options = useMemo(
      () => ({
        mask: /^((25[0-5]|2[0-4]\d|[01]?\d?\d)\.){0,3}(25[0-5]|2[0-4]\d|[01]?\d?\d)?$/,
      }),
      []
    );

    const macOptions = useMemo(
      () => ({
        mask: Array.from({ length: 6 }).flatMap((_, index) =>
          index === 0 ? [hex, hex] : [':', hex, hex]
        ),
        postprocessors: [toUpperCase],
      }),
      []
    );

    const ipv6Options = useMemo(
      () => ({
        mask: Array.from({ length: 8 }).flatMap((_, index) =>
          index === 0 ? [hex, hex, hex, hex] : [':', hex, hex, hex, hex]
        ),
      }),
      []
    );

    const portOptions = useMemo(
      () =>
        maskitoNumberOptionsGenerator({
          min: 0,
          max: 65535,
          maximumFractionDigits: 0,
          thousandSeparator: '',
        }),
      []
    );

    const licenseKeyOptions = useMemo(
      () => ({
        mask: Array.from({ length: 4 }).flatMap((_, index) =>
          index === 0
            ? [alphanumeric, alphanumeric, alphanumeric, alphanumeric]
            : ['-', alphanumeric, alphanumeric, alphanumeric, alphanumeric]
        ),
        postprocessors: [toUpperCase],
      }),
      []
    );

    const ipv4Ref = useMaskito({ options: ipv4Options });
    const macRef = useMaskito({ options: macOptions });
    const ipv6Ref = useMaskito({ options: ipv6Options });
    const portRef = useMaskito({ options: portOptions });
    const licenseKeyRef = useMaskito({ options: licenseKeyOptions });

    const [ipv4, setIpv4] = useState('192.168.0.1');
    const [mac, setMac] = useState('AA:BB:CC:DD:EE:FF');

    const [ipv6, setIpv6] = useState('2001:0db8:85a3:0000:0000:8a2e:0370:7334');

    const [port, setPort] = useState('8080');
    const [licenseKey, setLicenseKey] = useState('ABCD-1234-EFGH-5678');

    const handlePortKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

      event.preventDefault();

      const step = event.key === 'ArrowUp' ? 1 : -1;

      setPort((prevPort) =>
        String(Math.min(Math.max(Number(prevPort || 0) + step, 0), 65535))
      );
    };

    return (
      <FlexBox direction="column" gap="l" style={{ inlineSize: 320 }}>
        <Input
          label="IP address"
          caption="Format: 192.168.0.1"
          value={ipv4}
          onChange={setIpv4}
          slotProps={{ input: { ref: ipv4Ref } }}
          isClearable
          fullWidth
          {...args}
        />
        <Input
          label="MAC address"
          caption="Format: AA:BB:CC:DD:EE:FF"
          value={mac}
          onChange={setMac}
          slotProps={{ input: { ref: macRef } }}
          isClearable
          fullWidth
          {...args}
        />
        <Input
          label="IPv6 address"
          caption="Format: 2001:0db8:85a3:0000:0000:8a2e:0370:7334"
          value={ipv6}
          onChange={setIpv6}
          slotProps={{ input: { ref: ipv6Ref } }}
          isClearable
          fullWidth
          {...args}
        />
        <Input
          label="Port"
          caption="Range: 0-65535. Use ↑/↓ to increase or decrease the value"
          value={port}
          onChange={setPort}
          slotProps={{ input: { ref: portRef, onKeyDown: handlePortKeyDown } }}
          isClearable
          fullWidth
          {...args}
        />
        <Input
          label="License key"
          caption="Format: ABCD-1234-EFGH-5678"
          value={licenseKey}
          onChange={setLicenseKey}
          slotProps={{ input: { ref: licenseKeyRef } }}
          isClearable
          fullWidth
          {...args}
        />
      </FlexBox>
    );
  },
};
