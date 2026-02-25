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

import {
  AnimatedIcon,
  FlexBox,
  Badge,
  Link,
  type Selection,
  Typography,
} from '../../index';

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
  tags: ['status:new', 'date:2026-01-16'],
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

export const Content: Story = {
  render: (args) => (
    <div style={{ inlineSize: 240 }}>
      <Accordion {...args}>
        <Accordion.Summary>
          <FlexBox
            gap="s"
            as="span"
            alignItems="center"
            justifyContent="space-between"
            style={{ width: '100%' }}
          >
            <span>Accordion 1</span>
            <Badge variant="error" size="compact">
              Error
            </Badge>
          </FlexBox>
        </Accordion.Summary>
        <Accordion.Details>
          <Typography variant="inherit" as="span">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis,
            illum. <Link variant="inherit">See details.</Link>
          </Typography>
        </Accordion.Details>
      </Accordion>
      <Accordion {...args}>
        <Accordion.Summary>
          <FlexBox
            gap="s"
            as="span"
            alignItems="center"
            justifyContent="space-between"
            style={{ width: '100%' }}
          >
            <span>Accordion 2</span>
            <Badge variant="success" size="compact">
              Success
            </Badge>
          </FlexBox>
        </Accordion.Summary>
        <Accordion.Details>
          <Typography variant="inherit" as="span">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis,
            illum. <Link variant="inherit">See details.</Link>
          </Typography>
        </Accordion.Details>
      </Accordion>
      <Accordion {...args}>
        <Accordion.Summary>
          <FlexBox
            gap="s"
            as="span"
            alignItems="center"
            justifyContent="space-between"
            style={{ width: '100%' }}
          >
            <span>Accordion 3</span>
            <Badge size="compact">System</Badge>
          </FlexBox>
        </Accordion.Summary>
        <Accordion.Details>
          <Typography variant="inherit" as="span">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facilis,
            illum. <Link variant="inherit">See details.</Link>
          </Typography>
        </Accordion.Details>
      </Accordion>
    </div>
  ),
};

export const CustomExpandIcon: Story = {
  render: () => (
    <div style={{ inlineSize: 200 }}>
      <Accordion>
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
      <Accordion>
        <Accordion.Summary expandIconPlacement="before-content">
          Account settings
        </Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
      <Accordion>
        <Accordion.Summary expandIconPlacement="after-content">
          Account settings
        </Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
      <Accordion>
        <Accordion.Summary expandIconPlacement="separately">
          Account settings
        </Accordion.Summary>
        <Accordion.Details>
          Change your email, password, and security options.
        </Accordion.Details>
      </Accordion>
    </FlexBox>
  ),
};

export const UnmountOnExit: Story = {
  render: (args) => (
    <Accordion style={{ inlineSize: 200 }} {...args}>
      <Accordion.Summary>Account settings</Accordion.Summary>
      <Accordion.Details unmountOnExit>
        Change your email, password, and security options.
      </Accordion.Details>
    </Accordion>
  ),
};

export const ChangingHeadingLevel: Story = {
  render: (args) => (
    <Accordion style={{ inlineSize: 200 }} {...args}>
      <Accordion.Summary as="h4">Account settings</Accordion.Summary>
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
