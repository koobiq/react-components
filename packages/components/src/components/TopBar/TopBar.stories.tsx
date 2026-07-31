import { type CSSProperties, type SVGProps, useState } from 'react';

import { mergeRefs, useHideOverflowItems } from '@koobiq/react-core';
import {
  IconArrowsRotate16,
  IconBug16,
  IconEllipsisHorizontal16,
  IconFilter16,
  IconGear16,
  IconList16,
  IconMagnifyingGlass16,
  IconPlus16,
  IconPrinter16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { BreadcrumbItem, Breadcrumbs } from '../Breadcrumbs';
import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { IconButton } from '../IconButton';
import { spacing } from '../layout';
import { Menu } from '../Menu';
import { Typography } from '../Typography';

import s from './__stories__/styles.module.css';
import { TopBar, type TopBarProps, topBarPropPosition } from './index.js';

const meta = {
  title: 'Components/TopBar',
  component: TopBar,
  subcomponents: {
    'TopBar.Container': TopBar.Container,
    'TopBar.Title': TopBar.Title,
  },
  parameters: {
    layout: 'padded',
  },
  tags: ['status:new', 'date:2026-07-31'],
} satisfies Meta<typeof TopBar>;

export default meta;

type Story = StoryObj<TopBarProps>;

const AppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 19.2C0 21.3033 0 22.4726 0.763692 23.2363C1.52738 24 2.69665 24 4.8 24H19.2C21.3033 24 22.4726 24 23.2363 23.2363C24 22.4726 24 21.3033 24 19.2V4.8C24 2.69665 24 1.52738 23.2363 0.763692C22.4726 0 21.3033 0 19.2 0H4.8C2.69665 0 1.52738 0 0.763692 0.763692C0 1.52738 0 2.69665 0 4.8V19.2Z"
      fill="#FF0000"
    />
    <path
      d="M11.233 12L8.39495 14.8381L5.55688 12L8.39495 9.20029L11.233 12ZM14.8381 15.6435L12.0384 18.4432L9.20035 15.6435L12.0384 12.8054L14.8381 15.6435ZM14.8381 8.39489L12.0384 11.1946L9.20035 8.39489L12.0384 5.55682L14.8381 8.39489ZM18.4432 12L15.6435 14.8381L12.8438 12L15.6435 9.20029L18.4432 12Z"
      fill="white"
    />
  </svg>
);

const Content = () => (
  <FlexBox
    gap="m"
    direction="column"
    className={spacing({ pi: 'xxl', pb: 'l' })}
  >
    <Typography>
      Web security is a crucial aspect of modern digital infrastructure,
      ensuring the protection of sensitive data, user privacy, and system
      integrity. As cyber threats continue to evolve, developers and
      organizations must adopt a proactive approach to securing web applications
      against attacks.
    </Typography>
    <Typography>
      One of the most common vulnerabilities is SQL injection, where attackers
      manipulate database queries to gain unauthorized access to sensitive
      information. Similarly, cross-site scripting (XSS) allows malicious
      scripts to run on a victim’s browser, leading to data theft or session
      hijacking. Another prevalent threat is cross-site request forgery (CSRF),
      in which users are tricked into executing unwanted actions on
      authenticated sites. Additionally, man-in-the-middle attacks intercept
      communication between users and servers, compromising the confidentiality
      of data. Distributed Denial-of-Service (DDoS) attacks can also cripple web
      services by overwhelming them with excessive traffic.
    </Typography>
    <Typography>
      To mitigate these risks, implementing strong security practices is
      essential. Using HTTPS ensures encrypted communication, protecting data
      from interception. Proper input validation and escaping mechanisms help
      prevent code injection attacks. Authentication and authorization
      mechanisms, including multi-factor authentication (MFA) and role-based
      access control (RBAC), add layers of security to user access. Secure API
      development, including authentication, rate limiting, and encryption,
      reduces vulnerabilities in web services. Keeping software, frameworks, and
      dependencies up to date minimizes the risk of exploiting known
      vulnerabilities. Continuous monitoring, logging, and security audits help
      detect and respond to threats before they cause significant damage.
    </Typography>
    <Typography>
      Web security is not a one-time implementation but an ongoing process that
      evolves alongside emerging threats. By following best practices and
      staying vigilant, businesses and developers can build resilient, secure
      applications that protect users and data in an increasingly connected
      world.
    </Typography>
  </FlexBox>
);

export const Base: Story = {
  render: (args) => (
    <TopBar {...args}>
      <TopBar.Container placement="start">
        <TopBar.Title>Dashboards</TopBar.Title>
      </TopBar.Container>
      <TopBar.Container placement="end" aria-label="Page actions" isToolbar>
        <Button variant="fade-contrast-filled">Share</Button>
        <Button startIcon={<IconPlus16 />}>Create dashboard</Button>
      </TopBar.Container>
    </TopBar>
  ),
};

export const WithLogoAndCounter: Story = {
  render: (args) => (
    <TopBar {...args}>
      <TopBar.Container placement="start">
        <IconButton
          as="a"
          href="#"
          aria-label="Go to the home page"
          className={spacing({ mie: 'l' })}
        >
          <AppIcon />
        </IconButton>
        <TopBar.Title className={spacing({ mie: 'xs' })}>
          Dashboards
        </TopBar.Title>
        <Typography as="span" variant="title" color="contrast-tertiary">
          10
        </Typography>
      </TopBar.Container>
      <TopBar.Container placement="end" isToolbar aria-label="Page actions">
        <Button startIcon={<IconPlus16 />}>Create dashboard</Button>
      </TopBar.Container>
    </TopBar>
  ),
};

export const Position: Story = {
  render: function Render() {
    const containerStyle = {
      overflow: 'auto',
      position: 'relative',
      blockSize: 240,
      borderRadius: 'var(--kbq-size-s)',
      border: '1px solid var(--kbq-line-contrast-less)',
    } as CSSProperties;

    return (
      <FlexBox gap="xxl" direction="column">
        {topBarPropPosition.map((position) => (
          <FlexBox key={position} gap="s" direction="column">
            <Typography variant="text-compact" color="contrast-secondary">
              position = {position}
            </Typography>
            <div style={containerStyle}>
              <TopBar position={position} hasShadow>
                <TopBar.Container placement="start">
                  <TopBar.Title as="h2">Dashboards</TopBar.Title>
                </TopBar.Container>
                <TopBar.Container
                  placement="end"
                  aria-label="Page actions"
                  isToolbar
                >
                  <Button>Apply</Button>
                </TopBar.Container>
              </TopBar>
              <Content />
            </div>
          </FlexBox>
        ))}
      </FlexBox>
    );
  },
};

export const Shadow: Story = {
  render: function Render(args) {
    const [isScrolled, setIsScrolled] = useState(false);

    const containerStyle = {
      overflow: 'auto',
      blockSize: 320,
      borderRadius: 'var(--kbq-size-s)',
      border: '1px solid var(--kbq-line-contrast-less)',
    } as CSSProperties;

    return (
      <div
        style={containerStyle}
        onScroll={(event) => setIsScrolled(event.currentTarget.scrollTop > 0)}
      >
        <TopBar {...args} position="sticky" hasShadow={isScrolled}>
          <TopBar.Container placement="start">
            <TopBar.Title>Dashboards</TopBar.Title>
          </TopBar.Container>
          <TopBar.Container placement="end" isToolbar aria-label="Page actions">
            <Button startIcon={<IconPlus16 />}>Create dashboard</Button>
          </TopBar.Container>
        </TopBar>
        <Content />
      </div>
    );
  },
};

export const WithBreadcrumbs: Story = {
  render: (args) => (
    <TopBar {...args}>
      <TopBar.Container placement="start">
        <IconButton
          as="a"
          href="#"
          aria-label="Go to the home page"
          className={spacing({ mie: 'l' })}
        >
          <AppIcon />
        </IconButton>
        <Breadcrumbs size="big">
          <BreadcrumbItem href="#">Main</BreadcrumbItem>
          <BreadcrumbItem href="#">Section</BreadcrumbItem>
          <BreadcrumbItem href="#">Details</BreadcrumbItem>
          <BreadcrumbItem>Pipeline</BreadcrumbItem>
        </Breadcrumbs>
      </TopBar.Container>
      <TopBar.Container placement="end" isToolbar aria-label="Page actions">
        <IconButton variant="theme-contrast" aria-label="Search">
          <IconMagnifyingGlass16 />
        </IconButton>
        <IconButton variant="theme-contrast" aria-label="Filter">
          <IconFilter16 />
        </IconButton>
        <Button variant="fade-contrast-filled">Share</Button>
      </TopBar.Container>
    </TopBar>
  ),
};

export const CollapsedActions: Story = {
  render: function Render(args) {
    const actions = [
      { key: 'refresh', label: 'Refresh', icon: <IconArrowsRotate16 /> },
      { key: 'view', label: 'Change view', icon: <IconList16 /> },
      { key: 'filter', label: 'Filter', icon: <IconFilter16 /> },
      { key: 'print', label: 'Print the page', icon: <IconPrinter16 /> },
      { key: 'settings', label: 'Page settings', icon: <IconGear16 /> },
      { key: 'report', label: 'Report a bug', icon: <IconBug16 /> },
    ];

    /**
     * Everything on the bar that the actions may not use: its padding, the gap
     * between the two sides, and the room the breadcrumbs keep once they are fully
     * collapsed. The actions start moving into the "…" menu below this.
     */
    const RESERVED_SPACE = 250;

    const moreIndex = actions.length;

    // `parentRef` goes on the bar, not on the actions container: the bar keeps
    // its width when an action is hidden, so hiding one cannot trigger hiding
    // the next. `busy` is the part of that width the actions may not use.
    const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems<
      HTMLButtonElement,
      HTMLElement
    >({
      length: actions.length + 1,
      moreIndex,
      busy: RESERVED_SPACE,
    });

    const collapsedActions = actions.filter((_, index) => !visibleMap[index]);

    return (
      <TopBar {...args} ref={parentRef}>
        <TopBar.Container placement="start">
          <IconButton
            as="a"
            href="#"
            variant="fade-contrast"
            aria-label="Go to the home page"
            className={spacing({ mie: 'l' })}
          >
            <AppIcon />
          </IconButton>
          <Breadcrumbs size="big">
            <BreadcrumbItem href="#">Main</BreadcrumbItem>
            <BreadcrumbItem href="#">Section</BreadcrumbItem>
            <BreadcrumbItem href="#">Details</BreadcrumbItem>
            <BreadcrumbItem>Pipeline</BreadcrumbItem>
          </Breadcrumbs>
        </TopBar.Container>
        <TopBar.Container placement="end" isToolbar aria-label="Page actions">
          {actions.map((action, index) => (
            <IconButton
              key={action.key}
              ref={itemsRefs[index]}
              variant="theme-contrast"
              className={s.hiddenAction}
              aria-label={action.label}
              aria-hidden={!visibleMap[index] || undefined}
            >
              {action.icon}
            </IconButton>
          ))}
          <Menu
            control={({ ref, ...controlProps }) => (
              <IconButton
                {...controlProps}
                ref={mergeRefs(ref, itemsRefs[moreIndex])}
                variant="theme-contrast"
                className={s.hiddenAction}
                aria-label="More actions"
                aria-hidden={!visibleMap[moreIndex] || undefined}
              >
                <IconEllipsisHorizontal16 />
              </IconButton>
            )}
            placement="bottom end"
          >
            {collapsedActions.map((action) => (
              <Menu.Item key={action.key}>
                <Menu.ItemAddon>{action.icon}</Menu.ItemAddon>
                <Menu.ItemText>{action.label}</Menu.ItemText>
              </Menu.Item>
            ))}
          </Menu>
        </TopBar.Container>
      </TopBar>
    );
  },
};
