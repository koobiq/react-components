import { useRef, useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import type { Key } from '@koobiq/react-core';
import {
  IconApple24,
  IconBsd24,
  IconBug16,
  IconCircleInfo16,
  IconUbuntu24,
  IconWindows24,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { useListData } from '../index';
import { Input } from '../Input';
import { spacing } from '../layout';
import { Link } from '../Link';
import { Toggle } from '../Toggle';
import { Typography } from '../Typography';

import { Tabs, Tab } from './index';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: { Tab },
  parameters: {
    layout: 'padded',
  },
  tags: ['status:updated', 'date:2026-06-29'],
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

export const Editable: Story = {
  render: function Render() {
    const content =
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias delectus fugit maxime nulla odio sunt ullam vitae! A aut beatae consequatur deserunt dicta dignissimos distinctio doloribus eos expedita fuga, hic illo ipsam ipsum iste, laboriosam nam neque nesciunt odio optio possimus, praesentium quasi quia quisquam sequi voluptatum. Amet, architecto, nisi.';

    const list = useListData({
      initialItems: [
        { id: 'bruteforce', title: 'Bruteforce', content },
        { id: 'complex-attack', title: 'Complex Attack', content },
        { id: 'ddos', title: 'DDoS', content },
        { id: 'dos', title: 'DoS', content },
        { id: 'hips', title: 'HIPS Alert', content },
        { id: 'identity-theft', title: 'Identity Theft', content },
        { id: 'ids-ips', title: 'IDS/IPS Alert', content },
        { id: 'misc', title: 'Miscellaneous', content },
      ],
    });

    const [selectedKey, setSelectedKey] = useState<Key | undefined>(
      list.items[0]?.id
    );

    const counter = useRef(0);

    const removeTabs = (keys: Set<Key>) => {
      if (selectedKey != null && keys.has(selectedKey)) {
        const idx = list.items.findIndex((item) => item.id === selectedKey);
        const next = list.items[idx + 1] ?? list.items[idx - 1];

        setSelectedKey(next?.id);
      }

      list.remove(...keys);
    };

    const addTab = () => {
      counter.current += 1;
      const id = `new-${counter.current}`;

      list.append({ id, title: `New tab ${counter.current}`, content });
      setSelectedKey(id);
    };

    return (
      <Tabs
        onAdd={addTab}
        items={list.items}
        onRemove={removeTabs}
        selectedKey={selectedKey}
        aria-label="Types of cyberattacks"
        onSelectionChange={setSelectedKey}
      >
        {(item) => (
          <Tab startAddon={<IconBug16 />} key={item.id} title={item.title}>
            {item.content}
          </Tab>
        )}
      </Tabs>
    );
  },
};

export const EditablePlayground: Story = {
  render: function Render() {
    const [isVertical, { set: setVertical }] = useBoolean(false);
    const [isUnderlined, { set: setUnderlined }] = useBoolean(false);
    const [isStretched, { set: setStretched }] = useBoolean(false);
    const [isDisabled, { set: setDisabled }] = useBoolean(false);

    const list = useListData({
      initialItems: [
        { id: 'bruteforce', title: 'Bruteforce' },
        { id: 'complex-attack', title: 'Complex Attack' },
        { id: 'ddos', title: 'DDoS' },
        { id: 'dos', title: 'DoS' },
        { id: 'hips', title: 'HIPS Alert' },
        { id: 'identity-theft', title: 'Identity Theft' },
        { id: 'ids-ips', title: 'IDS/IPS Alert' },
        { id: 'misc', title: 'Miscellaneous' },
      ],
    });

    const [selectedKey, setSelectedKey] = useState<Key | undefined>(
      list.items[0]?.id
    );

    const counter = useRef(0);

    const removeTabs = (keys: Set<Key>) => {
      if (selectedKey != null && keys.has(selectedKey)) {
        const idx = list.items.findIndex((item) => item.id === selectedKey);
        const next = list.items[idx + 1] ?? list.items[idx - 1];

        setSelectedKey(next?.id);
      }

      list.remove(...keys);
    };

    const addTab = () => {
      counter.current += 1;
      const id = `new-${counter.current}`;

      list.append({ id, title: `New tab ${counter.current}` });
      setSelectedKey(id);
    };

    return (
      <FlexBox direction="column" gap="l" alignItems="stretch">
        <FlexBox gap="l" alignItems="center">
          <Toggle isSelected={isVertical} onChange={setVertical}>
            Vertical
          </Toggle>
          <Toggle isSelected={isUnderlined} onChange={setUnderlined}>
            Underlined
          </Toggle>
          <Toggle isSelected={isStretched} onChange={setStretched}>
            Stretched
          </Toggle>
          <Toggle isSelected={isDisabled} onChange={setDisabled}>
            Disabled
          </Toggle>
        </FlexBox>
        <Tabs
          aria-label="Types of cyberattacks"
          items={list.items}
          orientation={isVertical ? 'vertical' : 'horizontal'}
          isUnderlined={isUnderlined}
          isStretched={isStretched}
          isDisabled={isDisabled}
          selectedKey={selectedKey}
          onSelectionChange={setSelectedKey}
          style={{
            blockSize: isVertical && !isUnderlined ? 280 : undefined,
          }}
          slotProps={{
            tabs: {
              style: {
                inlineSize: isVertical && !isUnderlined ? 240 : undefined,
              },
            },
          }}
          onAdd={addTab}
          onRemove={removeTabs}
        >
          {(item) => (
            <Tab startAddon={<IconBug16 />} key={item.id} title={item.title}>
              {item.title} content
            </Tab>
          )}
        </Tabs>
      </FlexBox>
    );
  },
};

export const WithIcons: Story = {
  render: function Render(args) {
    const [isVertical, { set }] = useBoolean(false);
    const [isUnderlined, { set: setIsUnderlined }] = useBoolean(false);

    return (
      <FlexBox direction="column" gap="l" alignItems="stretch">
        <FlexBox gap="l" alignItems="center">
          <Toggle isSelected={isVertical} onChange={set}>
            Vertical
          </Toggle>
          <Toggle isSelected={isUnderlined} onChange={setIsUnderlined}>
            Underlined
          </Toggle>
        </FlexBox>
        <Tabs
          aria-label="Types of cyberattacks"
          orientation={isVertical ? 'vertical' : 'horizontal'}
          {...args}
          isUnderlined={isUnderlined}
        >
          <Tab key="brute-force" title="BruteForce" startAddon={<IconBug16 />}>
            A brute-force attack systematically guesses passwords or
            cryptographic keys, often using automated tools to try vast
            combinations until access is gained. It doesn’t rely on clever
            tricks—just exhaustive search.
          </Tab>
          <Tab
            key="complex-attack"
            title="Complex Attack"
            startAddon={<IconBug16 />}
            endAddon={<IconCircleInfo16 />}
          >
            A denial-of-service attack floods a server or exploits
            resource-heavy operations to exhaust CPU, memory, bandwidth, or
            connection limits, causing slowdowns or outages without breaching
            the system.
          </Tab>
          <Tab key="ddos" title="DDoS" endAddon={<IconCircleInfo16 />}>
            Distributed Denial of Service (DDoS) uses a botnet of infected
            devices to send massive, coordinated traffic or resource-intensive
            requests to a victim, exhausting bandwidth, CPU, or connection
            limits and causing outages.
          </Tab>
        </Tabs>

        <Tabs
          aria-label="Types of cyberattacks"
          orientation={isVertical ? 'vertical' : 'horizontal'}
          {...args}
          isUnderlined={isUnderlined}
        >
          <Tab
            key="brute-force"
            aria-label="BruteForce"
            startAddon={<IconBug16 />}
            onlyIcon
          >
            A brute-force attack systematically guesses passwords or
            cryptographic keys, often using automated tools to try vast
            combinations until access is gained. It doesn’t rely on clever
            tricks—just exhaustive search.
          </Tab>
          <Tab
            key="complex-attack"
            aria-label="Complex Attack"
            startAddon={<IconBug16 />}
            onlyIcon
          >
            A denial-of-service attack floods a server or exploits
            resource-heavy operations to exhaust CPU, memory, bandwidth, or
            connection limits, causing slowdowns or outages without breaching
            the system.
          </Tab>
          <Tab
            key="ddos"
            aria-label="DDoS"
            endAddon={<IconCircleInfo16 />}
            onlyIcon
          >
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

export const CustomTabTitle: Story = {
  render: function Render(args) {
    return (
      <Tabs aria-label="Operation systems" {...args}>
        <Tab key="mac-os">
          <FlexBox direction="column" alignItems="center">
            <IconApple24 className={spacing({ mb: 'xxs' })} />
            <Typography variant="text-normal-medium">macOS</Typography>
            <Typography variant="text-compact" color="contrast-secondary">
              14.5+
            </Typography>
          </FlexBox>
        </Tab>
        <Tab key="windows">
          <FlexBox direction="column" alignItems="center">
            <IconWindows24 className={spacing({ mb: 'xxs' })} />
            <Typography variant="text-normal-medium">Windows</Typography>
            <Typography variant="text-compact" color="contrast-secondary">
              XP+
            </Typography>
          </FlexBox>
        </Tab>
        <Tab key="linux">
          <FlexBox direction="column" alignItems="center">
            <IconUbuntu24 className={spacing({ mb: 'xxs' })} />
            <Typography variant="text-normal-medium">Linux</Typography>
            <Typography variant="text-compact" color="contrast-secondary">
              Ubuntu 10+
            </Typography>
          </FlexBox>
        </Tab>
        <Tab key="free-bsd">
          <FlexBox direction="column" alignItems="center">
            <IconBsd24 className={spacing({ mb: 'xxs' })} />
            <Typography variant="text-normal-medium">FreeBSD</Typography>
            <Typography variant="text-compact" color="contrast-secondary">
              14.1+
            </Typography>
          </FlexBox>
        </Tab>
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

    const requiredFieldProps = {
      isRequired: true,
      slotProps: { label: { isRequired: false } },
    };

    return (
      <FlexBox>
        <div style={cardStyle}>
          <Tabs
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
            slotProps={{
              tabPanel: { style: { paddingInline: 0, paddingBlockEnd: 0 } },
            }}
            isStretched
          >
            <Tab key="login" title="Login">
              <Form style={{ inlineSize: 300 }}>
                <Input
                  {...requiredFieldProps}
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
                <Input
                  {...requiredFieldProps}
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
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
                  {...requiredFieldProps}
                  label="Name"
                  name="name"
                  type="text"
                  autoComplete="name"
                />
                <Input
                  {...requiredFieldProps}
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                />
                <Input
                  {...requiredFieldProps}
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
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

export const Stretched: Story = {
  render: function Render(args) {
    return (
      <Tabs aria-label="Types of cyberattacks" isStretched {...args}>
        <Tab key="brute-force" title="BruteForce" startAddon={<IconBug16 />}>
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

export const Scrolling: Story = {
  render: function Render() {
    const tabs = [
      { key: '0', title: 'Phishing' },
      {
        key: '1',
        title: 'Ransomware',
      },
      { key: '2', title: 'DDoS' },
      { key: '3', title: 'Supply-chain attack' },
      { key: '4', title: 'Zero-day (CVE-0)' },
      { key: '5', title: 'Insider threats' },
      { key: '6', title: 'Credential stuffing' },
      { key: '7', title: 'IoT botnets' },
      { key: '8', title: 'Self-propagating worms' },
      { key: '9', title: 'Social engineering' },
      { key: '10', title: 'Watering-hole attack' },
      { key: '11', title: 'Man-in-the-Middle (MitM)' },
      { key: '12', title: 'SQL/NoSQL injection' },
      { key: '13', title: 'Cross-Site Scripting (XSS)' },
      { key: '14', title: 'Kernel-level rootkits' },
      { key: '15', title: 'Cryptojacking' },
      { key: '16', title: 'Malvertising' },
      { key: '17', title: 'Business Email Compromise (BEC)' },
      { key: '18', title: 'Typosquatting and lookalike domains' },
      { key: '19', title: 'Brute force and rate limits' },
    ];

    return (
      <Tabs
        items={tabs}
        defaultSelectedKey="1"
        disabledKeys={['7', '12']}
        aria-label="Threat intelligence"
        isUnderlined
      >
        {({ key, title }) => (
          <Tab key={key} title={title}>
            {`${title} — brief overview of the attack scenario and typical indicators of compromise. Vector: network, email, supply chain, user action. Impact: data access, encryption, downtime. Mitigation: MFA, least privilege, segmentation, WAF, training.`}
          </Tab>
        )}
      </Tabs>
    );
  },
};

export const VerticalScrolling: Story = {
  render: function Render() {
    const tabs = [
      { key: '0', title: 'Phishing' },
      {
        key: '1',
        title: 'Ransomware',
      },
      { key: '2', title: 'DDoS' },
      { key: '3', title: 'Supply-chain attack' },
      { key: '4', title: 'Zero-day (CVE-0)' },
      { key: '5', title: 'Insider threats' },
      { key: '6', title: 'Credential stuffing' },
      { key: '7', title: 'IoT botnets' },
      { key: '8', title: 'Self-propagating worms' },
      { key: '9', title: 'Social engineering' },
      { key: '10', title: 'Watering-hole attack' },
      { key: '11', title: 'Man-in-the-Middle (MitM)' },
      { key: '12', title: 'SQL/NoSQL injection' },
      { key: '13', title: 'Cross-Site Scripting (XSS)' },
      { key: '14', title: 'Kernel-level rootkits' },
      { key: '15', title: 'Cryptojacking' },
      { key: '16', title: 'Malvertising' },
      { key: '17', title: 'Business Email Compromise (BEC)' },
      { key: '18', title: 'Typosquatting and lookalike domains' },
      { key: '19', title: 'Brute force and rate limits' },
    ];

    return (
      <Tabs
        items={tabs}
        orientation="vertical"
        defaultSelectedKey="1"
        style={{ blockSize: 200 }}
        disabledKeys={['7', '12']}
        aria-label="Threat intelligence"
        slotProps={{
          tabs: { style: { inlineSize: '30%' } },
        }}
      >
        {({ key, title }) => (
          <Tab key={key} title={title}>
            {`${title} — brief overview of the attack scenario and typical indicators of compromise. Vector: network, email, supply chain, user action. Impact: data access, encryption, downtime. Mitigation: MFA, least privilege, segmentation, WAF, training.`}
          </Tab>
        )}
      </Tabs>
    );
  },
};
