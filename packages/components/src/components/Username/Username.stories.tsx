import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Link } from '../Link';

import {
  Username,
  UsernamePrimary,
  UsernameSecondary,
  UsernameSecondaryHint,
  type UsernameProps,
  formatUsernameCustom,
  usernamePropMode,
  usernamePropType,
} from './index.js';

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
  args: {
    userInfo: defaultUserInfo,
  },
  argTypes: {
    mode: { control: { type: 'select' }, options: usernamePropMode },
    type: { control: { type: 'select' }, options: usernamePropType },
  },
} satisfies Meta<typeof Username>;

export default meta;
type Story = StoryObj<UsernameProps>;

export const Base: Story = {
  render: (args) => <Username {...args} />,
};

export const Mode: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="l">
      {usernamePropMode.map((mode) => (
        <FlexBox key={mode} direction="column" gap="xs">
          <span
            style={{
              color: 'var(--kbq-foreground-contrast-secondary)',
              fontSize: '12px',
            }}
          >
            mode = {mode}
          </span>
          <Username {...args} mode={mode} />
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
          <span
            style={{
              color: 'var(--kbq-foreground-contrast-secondary)',
              fontSize: '12px',
            }}
          >
            type = {type}
          </span>
          {type === 'inherit' ? (
            <span style={{ color: 'var(--kbq-foreground-theme)' }}>
              <Username {...args} type={type} />
            </span>
          ) : (
            <Username {...args} type={type} />
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
        <span
          style={{
            color: 'var(--kbq-foreground-contrast-secondary)',
            fontSize: '12px',
          }}
        >
          isCompact = false
        </span>
        <Username {...args} isCompact={false} />
      </FlexBox>
      <FlexBox direction="column" gap="xs">
        <span
          style={{
            color: 'var(--kbq-foreground-contrast-secondary)',
            fontSize: '12px',
          }}
        >
          isCompact = true
        </span>
        <Username {...args} isCompact />
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
        <span
          style={{
            color: 'var(--kbq-foreground-contrast-secondary)',
            fontSize: '12px',
          }}
        >
          non-compact with site
        </span>
        <Username
          {...args}
          userInfo={{ ...defaultUserInfo, site: 'example.com' }}
        />
      </FlexBox>
      <FlexBox direction="column" gap="xs">
        <span
          style={{
            color: 'var(--kbq-foreground-contrast-secondary)',
            fontSize: '12px',
          }}
        >
          compact with site
        </span>
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
    <Username {...args}>
      <UsernamePrimary>Root M. A.</UsernamePrimary>
      <UsernameSecondary>
        [mroot]
        <UsernameSecondaryHint> (corp)</UsernameSecondaryHint>
      </UsernameSecondary>
    </Username>
  ),
};

export const AsLink: Story = {
  render: (args) => (
    <Link href="#">
      <Username {...args} type="inherit" />
    </Link>
  ),
};

export const CustomFormatter: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="l">
      <FlexBox direction="column" gap="xs">
        <span
          style={{
            color: 'var(--kbq-foreground-contrast-secondary)',
            fontSize: '12px',
          }}
        >
          formatUsername (default) — format: &apos;lf.m.&apos;
        </span>
        <Username {...args} />
      </FlexBox>
      <FlexBox direction="column" gap="xs">
        <span
          style={{
            color: 'var(--kbq-foreground-contrast-secondary)',
            fontSize: '12px',
          }}
        >
          formatUsernameCustom — format: &apos;L f. m.&apos;
        </span>
        <Username
          {...args}
          formatter={formatUsernameCustom}
          fullNameFormat="L f. m."
        />
      </FlexBox>
      <FlexBox direction="column" gap="xs">
        <span
          style={{
            color: 'var(--kbq-foreground-contrast-secondary)',
            fontSize: '12px',
          }}
        >
          formatUsernameCustom — format: &apos;F L&apos;
        </span>
        <Username
          {...args}
          formatter={formatUsernameCustom}
          fullNameFormat="F L"
        />
      </FlexBox>
    </FlexBox>
  ),
};
