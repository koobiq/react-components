import { useBoolean } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { flex } from '../layout';
import { Typography } from '../Typography';

import {
  Toggle,
  togglePropLabelPlacement,
  type ToggleProps,
  togglePropSize,
} from './index.js';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  parameters: {
    layout: 'centered',
  },
  render: (args: ToggleProps) => (
    <Toggle defaultChecked {...args}>
      Wi-Fi
    </Toggle>
  ),
};

export const LabelPlacement = {
  parameters: {
    layout: 'centered',
  },
  render: (args: ToggleProps) => (
    <FlexBox gap="l" direction="column">
      {togglePropLabelPlacement.map((placement) => (
        <Toggle
          key={placement}
          labelPlacement={placement}
          defaultChecked
          {...args}
        >
          placement = {placement}
        </Toggle>
      ))}
    </FlexBox>
  ),
};

export const Size = {
  parameters: {
    layout: 'centered',
  },
  render: (args: ToggleProps) => (
    <FlexBox gap="l" direction="column">
      {togglePropSize.map((size) => (
        <Toggle key={size} size={size} defaultChecked {...args}>
          size = {size}
        </Toggle>
      ))}
    </FlexBox>
  ),
};

export const Disabled: Story = {
  parameters: {
    layout: 'centered',
  },
  render: (args: ToggleProps) => (
    <FlexBox gap="l">
      <Toggle {...args} disabled>
        Label
      </Toggle>
      <Toggle {...args} disabled defaultChecked>
        Label
      </Toggle>
    </FlexBox>
  ),
};

export const DefaultValue: Story = {
  parameters: {
    layout: 'centered',
  },
  render: function Render(args: ToggleProps) {
    return (
      <Toggle defaultChecked {...args}>
        Uncontrolled
      </Toggle>
    );
  },
};

export const ControlledValue: Story = {
  parameters: {
    layout: 'centered',
  },
  render: function Render(args: ToggleProps) {
    const [checked, { toggle }] = useBoolean(true);

    return (
      <FlexBox gap="s" direction="column">
        <Toggle checked={checked} onChange={toggle} {...args}>
          Controlled
        </Toggle>
        <Typography variant="tabular-compact">
          Toggle is {checked ? 'checked' : 'unchecked'}
        </Typography>
      </FlexBox>
    );
  },
};

export const Error: Story = {
  parameters: {
    layout: 'centered',
  },
  render: (args: ToggleProps) => (
    <Toggle {...args} error defaultChecked>
      Label
    </Toggle>
  ),
};

export const Description: Story = {
  parameters: {
    layout: 'centered',
  },
  render: (args: ToggleProps) => (
    <Toggle
      {...args}
      slotProps={{
        label: { className: flex({ direction: 'column', gap: '3xs' }) },
      }}
      defaultChecked
    >
      Switch Component
      <Typography color="contrast-secondary" variant="text-compact">
        Design and code an accessible switch component for your React project.
      </Typography>
    </Toggle>
  ),
};

export const Example: Story = {
  render: function Render(args: ToggleProps) {
    const [loading, { on: startLoading, off: stopLoading }] = useBoolean(false);
    const [connected, { set: setConnected }] = useBoolean(false);

    const simulateVpnConnection = (checked: boolean) =>
      new Promise<string>((resolve, reject) => {
        const shouldConnect = checked ? Math.random() < 0.5 : false;

        if (checked) {
          setTimeout(() => {
            if (shouldConnect) {
              reject(new window.Error('VPN connection failed!'));
            } else {
              resolve('VPN successfully connected!');
            }
          }, 2000);
        } else {
          resolve('VPN successfully disconnected!');
        }
      });

    const handleVpnToggle = async (checked: boolean) => {
      startLoading();

      try {
        const message = await simulateVpnConnection(checked);
        setConnected(checked);
        console.log(message);
      } catch (error) {
        setConnected(!checked);
        console.error(error);
      } finally {
        stopLoading();
      }
    };

    const handleChange: ToggleProps['onChange'] = (checked) => {
      setConnected(checked);

      if (!loading) {
        handleVpnToggle(checked);
      }
    };

    const getStatusMessage = () => {
      if (loading && connected) return 'Connecting to VPN…';
      if (loading && !connected) return 'Disconnecting from VPN…';
      if (connected) return 'VPN Connected';

      return 'VPN Disconnected';
    };

    return (
      <Toggle checked={connected} onChange={handleChange} {...args}>
        {getStatusMessage()}
      </Toggle>
    );
  },
};
