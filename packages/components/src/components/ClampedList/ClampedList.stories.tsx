import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { FlexBox } from '../FlexBox';
import { Link } from '../Link';
import { Toggle } from '../Toggle';
import { Typography } from '../Typography';

import { ClampedList, type ClampedListProps } from './index';

type Item = {
  id: number | string;
  name: string;
  url: string;
};

const meta = {
  title: 'Components/ClampedList',
  component: ClampedList,
  parameters: {
    layout: 'padded',
  },
  tags: ['status:new', 'date:2026-08-14'],
} satisfies Meta<typeof ClampedList>;

export default meta;
type Story = StoryObj<ClampedListProps<Item>>;

export const Base: Story = {
  render: function Render(args) {
    const items = [
      {
        id: 'T1557',
        name: 'Adversary-in-the-Middle',
        url: 'https://attack.mitre.org/techniques/T1557/',
      },
      {
        id: 'T1110',
        name: 'Brute Force',
        url: 'https://attack.mitre.org/techniques/T1110/',
      },
      {
        id: 'T1555',
        name: 'Credentials from Password Stores',
        url: 'https://attack.mitre.org/techniques/T1555/',
      },
      {
        id: 'T1212',
        name: 'Exploitation for Credential Access',
        url: 'https://attack.mitre.org/techniques/T1212/',
      },
      {
        id: 'T1187',
        name: 'Forced Authentication',
        url: 'https://attack.mitre.org/techniques/T1187/',
      },
      {
        id: 'T1606',
        name: 'Forge Web Credentials',
        url: 'https://attack.mitre.org/techniques/T1606/',
      },
      {
        id: 'T1056',
        name: 'Input Capture',
        url: 'https://attack.mitre.org/techniques/T1056/',
      },
      {
        id: 'T1556',
        name: 'Modify Authentication Process',
        url: 'https://attack.mitre.org/techniques/T1556/',
      },
      {
        id: 'T1111',
        name: 'Multi-Factor Authentication Interception',
        url: 'https://attack.mitre.org/techniques/T1111/',
      },
      {
        id: 'T1621',
        name: 'Multi-Factor Authentication Request Generation',
        url: 'https://attack.mitre.org/techniques/T1621/',
      },
      {
        id: 'T1040',
        name: 'Network Sniffing',
        url: 'https://attack.mitre.org/techniques/T1040/',
      },
      {
        id: 'T1003',
        name: 'OS Credential Dumping',
        url: 'https://attack.mitre.org/techniques/T1003/',
      },
      {
        id: 'T1528',
        name: 'Steal Application Access Token',
        url: 'https://attack.mitre.org/techniques/T1528/',
      },
      {
        id: 'T1649',
        name: 'Steal or Forge Authentication Certificates',
        url: 'https://attack.mitre.org/techniques/T1649/',
      },
      {
        id: 'T1558',
        name: 'Steal or Forge Kerberos Tickets',
        url: 'https://attack.mitre.org/techniques/T1558/',
      },
      {
        id: 'T1539',
        name: 'Steal Web Session Cookie',
        url: 'https://attack.mitre.org/techniques/T1539/',
      },
      {
        id: 'T1552',
        name: 'Unsecured Credentials',
        url: 'https://attack.mitre.org/techniques/T1552/',
      },
    ];

    return (
      <ClampedList {...args} items={items}>
        {({ visibleItems }) => (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              columnGap: 'var(--kbq-size-m)',
              rowGap: 'var(--kbq-size-xxs)',
            }}
          >
            {visibleItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridColumn: '1 / -1',
                  gridTemplateColumns: 'subgrid',
                  alignItems: 'start',
                }}
              >
                <Link href={item.url} target="_blank" rel="noreferrer">
                  {item.name}
                </Link>
                <Typography>{item.id}</Typography>
              </div>
            ))}
          </div>
        )}
      </ClampedList>
    );
  },
};

export const CustomVisibility: Story = {
  render: function Render() {
    const items = [
      {
        id: 'T1557',
        name: 'Adversary-in-the-Middle',
        url: 'https://attack.mitre.org/techniques/T1557/',
      },
      {
        id: 'T1110',
        name: 'Brute Force',
        url: 'https://attack.mitre.org/techniques/T1110/',
      },
      {
        id: 'T1555',
        name: 'Credentials from Password Stores',
        url: 'https://attack.mitre.org/techniques/T1555/',
      },
      {
        id: 'T1212',
        name: 'Exploitation for Credential Access',
        url: 'https://attack.mitre.org/techniques/T1212/',
      },
      {
        id: 'T1187',
        name: 'Forced Authentication',
        url: 'https://attack.mitre.org/techniques/T1187/',
      },
      {
        id: 'T1606',
        name: 'Forge Web Credentials',
        url: 'https://attack.mitre.org/techniques/T1606/',
      },
      {
        id: 'T1056',
        name: 'Input Capture',
        url: 'https://attack.mitre.org/techniques/T1056/',
      },
      {
        id: 'T1556',
        name: 'Modify Authentication Process',
        url: 'https://attack.mitre.org/techniques/T1556/',
      },
      {
        id: 'T1111',
        name: 'Multi-Factor Authentication Interception',
        url: 'https://attack.mitre.org/techniques/T1111/',
      },
      {
        id: 'T1621',
        name: 'Multi-Factor Authentication Request Generation',
        url: 'https://attack.mitre.org/techniques/T1621/',
      },
      {
        id: 'T1040',
        name: 'Network Sniffing',
        url: 'https://attack.mitre.org/techniques/T1040/',
      },
      {
        id: 'T1003',
        name: 'OS Credential Dumping',
        url: 'https://attack.mitre.org/techniques/T1003/',
      },
      {
        id: 'T1528',
        name: 'Steal Application Access Token',
        url: 'https://attack.mitre.org/techniques/T1528/',
      },
      {
        id: 'T1649',
        name: 'Steal or Forge Authentication Certificates',
        url: 'https://attack.mitre.org/techniques/T1649/',
      },
      {
        id: 'T1558',
        name: 'Steal or Forge Kerberos Tickets',
        url: 'https://attack.mitre.org/techniques/T1558/',
      },
      {
        id: 'T1539',
        name: 'Steal Web Session Cookie',
        url: 'https://attack.mitre.org/techniques/T1539/',
      },
      {
        id: 'T1552',
        name: 'Unsecured Credentials',
        url: 'https://attack.mitre.org/techniques/T1552/',
      },
    ];

    return (
      <ClampedList items={items} collapsedVisibleCount={4} hiddenThreshold={3}>
        {({ visibleItems }) => (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto',
              columnGap: 'var(--kbq-size-m)',
              rowGap: 'var(--kbq-size-xxs)',
            }}
          >
            {visibleItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridColumn: '1 / -1',
                  gridTemplateColumns: 'subgrid',
                  alignItems: 'start',
                }}
              >
                <Link href={item.url} target="_blank" rel="noreferrer">
                  {item.name}
                </Link>
                <Typography>{item.id}</Typography>
              </div>
            ))}
          </div>
        )}
      </ClampedList>
    );
  },
};

export const Controlled: Story = {
  render: function Render() {
    const [isExpanded, setExpanded] = useState(false);

    const items = [
      {
        id: 'T1557',
        name: 'Adversary-in-the-Middle',
        url: 'https://attack.mitre.org/techniques/T1557/',
      },
      {
        id: 'T1110',
        name: 'Brute Force',
        url: 'https://attack.mitre.org/techniques/T1110/',
      },
      {
        id: 'T1555',
        name: 'Credentials from Password Stores',
        url: 'https://attack.mitre.org/techniques/T1555/',
      },
      {
        id: 'T1212',
        name: 'Exploitation for Credential Access',
        url: 'https://attack.mitre.org/techniques/T1212/',
      },
      {
        id: 'T1187',
        name: 'Forced Authentication',
        url: 'https://attack.mitre.org/techniques/T1187/',
      },
      {
        id: 'T1606',
        name: 'Forge Web Credentials',
        url: 'https://attack.mitre.org/techniques/T1606/',
      },
      {
        id: 'T1056',
        name: 'Input Capture',
        url: 'https://attack.mitre.org/techniques/T1056/',
      },
      {
        id: 'T1556',
        name: 'Modify Authentication Process',
        url: 'https://attack.mitre.org/techniques/T1556/',
      },
      {
        id: 'T1111',
        name: 'Multi-Factor Authentication Interception',
        url: 'https://attack.mitre.org/techniques/T1111/',
      },
      {
        id: 'T1621',
        name: 'Multi-Factor Authentication Request Generation',
        url: 'https://attack.mitre.org/techniques/T1621/',
      },
      {
        id: 'T1040',
        name: 'Network Sniffing',
        url: 'https://attack.mitre.org/techniques/T1040/',
      },
      {
        id: 'T1003',
        name: 'OS Credential Dumping',
        url: 'https://attack.mitre.org/techniques/T1003/',
      },
      {
        id: 'T1528',
        name: 'Steal Application Access Token',
        url: 'https://attack.mitre.org/techniques/T1528/',
      },
      {
        id: 'T1649',
        name: 'Steal or Forge Authentication Certificates',
        url: 'https://attack.mitre.org/techniques/T1649/',
      },
      {
        id: 'T1558',
        name: 'Steal or Forge Kerberos Tickets',
        url: 'https://attack.mitre.org/techniques/T1558/',
      },
      {
        id: 'T1539',
        name: 'Steal Web Session Cookie',
        url: 'https://attack.mitre.org/techniques/T1539/',
      },
      {
        id: 'T1552',
        name: 'Unsecured Credentials',
        url: 'https://attack.mitre.org/techniques/T1552/',
      },
    ];

    return (
      <FlexBox direction="column" gap="m" alignItems="stretch">
        <Toggle
          style={{ alignSelf: 'flex-start' }}
          isSelected={isExpanded}
          onChange={setExpanded}
        >
          Expanded
        </Toggle>
        <ClampedList
          items={items}
          isExpanded={isExpanded}
          onExpandedChange={setExpanded}
        >
          {({ visibleItems }) => (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) auto',
                columnGap: 'var(--kbq-size-m)',
                rowGap: 'var(--kbq-size-xxs)',
              }}
            >
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'grid',
                    gridColumn: '1 / -1',
                    gridTemplateColumns: 'subgrid',
                    alignItems: 'start',
                  }}
                >
                  <Link href={item.url} target="_blank" rel="noreferrer">
                    {item.name}
                  </Link>
                  <Typography>{item.id}</Typography>
                </div>
              ))}
            </div>
          )}
        </ClampedList>
      </FlexBox>
    );
  },
};

export const FlatList: Story = {
  render: function Render() {
    const items = [
      'Australia',
      'Austria',
      'Argentina',
      'Belgium',
      'Brazil',
      'United Kingdom',
      'Germany',
      'Greece',
      'Denmark',
      'Egypt',
      'India',
      'Spain',
      'Italy',
      'Canada',
      'Mexico',
      'Netherlands',
      'Norway',
      'Poland',
      'Portugal',
      'Russia',
      'United States',
      'Thailand',
      'Turkey',
      'France',
      'Japan',
    ].map((name, index) => ({ id: index, name, url: '#' }));

    return (
      <ClampedList
        items={items}
        moreText={`${items.length - 10} more`}
        lessText="Collapse"
        slotProps={{ toggle: { style: { margin: 0 } } }}
      >
        {({ visibleItems }) =>
          visibleItems.map((item) => (
            <div key={item.id} style={{ display: 'inline-flex' }}>
              <Typography as="span" style={{ whiteSpace: 'nowrap' }}>
                {item.name}
                {',\u00a0'}
              </Typography>
            </div>
          ))
        }
      </ClampedList>
    );
  },
};

export const FlatListWithDotSeparators: Story = {
  render: function Render() {
    const items = [
      'Australia',
      'Austria',
      'Argentina',
      'Belgium',
      'Brazil',
      'United Kingdom',
      'Germany',
      'Greece',
      'Denmark',
      'Egypt',
      'India',
      'Spain',
      'Italy',
      'Canada',
      'Mexico',
      'Netherlands',
      'Norway',
      'Poland',
      'Portugal',
      'Russia',
      'United States',
      'Thailand',
      'Turkey',
      'France',
      'Japan',
    ].map((name, index) => ({ id: index, name, url: '#' }));

    return (
      <ClampedList
        items={items}
        moreText={`${items.length - 10} more`}
        lessText="Collapse"
        slotProps={{ toggle: { style: { margin: 0 } } }}
      >
        {({ visibleItems }) =>
          visibleItems.map((item) => (
            <Typography
              key={item.id}
              as="span"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {item.name}
              <span
                aria-hidden
                style={{
                  display: 'inline-flex',
                  marginInline: 'var(--kbq-size-xxs)',
                  color: 'var(--kbq-foreground-contrast-secondary)',
                }}
              >
                <svg width="2" height="2" viewBox="0 0 2 2">
                  <circle cx="1" cy="1" r="1" fill="currentColor" />
                </svg>
              </span>
            </Typography>
          ))
        }
      </ClampedList>
    );
  },
};
