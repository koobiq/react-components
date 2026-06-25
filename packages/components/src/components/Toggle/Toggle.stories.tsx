import { useOptimistic, useState, useTransition } from 'react';

import { useBoolean } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { flex } from '../layout';
import { Typography } from '../Typography';

import { Toggle, togglePropLabelPlacement, togglePropSize } from './index.js';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <Toggle defaultSelected {...args}>
      Wi-Fi
    </Toggle>
  ),
};

export const LabelPlacement: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="column">
      {togglePropLabelPlacement.map((placement) => (
        <Toggle
          key={placement}
          labelPlacement={placement}
          defaultSelected
          {...args}
        >
          placement = {placement}
        </Toggle>
      ))}
    </FlexBox>
  ),
};

export const Size: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="column">
      {togglePropSize.map((size) => (
        <Toggle key={size} size={size} defaultSelected {...args}>
          size = {size}
        </Toggle>
      ))}
    </FlexBox>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <FlexBox gap="l">
      <Toggle {...args} isDisabled>
        Label
      </Toggle>
      <Toggle {...args} isDisabled defaultSelected>
        Label
      </Toggle>
      <Toggle {...args} isDisabled isInvalid defaultSelected>
        Label
      </Toggle>
    </FlexBox>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <FlexBox gap="l">
      <Toggle {...args} isLoading>
        Label
      </Toggle>
      <Toggle {...args} defaultSelected isLoading>
        Label
      </Toggle>
    </FlexBox>
  ),
};

export const DefaultValue: Story = {
  render: function Render(args) {
    return (
      <Toggle defaultSelected {...args}>
        Uncontrolled
      </Toggle>
    );
  },
};

export const ControlledValue: Story = {
  render: function Render(args) {
    const [isSelected, { toggle }] = useBoolean(true);

    return (
      <FlexBox gap="s" direction="column">
        <Toggle isSelected={isSelected} onChange={toggle} {...args}>
          Controlled
        </Toggle>
        <Typography variant="tabular-compact">
          Toggle is {isSelected ? 'checked' : 'unchecked'}
        </Typography>
      </FlexBox>
    );
  },
};

export const Invalid: Story = {
  render: (args) => (
    <Toggle {...args} isInvalid defaultSelected>
      Label
    </Toggle>
  ),
};

export const ReadOnly: Story = {
  render: (args) => (
    <Toggle {...args} isReadOnly defaultSelected>
      Label
    </Toggle>
  ),
};

export const Description: Story = {
  render: (args) => (
    <Toggle
      {...args}
      slotProps={{
        label: { className: flex({ direction: 'column', gap: '3xs' }) },
      }}
      defaultSelected
    >
      Switch Component
      <Typography color="contrast-secondary" variant="text-compact">
        Design and code an accessible switch component for your React project.
      </Typography>
    </Toggle>
  ),
};

export const ServerApi: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    const vpnStatusMessage = {
      connected: 'VPN Connected',
      connecting: 'Connecting to VPN…',
      disconnected: 'VPN Disconnected',
      disconnecting: 'Disconnecting from VPN…',
      failed: 'VPN Connection Failed',
    } as const;

    const [isConnected, setConnected] = useState(false);
    const [statusCode, setStatusCode] = useState<VpnStatusCode>('disconnected');

    const [optimisticConnected, setOptimisticConnected] =
      useOptimistic(isConnected);

    const [isPending, startTransition] = useTransition();

    type VpnStatusCode = keyof typeof vpnStatusMessage;

    const fetchVpnConnection = async (nextConnected: boolean) => {
      // connecting randomly fails to demonstrate the error state
      const status = nextConnected && Math.random() < 0.5 ? 500 : 200;

      const response = await fetch(
        `https://dummyjson.com/http/${status}?delay=2000`
      );

      if (!response.ok) {
        throw new Error('VPN connection failed');
      }

      return nextConnected;
    };

    const handleChange = (nextConnected: boolean) => {
      setStatusCode(nextConnected ? 'connecting' : 'disconnecting');

      startTransition(async () => {
        setOptimisticConnected(nextConnected);

        try {
          const confirmedConnected = await fetchVpnConnection(nextConnected);

          setConnected(confirmedConnected);
          setStatusCode(confirmedConnected ? 'connected' : 'disconnected');
        } catch {
          setStatusCode('failed');
        }
      });
    };

    return (
      <Toggle
        isLoading={isPending}
        onChange={handleChange}
        isSelected={optimisticConnected}
      >
        {vpnStatusMessage[statusCode]}
      </Toggle>
    );
  },
};

export const HtmlForms: Story = {
  render: (args) => (
    <Toggle {...args} aria-label="Power" name="power" value="low">
      Low power mode
    </Toggle>
  ),
};
