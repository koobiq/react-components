import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import type { Selection } from '../../index';

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
    <Disclosure style={{ inlineSize: 300 }} {...args}>
      <Disclosure.Trigger>Action</Disclosure.Trigger>
      <Disclosure.Panel>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab distinctio
        est libero nulla praesentium quidem quis quos sed sit velit!
      </Disclosure.Panel>
    </Disclosure>
  ),
};

export const DefaultExpansion: Story = {
  render: (args) => (
    <Disclosure style={{ inlineSize: 300 }} defaultExpanded {...args}>
      <Disclosure.Trigger>Action</Disclosure.Trigger>
      <Disclosure.Panel>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab distinctio
        est libero nulla praesentium quidem quis quos sed sit velit!
      </Disclosure.Panel>
    </Disclosure>
  ),
};

export const ControlledExpansion: Story = {
  render: function Render(args) {
    const [isExpanded, setExpanded] = useState(false);

    return (
      <Disclosure
        style={{ inlineSize: 300 }}
        isExpanded={isExpanded}
        onExpandedChange={setExpanded}
        {...args}
      >
        <Disclosure.Trigger>Action</Disclosure.Trigger>
        <Disclosure.Panel>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab
          distinctio est libero nulla praesentium quidem quis quos sed sit
          velit!
        </Disclosure.Panel>
      </Disclosure>
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <Disclosure style={{ inlineSize: 300 }} isDisabled {...args}>
      <Disclosure.Trigger>Action</Disclosure.Trigger>
      <Disclosure.Panel>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab distinctio
        est libero nulla praesentium quidem quis quos sed sit velit!
      </Disclosure.Panel>
    </Disclosure>
  ),
};

export const Group: Story = {
  render: () => (
    <DisclosureGroup style={{ inlineSize: 300 }}>
      <Disclosure>
        <Disclosure.Trigger>Personal Information</Disclosure.Trigger>
        <Disclosure.Panel>Personal information form here.</Disclosure.Panel>
      </Disclosure>
      <Disclosure>
        <Disclosure.Trigger>Billing Address</Disclosure.Trigger>
        <Disclosure.Panel>Billing address form here.</Disclosure.Panel>
      </Disclosure>
    </DisclosureGroup>
  ),
};

export const DefaultExpansionDisclosureGroup: Story = {
  render: () => (
    <DisclosureGroup
      defaultExpandedKeys={['personal']}
      style={{ inlineSize: 300 }}
    >
      <Disclosure id="personal">
        <Disclosure.Trigger>Personal Information</Disclosure.Trigger>
        <Disclosure.Panel>Personal information form here.</Disclosure.Panel>
      </Disclosure>
      <Disclosure id="billing">
        <Disclosure.Trigger>Billing Address</Disclosure.Trigger>
        <Disclosure.Panel>Billing address form here.</Disclosure.Panel>
      </Disclosure>
    </DisclosureGroup>
  ),
};

export const ControlledDisclosureGroup: Story = {
  render: function Render() {
    const [expandedKeys, setExpandedKeys] = useState<Selection>(
      new Set(['personal'])
    );

    return (
      <DisclosureGroup
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        style={{ inlineSize: 300 }}
      >
        <Disclosure id="personal">
          <Disclosure.Trigger>Personal Information</Disclosure.Trigger>
          <Disclosure.Panel>Personal information form here.</Disclosure.Panel>
        </Disclosure>
        <Disclosure id="billing">
          <Disclosure.Trigger>Billing Address</Disclosure.Trigger>
          <Disclosure.Panel>Billing address form here.</Disclosure.Panel>
        </Disclosure>
      </DisclosureGroup>
    );
  },
};

export const MultipleExpandedDisclosureGroup: Story = {
  render: () => (
    <DisclosureGroup allowsMultipleExpanded style={{ inlineSize: 300 }}>
      <Disclosure id="personal">
        <Disclosure.Trigger>Personal Information</Disclosure.Trigger>
        <Disclosure.Panel>Personal information form here.</Disclosure.Panel>
      </Disclosure>
      <Disclosure id="billing">
        <Disclosure.Trigger>Billing Address</Disclosure.Trigger>
        <Disclosure.Panel>Billing address form here.</Disclosure.Panel>
      </Disclosure>
    </DisclosureGroup>
  ),
};

export const DisabledDisclosureGroup: Story = {
  render: () => (
    <DisclosureGroup isDisabled style={{ inlineSize: 300 }}>
      <Disclosure id="personal">
        <Disclosure.Trigger>Personal Information</Disclosure.Trigger>
        <Disclosure.Panel>Personal information form here.</Disclosure.Panel>
      </Disclosure>
      <Disclosure id="billing">
        <Disclosure.Trigger>Billing Address</Disclosure.Trigger>
        <Disclosure.Panel>Billing address form here.</Disclosure.Panel>
      </Disclosure>
    </DisclosureGroup>
  ),
};
