import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import type { Selection } from '../../index';
import { Typography } from '../index';

import { Disclosure, DisclosureGroup } from './index';
import { type DisclosureProps } from './index';

const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  subcomponents: {
    'Disclosure.Trigger': Disclosure.Trigger,
    'Disclosure.Panel': Disclosure.Panel,
    DisclosureGroup,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<DisclosureProps>;

export const Base: Story = {
  render: (args) => (
    <Disclosure style={{ inlineSize: 200 }} {...args}>
      <Disclosure.Trigger as={Typography} variant="text-normal-strong">
        Account settings
      </Disclosure.Trigger>
      <Disclosure.Panel>
        Change your email, password, and security options.
      </Disclosure.Panel>
    </Disclosure>
  ),
};

export const DefaultExpansion: Story = {
  render: (args) => (
    <Disclosure style={{ inlineSize: 200 }} defaultExpanded {...args}>
      <Disclosure.Trigger as={Typography} variant="text-normal-strong">
        Account settings
      </Disclosure.Trigger>
      <Disclosure.Panel>
        Change your email, password, and security options.
      </Disclosure.Panel>
    </Disclosure>
  ),
};

export const ControlledExpansion: Story = {
  render: function Render(args) {
    const [isExpanded, setExpanded] = useState(false);

    return (
      <Disclosure
        style={{ inlineSize: 200 }}
        isExpanded={isExpanded}
        onExpandedChange={setExpanded}
        {...args}
      >
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Account settings
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Change your email, password, and security options.
        </Disclosure.Panel>
      </Disclosure>
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <Disclosure style={{ inlineSize: 200 }} isDisabled {...args}>
      <Disclosure.Trigger as={Typography} variant="text-normal-strong">
        Account settings
      </Disclosure.Trigger>
      <Disclosure.Panel>
        Change your email, password, and security options.
      </Disclosure.Panel>
    </Disclosure>
  ),
};

export const Group: Story = {
  render: () => (
    <DisclosureGroup style={{ inlineSize: 200 }}>
      <Disclosure>
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Account settings
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Change your email, password, and security options.
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure>
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Notifications
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Choose what you want to be notified about and how often.
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure>
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Privacy
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Control profile visibility, data sharing, and connected apps.
        </Disclosure.Panel>
      </Disclosure>
    </DisclosureGroup>
  ),
};

export const DefaultExpansionDisclosureGroup: Story = {
  render: () => (
    <DisclosureGroup
      defaultExpandedKeys={['account']}
      style={{ inlineSize: 200 }}
    >
      <Disclosure id="account">
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Account settings
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Change your email, password, and security options.
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure id="notifications">
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Notifications
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Choose what you want to be notified about and how often.
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure id="privacy">
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Privacy
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Control profile visibility, data sharing, and connected apps.
        </Disclosure.Panel>
      </Disclosure>
    </DisclosureGroup>
  ),
};

export const ControlledDisclosureGroup: Story = {
  render: function Render() {
    const [expandedKeys, setExpandedKeys] = useState<Selection>(
      new Set(['account'])
    );

    return (
      <DisclosureGroup
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        style={{ inlineSize: 200 }}
      >
        <Disclosure id="account">
          <Disclosure.Trigger as={Typography} variant="text-normal-strong">
            Account settings
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Change your email, password, and security options.
          </Disclosure.Panel>
        </Disclosure>
        <Disclosure id="notifications">
          <Disclosure.Trigger as={Typography} variant="text-normal-strong">
            Notifications
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Choose what you want to be notified about and how often.
          </Disclosure.Panel>
        </Disclosure>
        <Disclosure id="privacy">
          <Disclosure.Trigger as={Typography} variant="text-normal-strong">
            Privacy
          </Disclosure.Trigger>
          <Disclosure.Panel>
            Control profile visibility, data sharing, and connected apps.
          </Disclosure.Panel>
        </Disclosure>
      </DisclosureGroup>
    );
  },
};

export const MultipleExpandedDisclosureGroup: Story = {
  render: () => (
    <DisclosureGroup allowsMultipleExpanded style={{ inlineSize: 200 }}>
      <Disclosure id="account">
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Account settings
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Change your email, password, and security options.
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure id="notifications">
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Notifications
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Choose what you want to be notified about and how often.
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure id="privacy">
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Privacy
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Control profile visibility, data sharing, and connected apps.
        </Disclosure.Panel>
      </Disclosure>
    </DisclosureGroup>
  ),
};

export const DisabledDisclosureGroup: Story = {
  render: () => (
    <DisclosureGroup isDisabled style={{ inlineSize: 200 }}>
      <Disclosure id="account">
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Account settings
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Change your email, password, and security options.
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure id="notifications">
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Notifications
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Choose what you want to be notified about and how often.
        </Disclosure.Panel>
      </Disclosure>
      <Disclosure id="privacy">
        <Disclosure.Trigger as={Typography} variant="text-normal-strong">
          Privacy
        </Disclosure.Trigger>
        <Disclosure.Panel>
          Control profile visibility, data sharing, and connected apps.
        </Disclosure.Panel>
      </Disclosure>
    </DisclosureGroup>
  ),
};
