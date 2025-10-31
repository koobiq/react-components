import { useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconApple24,
  IconBsd24,
  IconBug16,
  IconUbuntu24,
  IconWindows24,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { Input } from '../Input';
import { spacing } from '../layout';
import { Link } from '../Link';
import { Toggle } from '../Toggle';
import { Typography } from '../Typography';

import { Tabs, Tab } from './index.js';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: { Tab },
  parameters: {
    layout: 'padded',
  },
  tags: ['status:new'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Base: Story = {
  render: function Render(args) {
    return (
      <Tabs aria-label="Types of cyberattacks" {...args}>
        <Tab key="brute-force" title="BruteForce">
          A brute-force attack systematically guesses passwords or cryptographic
          keys, often using automated tools to try vast combinations until
          access is gained. It doesn’t rely on clever tricks—just exhaustive
          search.
        </Tab>
        <Tab key="complex-attack" title="Complex Attack">
          A denial-of-service attack floods a server or exploits resource-heavy
          operations to exhaust CPU, memory, bandwidth, or connection limits,
          causing slowdowns or outages without breaching the system.
        </Tab>
        <Tab key="ddos" title="DDoS">
          Distributed Denial of Service (DDoS) uses a botnet of infected devices
          to send massive, coordinated traffic or resource-intensive requests to
          a victim, exhausting bandwidth, CPU, or connection limits and causing
          outages.
        </Tab>
      </Tabs>
    );
  },
};

export const Dynamic: Story = {
  render: function Render() {
    const tabs = [
      {
        id: 'brute-force',
        label: 'BruteForce',
        content:
          'A brute-force attack systematically guesses passwords or cryptographic keys, often using automated tools to try vast combinations until access is gained. It doesn’t rely on clever tricks—just exhaustive search.',
      },
      {
        id: 'complex-attack',
        label: 'Complex Attack',
        content:
          'A denial-of-service attack floods a server or exploits resource-heavy operations to exhaust CPU, memory, bandwidth, or connection limits causing slowdowns or outages without breaching the system.',
      },
      {
        id: 'ddos',
        label: 'DDoS',
        content:
          'Distributed Denial of Service (DDoS) uses a botnet of infected devices to send massive, coordinated traffic or resource-intensive requests to a victim, exhausting bandwidth, CPU, or connection limits and causing outages.',
      },
    ];

    return (
      <Tabs aria-label="Types of cyberattacks" items={tabs}>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            {item.content}
          </Tab>
        )}
      </Tabs>
    );
  },
};

export const WithIcons: Story = {
  render: function Render(args) {
    return (
      <Tabs aria-label="Types of cyberattacks" {...args}>
        <Tab
          key="brute-force"
          title={
            <FlexBox alignItems="center" gap="m">
              <IconBug16 />
              <span>BruteForce</span>
            </FlexBox>
          }
        >
          A brute-force attack systematically guesses passwords or cryptographic
          keys, often using automated tools to try vast combinations until
          access is gained. It doesn’t rely on clever tricks—just exhaustive
          search.
        </Tab>
        <Tab
          key="complex-attack"
          title={
            <FlexBox alignItems="center" gap="m">
              <IconBug16 />
              <span>Complex Attack</span>
            </FlexBox>
          }
        >
          A denial-of-service attack floods a server or exploits resource-heavy
          operations to exhaust CPU, memory, bandwidth, or connection limits,
          causing slowdowns or outages without breaching the system.
        </Tab>
        <Tab
          key="ddos"
          title={
            <FlexBox alignItems="center" gap="m">
              <IconBug16 />
              <span>DDoS</span>
            </FlexBox>
          }
        >
          Distributed Denial of Service (DDoS) uses a botnet of infected devices
          to send massive, coordinated traffic or resource-intensive requests to
          a victim, exhausting bandwidth, CPU, or connection limits and causing
          outages.
        </Tab>
      </Tabs>
    );
  },
};

export const CustomTabTitle: Story = {
  render: function Render(args) {
    return (
      <Tabs aria-label="Operation systems" {...args}>
        <Tab
          key="mac-os"
          title={
            <FlexBox direction="column" alignItems="center">
              <IconApple24 className={spacing({ mb: 'xxs' })} />
              <Typography variant="text-normal-medium">macOS</Typography>
              <Typography variant="text-compact" color="contrast-secondary">
                14.5+
              </Typography>
            </FlexBox>
          }
        />
        <Tab
          key="windows"
          title={
            <FlexBox direction="column" alignItems="center">
              <IconWindows24 className={spacing({ mb: 'xxs' })} />
              <Typography variant="text-normal-medium">Windows</Typography>
              <Typography variant="text-compact" color="contrast-secondary">
                XP+
              </Typography>
            </FlexBox>
          }
        />
        <Tab
          key="linux"
          title={
            <FlexBox direction="column" alignItems="center">
              <IconUbuntu24 className={spacing({ mb: 'xxs' })} />
              <Typography variant="text-normal-medium">Linux</Typography>
              <Typography variant="text-compact" color="contrast-secondary">
                Ubuntu 10+
              </Typography>
            </FlexBox>
          }
        />
        <Tab
          key="free-bsd"
          title={
            <FlexBox direction="column" alignItems="center">
              <IconBsd24 className={spacing({ mb: 'xxs' })} />
              <Typography variant="text-normal-medium">FreeBSD</Typography>
              <Typography variant="text-compact" color="contrast-secondary">
                14.1+
              </Typography>
            </FlexBox>
          }
        />
      </Tabs>
    );
  },
};

export const Disabled: Story = {
  render: function Render(args) {
    return (
      <Tabs aria-label="Types of cyberattacks" isDisabled {...args}>
        <Tab key="brute-force" title="BruteForce">
          A brute-force attack systematically guesses passwords or cryptographic
          keys, often using automated tools to try vast combinations until
          access is gained. It doesn’t rely on clever tricks—just exhaustive
          search.
        </Tab>
        <Tab key="complex-attack" title="Complex Attack">
          A denial-of-service attack floods a server or exploits resource-heavy
          operations to exhaust CPU, memory, bandwidth, or connection limits,
          causing slowdowns or outages without breaching the system.
        </Tab>
        <Tab key="ddos" title="DDoS">
          Distributed Denial of Service (DDoS) uses a botnet of infected devices
          to send massive, coordinated traffic or resource-intensive requests to
          a victim, exhausting bandwidth, CPU, or connection limits and causing
          outages.
        </Tab>
      </Tabs>
    );
  },
};

export const DisabledItem: Story = {
  render: function Render(args) {
    return (
      <Tabs
        aria-label="Types of cyberattacks"
        disabledKeys={['brute-force']}
        {...args}
      >
        <Tab key="brute-force" title="BruteForce">
          A brute-force attack systematically guesses passwords or cryptographic
          keys, often using automated tools to try vast combinations until
          access is gained. It doesn’t rely on clever tricks—just exhaustive
          search.
        </Tab>
        <Tab key="complex-attack" title="Complex Attack">
          A denial-of-service attack floods a server or exploits resource-heavy
          operations to exhaust CPU, memory, bandwidth, or connection limits,
          causing slowdowns or outages without breaching the system.
        </Tab>
        <Tab key="ddos" title="DDoS">
          Distributed Denial of Service (DDoS) uses a botnet of infected devices
          to send massive, coordinated traffic or resource-intensive requests to
          a victim, exhausting bandwidth, CPU, or connection limits and causing
          outages.
        </Tab>
      </Tabs>
    );
  },
};

export const Vertical: Story = {
  render: function Render(args) {
    const [isVertical, { set }] = useBoolean(true);

    return (
      <FlexBox direction="column" gap="l">
        <Toggle isSelected={isVertical} onChange={set}>
          Vertical
        </Toggle>
        <Tabs
          aria-label="Types of cyberattacks"
          orientation={isVertical ? 'vertical' : 'horizontal'}
          {...args}
        >
          <Tab key="brute-force" title="BruteForce">
            A brute-force attack systematically guesses passwords or
            cryptographic keys, often using automated tools to try vast
            combinations until access is gained. It doesn’t rely on clever
            tricks—just exhaustive search.
          </Tab>
          <Tab key="complex-attack" title="Complex Attack">
            A denial-of-service attack floods a server or exploits
            resource-heavy operations to exhaust CPU, memory, bandwidth, or
            connection limits, causing slowdowns or outages without breaching
            the system.
          </Tab>
          <Tab key="ddos" title="DDoS">
            Distributed Denial of Service (DDoS) uses a botnet of infected
            devices to send massive, coordinated traffic or resource-intensive
            requests to a victim, exhausting bandwidth, CPU, or connection
            limits and causing outages.
          </Tab>
        </Tabs>
      </FlexBox>
    );
  },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState<string | number>('ddos');

    return (
      <Tabs
        aria-label="Types of cyberattacks"
        onSelectionChange={setSelected}
        selectedKey={selected}
        {...args}
      >
        <Tab key="brute-force" title="BruteForce">
          A brute-force attack systematically guesses passwords or cryptographic
          keys, often using automated tools to try vast combinations until
          access is gained. It doesn’t rely on clever tricks—just exhaustive
          search.
        </Tab>
        <Tab key="complex-attack" title="Complex Attack">
          A denial-of-service attack floods a server or exploits resource-heavy
          operations to exhaust CPU, memory, bandwidth, or connection limits,
          causing slowdowns or outages without breaching the system.
        </Tab>
        <Tab key="ddos" title="DDoS">
          Distributed Denial of Service (DDoS) uses a botnet of infected devices
          to send massive, coordinated traffic or resource-intensive requests to
          a victim, exhausting bandwidth, CPU, or connection limits and causing
          outages.
        </Tab>
      </Tabs>
    );
  },
};

export const Links: Story = {
  render: function Render(args) {
    return (
      <Tabs aria-label="Tabs" keyboardActivation="manual" {...args}>
        <Tab key="/" href="/" title="Home" />
        <Tab key="/photos" href="/photos" title="Photos" />
        <Tab key="/music" href="/music" title="Music" />
        <Tab key="/videos" href="/videos" title="Videos" />
      </Tabs>
    );
  },
};

export const WithForm: Story = {
  parameters: {
    layout: 'centered',
  },
  render: function Render() {
    const [selected, setSelected] = useState<string | number>('login');

    const cardStyle = {
      borderRadius: 'var(--kbq-size-m)',
      boxShadow: 'var(--kbq-shadow-overlay)',
      padding: '1.5em',
    };

    return (
      <FlexBox>
        <div style={cardStyle}>
          <Tabs
            fullWidth
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
            slotProps={{
              tabPanel: { style: { paddingInline: 0, paddingBlockEnd: 0 } },
            }}
          >
            <Tab key="login" title="Login">
              <Form style={{ inlineSize: 300 }}>
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
                <Typography>
                  Need to create an account?{' '}
                  <Link onPress={() => setSelected('sign-up')}>Sign up</Link>
                </Typography>
                <Form.Actions>
                  <Button fullWidth>Login</Button>
                </Form.Actions>
              </Form>
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <Form style={{ inlineSize: 300 }}>
                <Input
                  isRequired
                  label="Name"
                  placeholder="Enter your name"
                  type="password"
                />
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />
                <Typography>
                  Already have an account?{' '}
                  <Link onPress={() => setSelected('login')}>Login</Link>
                </Typography>
                <Form.Actions>
                  <Button fullWidth>Sign up</Button>
                </Form.Actions>
              </Form>
            </Tab>
          </Tabs>
        </div>
      </FlexBox>
    );
  },
};

export const Underlined: Story = {
  render: function Render(args) {
    return (
      <Tabs aria-label="Types of cyberattacks" isUnderlined {...args}>
        <Tab key="brute-force" title="BruteForce">
          A brute-force attack systematically guesses passwords or cryptographic
          keys, often using automated tools to try vast combinations until
          access is gained. It doesn’t rely on clever tricks—just exhaustive
          search.
        </Tab>
        <Tab key="complex-attack" title="Complex Attack">
          A denial-of-service attack floods a server or exploits resource-heavy
          operations to exhaust CPU, memory, bandwidth, or connection limits,
          causing slowdowns or outages without breaching the system.
        </Tab>
        <Tab key="ddos" title="DDoS">
          Distributed Denial of Service (DDoS) uses a botnet of infected devices
          to send massive, coordinated traffic or resource-intensive requests to
          a victim, exhausting bandwidth, CPU, or connection limits and causing
          outages.
        </Tab>
      </Tabs>
    );
  },
};

export const Scroll: Story = {
  render: function Render(args) {
    return (
      <Tabs aria-label="Types of cyberattacks" {...args}>
        <>
          {new Array(20).fill(0).map((_, i) => (
            <Tab key={i} title={`Tab ${i + 1}`}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat,
              ratione.
            </Tab>
          ))}
        </>
      </Tabs>
    );
  },
};
