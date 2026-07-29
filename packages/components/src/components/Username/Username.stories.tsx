import { useState, type ReactNode } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Link } from '../Link';
import { SearchInput } from '../SearchInput';
import { Typography } from '../Typography';

import {
  Username,
  type UsernameProps,
  type UsernameUserInfo,
  formatUsername,
  buildUsernameText,
  usernamePropMode,
  usernamePropType,
} from './index.js';

const extendedMapping = {
  F: 'firstName',
  f: 'firstName',
  M: 'middleName',
  m: 'middleName',
  L: 'lastName',
  l: 'lastName',
} as const;

const formatUsernameExtended = (
  userInfo: UsernameUserInfo | undefined,
  format: string
) =>
  formatUsername(userInfo, format, {
    mapping: extendedMapping,
    literalPassthrough: true,
    caseDeterminesForm: true,
    uppercaseInitial: false,
    join: 'concat',
  });

const defaultUserInfo = {
  firstName: 'Maxwell',
  middleName: 'Alan',
  lastName: 'Root',
  login: 'mroot',
  site: 'corp',
};

const meta = {
  title: 'Components/Username',
  component: Username,
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-07-22'],
} satisfies Meta<typeof Username>;

export default meta;
type Story = StoryObj<UsernameProps>;

export const Base: Story = {
  render: (args) => <Username {...args} userInfo={defaultUserInfo} />,
};

export const Mode: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="l">
      {usernamePropMode.map((mode) => (
        <FlexBox key={mode} direction="column" gap="xs">
          <Typography
            as="span"
            variant="text-compact"
            color="contrast-secondary"
          >
            mode = {mode}
          </Typography>
          <Username {...args} mode={mode} userInfo={defaultUserInfo} />
        </FlexBox>
      ))}
    </FlexBox>
  ),
};

export const Type: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="l">
      {usernamePropType.map((type) => (
        <FlexBox key={type} direction="column" gap="xs">
          <Typography
            as="span"
            variant="text-compact"
            color="contrast-secondary"
          >
            type = {type}
          </Typography>

          {type === 'inherit' ? (
            <Typography as="span" color="theme-secondary">
              <Username {...args} type={type} userInfo={defaultUserInfo} />
            </Typography>
          ) : (
            <Username {...args} type={type} userInfo={defaultUserInfo} />
          )}
        </FlexBox>
      ))}
    </FlexBox>
  ),
};

export const Compact: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="l">
      <FlexBox direction="column" gap="xs">
        <Typography as="span" variant="text-compact" color="contrast-secondary">
          isCompact = false
        </Typography>
        <Username {...args} userInfo={defaultUserInfo} />
      </FlexBox>
      <FlexBox direction="column" gap="xs">
        <Typography as="span" variant="text-compact" color="contrast-secondary">
          isCompact = true
        </Typography>
        <Username {...args} userInfo={defaultUserInfo} isCompact />
      </FlexBox>
    </FlexBox>
  ),
};

export const OnlyLogin: Story = {
  render: (args) => (
    <Username {...args} userInfo={{ login: 'mroot', site: 'corp' }} />
  ),
};

export const WithSite: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="l">
      <FlexBox direction="column" gap="xs">
        <Typography as="span" variant="text-compact" color="contrast-secondary">
          non-compact with site
        </Typography>
        <Username
          {...args}
          userInfo={{ ...defaultUserInfo, site: 'example.com' }}
        />
      </FlexBox>
      <FlexBox direction="column" gap="xs">
        <Typography as="span" variant="text-compact" color="contrast-secondary">
          compact with site
        </Typography>
        <Username
          {...args}
          userInfo={{ ...defaultUserInfo, site: 'example.com' }}
          isCompact
        />
      </FlexBox>
    </FlexBox>
  ),
};

export const CustomView: Story = {
  render: (args) => (
    <Username {...args} userInfo={defaultUserInfo}>
      <Username.Primary>Root M. A.</Username.Primary>
      <Username.Secondary>
        [mroot]
        <Username.SecondaryHint> (corp)</Username.SecondaryHint>
      </Username.Secondary>
    </Username>
  ),
};

export const AsLink: Story = {
  render: (args) => (
    <Link href="#">
      <Username {...args} type="inherit" userInfo={defaultUserInfo} />
    </Link>
  ),
};

const searchUsers: UsernameUserInfo[] = [
  {
    firstName: 'Maxwell',
    middleName: 'Alan',
    lastName: 'Root',
    login: 'mroot',
    site: 'corp',
  },
  { firstName: 'Jane', lastName: 'Smith', login: 'jsmith', site: 'corp' },
  { firstName: 'Bob', lastName: 'Johnson', login: 'bjohnson' },
  { login: 'ghost', site: 'external' },
];

function highlightMatch(text: string, query: string): ReactNode {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;

  return (
    <>
      {text.slice(0, index)}
      <mark style={{ background: 'var(--kbq-states-theme-transparent-hover)' }}>
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

export const SearchAndHighlight: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [query, setQuery] = useState('');

    const filtered = searchUsers.filter((user) => {
      const name = formatUsername(user, 'lf.m.');

      return buildUsernameText({ name, login: user.login, site: user.site })
        .toLowerCase()
        .includes(query.toLowerCase());
    });

    return (
      <FlexBox direction="column" gap="m" style={{ minInlineSize: 280 }}>
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search users..."
        />
        <FlexBox direction="column" gap="xs">
          {filtered.map((user) => {
            const name = formatUsername(user, 'lf.m.');

            return (
              <Username
                key={user.login ?? user.firstName}
                {...args}
                userInfo={user}
              >
                {name && (
                  <Username.Primary>
                    {highlightMatch(name, query)}
                  </Username.Primary>
                )}
                {user.login && (
                  <Username.Secondary>
                    {highlightMatch(user.login, query)}
                    {user.site && (
                      <Username.SecondaryHint>
                        {' '}
                        ({highlightMatch(user.site, query)})
                      </Username.SecondaryHint>
                    )}
                  </Username.Secondary>
                )}
              </Username>
            );
          })}
        </FlexBox>
      </FlexBox>
    );
  },
};

export const CustomFormatter: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="l">
      <FlexBox direction="column" gap="xs">
        <Typography as="span" variant="text-compact" color="contrast-secondary">
          formatUsername (default) — format: &apos;lf.m.&apos;
        </Typography>
        <Username {...args} userInfo={defaultUserInfo} />
      </FlexBox>
      <FlexBox direction="column" gap="xs">
        <Typography as="span" variant="text-compact" color="contrast-secondary">
          formatUsername (extended) — format: &apos;L f. m.&apos;
        </Typography>
        <Username
          {...args}
          userInfo={defaultUserInfo}
          formatter={formatUsernameExtended}
          fullNameFormat="L f. m."
        />
      </FlexBox>
      <FlexBox direction="column" gap="xs">
        <Typography as="span" variant="text-compact" color="contrast-secondary">
          formatUsername (extended) — format: &apos;F L&apos;
        </Typography>
        <Username
          {...args}
          userInfo={defaultUserInfo}
          formatter={formatUsernameExtended}
          fullNameFormat="F L"
        />
      </FlexBox>
    </FlexBox>
  ),
};
