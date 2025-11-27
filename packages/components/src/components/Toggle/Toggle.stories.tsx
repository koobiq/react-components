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

export const Example: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render(args) {
    const [isLoading, { on: startLoading, off: stopLoading }] =
      useBoolean(false);

    const [isConnected, { set: setConnected }] = useBoolean(false);

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

    const handleVpnToggle = async (isChecked: boolean) => {
      startLoading();

      try {
        const message = await simulateVpnConnection(isChecked);
        setConnected(isChecked);
        console.log(message);
      } catch (error) {
        setConnected(!isChecked);
        console.error(error);
      } finally {
        stopLoading();
      }
    };

    const handleChange: ToggleProps['onChange'] = (isChecked) => {
      setConnected(isChecked);

      if (!isLoading) {
        handleVpnToggle(isChecked);
      }
    };

    const getStatusMessage = () => {
      if (isLoading && isConnected) return 'Connecting to VPN…';
      if (isLoading && !isConnected) return 'Disconnecting from VPN…';
      if (isConnected) return 'VPN Connected';

      return 'VPN Disconnected';
    };

    return (
      <Toggle isSelected={isConnected} onChange={handleChange} {...args}>
        {getStatusMessage()}
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
