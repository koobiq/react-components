import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import type { Selection } from '../../index';

import { Accordion, AccordionGroup } from './index';
import { type AccordionProps } from './index';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  subcomponents: {
    'Accordion.Summary': Accordion.Summary,
    'Accordion.Details': Accordion.Details,
    AccordionGroup,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new'],
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<AccordionProps>;

export const Base: Story = {
  render: (args) => (
    <Accordion style={{ inlineSize: 200 }} {...args}>
      <Accordion.Summary>Account settings</Accordion.Summary>
      <Accordion.Details>
        Change your email, password, and security options.
      </Accordion.Details>
    </Accordion>
  ),
};

export const DefaultExpansion: Story = {
  render: (args) => (
    <Accordion style={{ inlineSize: 200 }} defaultExpanded {...args}>
      <Accordion.Summary>Account settings</Accordion.Summary>
      <Accordion.Details>
        Change your email, password, and security options.
      </Accordion.Details>
    </Accordion>
  ),
};

export const ControlledExpansion: Story = {
  render: function Render(args) {
    const [isExpanded, setExpanded] = useState(false);

    return (
      <Accordion
        style={{ inlineSize: 200 }}
        isExpanded={isExpanded}
        onExpandedChange={setExpanded}
        {...args}
      >
        <Accordion.Summary>Account settings</Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <Accordion style={{ inlineSize: 200 }} isDisabled {...args}>
      <Accordion.Summary>Account settings</Accordion.Summary>
      <Accordion.Details>
        Change your email, password, and security options.
      </Accordion.Details>
    </Accordion>
  ),
};

export const Group: Story = {
  render: () => (
    <AccordionGroup style={{ inlineSize: 200 }}>
      <Accordion>
        <Accordion.Summary>Account settings</Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
      <Accordion>
        <Accordion.Summary>Notifications</Accordion.Summary>
        <Accordion.Details>
          Choose what you want to be notified about and how often.
        </Accordion.Details>
      </Accordion>
      <Accordion>
        <Accordion.Summary>Privacy</Accordion.Summary>
        <Accordion.Details>
          Control profile visibility, data sharing, and connected apps.
        </Accordion.Details>
      </Accordion>
    </AccordionGroup>
  ),
};

export const DefaultExpansionDisclosureGroup: Story = {
  render: () => (
    <AccordionGroup
      defaultExpandedKeys={['account']}
      style={{ inlineSize: 200 }}
    >
      <Accordion id="account">
        <Accordion.Summary>Account settings</Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
      <Accordion id="notifications">
        <Accordion.Summary>Notifications</Accordion.Summary>
        <Accordion.Details>
          Choose what you want to be notified about and how often.
        </Accordion.Details>
      </Accordion>
      <Accordion id="privacy">
        <Accordion.Summary>Privacy</Accordion.Summary>
        <Accordion.Details>
          Control profile visibility, data sharing, and connected apps.
        </Accordion.Details>
      </Accordion>
    </AccordionGroup>
  ),
};

export const ControlledDisclosureGroup: Story = {
  render: function Render() {
    const [expandedKeys, setExpandedKeys] = useState<Selection>(
      new Set(['account'])
    );

    return (
      <AccordionGroup
        expandedKeys={expandedKeys}
        onExpandedChange={setExpandedKeys}
        style={{ inlineSize: 200 }}
      >
        <Accordion id="account">
          <Accordion.Summary>Account settings</Accordion.Summary>
          <Accordion.Details>
            Change your email, password, and security options.
          </Accordion.Details>
        </Accordion>
        <Accordion id="notifications">
          <Accordion.Summary>Notifications</Accordion.Summary>
          <Accordion.Details>
            Choose what you want to be notified about and how often.
          </Accordion.Details>
        </Accordion>
        <Accordion id="privacy">
          <Accordion.Summary>Privacy</Accordion.Summary>
          <Accordion.Details>
            Control profile visibility, data sharing, and connected apps.
          </Accordion.Details>
        </Accordion>
      </AccordionGroup>
    );
  },
};

export const MultipleExpandedDisclosureGroup: Story = {
  render: () => (
    <AccordionGroup allowsMultipleExpanded style={{ inlineSize: 200 }}>
      <Accordion id="account">
        <Accordion.Summary>Account settings</Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
      <Accordion id="notifications">
        <Accordion.Summary>Notifications</Accordion.Summary>
        <Accordion.Details>
          Choose what you want to be notified about and how often.
        </Accordion.Details>
      </Accordion>
      <Accordion id="privacy">
        <Accordion.Summary>Privacy</Accordion.Summary>
        <Accordion.Details>
          Control profile visibility, data sharing, and connected apps.
        </Accordion.Details>
      </Accordion>
    </AccordionGroup>
  ),
};

export const DisabledDisclosureGroup: Story = {
  render: () => (
    <AccordionGroup isDisabled style={{ inlineSize: 200 }}>
      <Accordion id="account">
        <Accordion.Summary>Account settings</Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
      <Accordion id="notifications">
        <Accordion.Summary>Notifications</Accordion.Summary>
        <Accordion.Details>
          Choose what you want to be notified about and how often.
        </Accordion.Details>
      </Accordion>
      <Accordion id="privacy">
        <Accordion.Summary>Privacy</Accordion.Summary>
        <Accordion.Details>
          Control profile visibility, data sharing, and connected apps.
        </Accordion.Details>
      </Accordion>
    </AccordionGroup>
  ),
};
