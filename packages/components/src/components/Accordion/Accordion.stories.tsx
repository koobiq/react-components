import { useState } from 'react';

import {
  IconPlus16,
  IconXmark16,
  IconLink16,
  IconSun16,
  IconLinkBroken16,
  IconSunMoon16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { AnimatedIcon, FlexBox, type Selection } from '../../index';

import { accordionSummaryPropExpandIconPlacement } from './components';
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

export const CustomExpandIcon: Story = {
  render: (args) => (
    <div style={{ inlineSize: 200 }}>
      <Accordion {...args}>
        <Accordion.Summary
          expandIconPlacement="separately"
          expandIcon={(isExpanded) => (
            <AnimatedIcon
              icons={[<IconPlus16 key="plus" />, <IconXmark16 key="xmark" />]}
              activeIndex={+isExpanded}
            />
          )}
        >
          Account settings
        </Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
      <Accordion>
        <Accordion.Summary
          expandIconPlacement="separately"
          expandIcon={(isExpanded) => (
            <AnimatedIcon
              icons={[
                <IconLink16 key="link" />,
                <IconLinkBroken16 key="link-broken" />,
              ]}
              activeIndex={+isExpanded}
            />
          )}
        >
          Account settings
        </Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
      <Accordion>
        <Accordion.Summary
          expandIconPlacement="separately"
          expandIcon={(isExpanded) => (
            <AnimatedIcon
              icons={[
                <IconSun16 key="sun" />,
                <IconSunMoon16 key="sun-moon" />,
              ]}
              directions={[0, 360]}
              activeIndex={+isExpanded}
            />
          )}
        >
          Account settings
        </Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
    </div>
  ),
};

export const ExpandIconPlacement: Story = {
  render: () => (
    <FlexBox
      direction="column"
      alignItems="stretch"
      style={{ inlineSize: 200 }}
    >
      {accordionSummaryPropExpandIconPlacement.map((placement) => (
        <Accordion key={placement}>
          <Accordion.Summary expandIconPlacement={placement}>
            Account settings
          </Accordion.Summary>
          <Accordion.Details>
            Change your email, password, and security options.
          </Accordion.Details>
        </Accordion>
      ))}
    </FlexBox>
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

export const DefaultExpansionAccordionGroup: Story = {
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

export const ControlledAccordionGroup: Story = {
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

export const MultipleExpandedAccordionGroup: Story = {
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

export const DisabledAccordionGroup: Story = {
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
