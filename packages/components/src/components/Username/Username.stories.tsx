import { useState } from 'react';

import { isNotNil } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Highlight } from '../Highlight';
import { Link } from '../Link';
import { SearchInput } from '../SearchInput';
import { Typography } from '../Typography';

import {
  Username,
  type UsernameProps,
  type UsernameUserInfo,
  formatUsername,
  buildUsernameText,
  usernameHintAffixes,
  usernamePropMode,
  usernamePropType,
} from './index.js';

const meta = {
  title: 'Components/Username',
  component: Username,
  subcomponents: {
    'Username.Primary': Username.Primary,
    'Username.Secondary': Username.Secondary,
    'Username.SecondaryHint': Username.SecondaryHint,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-07-22'],
} satisfies Meta<typeof Username>;

export default meta;
type Story = StoryObj<UsernameProps>;

export const Base: Story = {
  render: (args) => {
    const userInfo: UsernameUserInfo = {
      firstName: 'Maxwell',
      middleName: 'Alan',
      lastName: 'Root',
      login: 'mroot',
      site: 'corp',
    };

    return <Username {...args} userInfo={userInfo} />;
  },
};

export const Mode: Story = {
  render: (args) => {
    const userInfo: UsernameUserInfo = {
      firstName: 'Maxwell',
      middleName: 'Alan',
      lastName: 'Root',
      login: 'mroot',
      site: 'corp',
    };

    return (
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
            <Username {...args} mode={mode} userInfo={userInfo} />
          </FlexBox>
        ))}
      </FlexBox>
    );
  },
};

export const Type: Story = {
  render: (args) => {
    const userInfo: UsernameUserInfo = {
      firstName: 'Maxwell',
      middleName: 'Alan',
      lastName: 'Root',
      login: 'mroot',
      site: 'corp',
    };

    return (
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
                <Username {...args} type={type} userInfo={userInfo} />
              </Typography>
            ) : (
              <Username {...args} type={type} userInfo={userInfo} />
            )}
          </FlexBox>
        ))}
      </FlexBox>
    );
  },
};

export const Compact: Story = {
  render: (args) => {
    const userInfo: UsernameUserInfo = {
      firstName: 'Maxwell',
      middleName: 'Alan',
      lastName: 'Root',
      login: 'mroot',
      site: 'corp',
    };

    return (
      <FlexBox direction="column" gap="l">
        <FlexBox direction="column" gap="xs">
          <Typography
            as="span"
            variant="text-compact"
            color="contrast-secondary"
          >
            isCompact = false
          </Typography>
          <Username {...args} userInfo={userInfo} />
        </FlexBox>
        <FlexBox direction="column" gap="xs">
          <Typography
            as="span"
            variant="text-compact"
            color="contrast-secondary"
          >
            isCompact = true
          </Typography>
          <Username {...args} userInfo={userInfo} isCompact />
        </FlexBox>
      </FlexBox>
    );
  },
};

export const OnlyLogin: Story = {
  render: (args) => (
    <Username {...args} userInfo={{ login: 'mroot', site: 'corp' }} />
  ),
};

export const WithSite: Story = {
  render: (args) => {
    const userInfo: UsernameUserInfo = {
      firstName: 'Maxwell',
      middleName: 'Alan',
      lastName: 'Root',
      login: 'mroot',
      site: 'example.com',
    };

    return (
      <FlexBox direction="column" gap="l">
        <FlexBox direction="column" gap="xs">
          <Typography
            as="span"
            variant="text-compact"
            color="contrast-secondary"
          >
            non-compact with site
          </Typography>
          <Username {...args} userInfo={userInfo} />
        </FlexBox>
        <FlexBox direction="column" gap="xs">
          <Typography
            as="span"
            variant="text-compact"
            color="contrast-secondary"
          >
            compact with site
          </Typography>
          <Username {...args} userInfo={userInfo} isCompact />
        </FlexBox>
      </FlexBox>
    );
  },
};

export const CustomView: Story = {
  render: (args) => (
    <Username {...args}>
      <Username.Primary>Root M. A.</Username.Primary>
      <Username.Secondary>
        [mroot]
        <Username.SecondaryHint> (corp)</Username.SecondaryHint>
      </Username.Secondary>
    </Username>
  ),
};

export const AsLink: Story = {
  render: (args) => {
    const userInfo: UsernameUserInfo = {
      firstName: 'Maxwell',
      middleName: 'Alan',
      lastName: 'Root',
      login: 'mroot',
      site: 'corp',
    };

    return (
      <Link href="#">
        <Username {...args} type="inherit" userInfo={userInfo} />
      </Link>
    );
  },
};

export const SearchAndHighlight: Story = {
  render: function Render(args) {
    const [query, setQuery] = useState('');

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

    const {
      isCompact = false,
      fullNameFormat = 'lf.m.',
      formatter = formatUsername,
    } = args;

    // Mirrors Username's own primary/secondary/hint placement rules
    // (see Username.tsx) so this custom view stays consistent with it.
    const getDisplayParts = (user: UsernameUserInfo) => {
      const hasFullName = Boolean(user.firstName && user.lastName);
      const name = hasFullName ? formatter(user, fullNameFormat) : '';
      const primaryText = hasFullName ? name : user.login;

      const secondaryText = !isCompact && hasFullName ? user.login : undefined;

      const showSiteInSecondary = isNotNil(user.site && secondaryText);

      const primaryHoldsLogin = isCompact
        ? isNotNil(primaryText)
        : isNotNil(user.login) && !hasFullName;

      const showSiteInPrimary =
        isNotNil(user.site) && !showSiteInSecondary && primaryHoldsLogin;

      return {
        primaryText,
        secondaryText,
        showSiteInPrimary,
        showSiteInSecondary,
      };
    };

    // Search the text the story actually renders, so the story controls keep
    // filtering and highlighting in sync.
    const filtered = searchUsers.filter((user) => {
      const {
        primaryText,
        secondaryText,
        showSiteInPrimary,
        showSiteInSecondary,
      } = getDisplayParts(user);

      return buildUsernameText({
        name: primaryText ?? '',
        login: secondaryText,
        site: showSiteInPrimary || showSiteInSecondary ? user.site : undefined,
      })
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
            const {
              primaryText,
              secondaryText,
              showSiteInPrimary,
              showSiteInSecondary,
            } = getDisplayParts(user);

            const hint = user.site ? (
              <Username.SecondaryHint>
                {usernameHintAffixes.prefix}
                <Highlight text={user.site} query={query} />
                {usernameHintAffixes.suffix}
              </Username.SecondaryHint>
            ) : null;

            return (
              <Username key={user.login ?? user.firstName} {...args}>
                {primaryText && (
                  <Username.Primary>
                    <Highlight text={primaryText} query={query} />
                    {showSiteInPrimary && hint}
                  </Username.Primary>
                )}
                {secondaryText && (
                  <Username.Secondary>
                    <Highlight text={secondaryText} query={query} />
                    {showSiteInSecondary && hint}
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
  render: (args) => {
    const userInfo: UsernameUserInfo = {
      firstName: 'Maxwell',
      middleName: 'Alan',
      lastName: 'Root',
      login: 'mroot',
      site: 'corp',
    };

    const extendedMapping = {
      F: 'firstName',
      f: 'firstName',
      M: 'middleName',
      m: 'middleName',
      L: 'lastName',
      l: 'lastName',
    } as const;

    const formatUsernameExtended = (
      info: UsernameUserInfo | undefined,
      format: string
    ) =>
      formatUsername(info, format, {
        mapping: extendedMapping,
        literalPassthrough: true,
        caseDeterminesForm: true,
        uppercaseInitial: false,
        join: 'concat',
      });

    return (
      <FlexBox direction="column" gap="l">
        <FlexBox direction="column" gap="xs">
          <Typography
            as="span"
            variant="text-compact"
            color="contrast-secondary"
          >
            formatUsername (default) — format: &apos;lf.m.&apos;
          </Typography>
          <Username {...args} userInfo={userInfo} />
        </FlexBox>
        <FlexBox direction="column" gap="xs">
          <Typography
            as="span"
            variant="text-compact"
            color="contrast-secondary"
          >
            formatUsername (extended) — format: &apos;L f. m.&apos;
          </Typography>
          <Username
            {...args}
            userInfo={userInfo}
            formatter={formatUsernameExtended}
            fullNameFormat="L f. m."
          />
        </FlexBox>
        <FlexBox direction="column" gap="xs">
          <Typography
            as="span"
            variant="text-compact"
            color="contrast-secondary"
          >
            formatUsername (extended) — format: &apos;F L&apos;
          </Typography>
          <Username
            {...args}
            userInfo={userInfo}
            formatter={formatUsernameExtended}
            fullNameFormat="F L"
          />
        </FlexBox>
      </FlexBox>
    );
  },
};
