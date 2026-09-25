import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Username, usernamePropMode, usernamePropType } from './index.js';
import type { UsernameUserInfo } from './index.js';

const meta = {
  title: 'E2E/Username',
  component: Username,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Username>;

export default meta;

type Story = StoryObj<typeof Username>;

const userInfo: UsernameUserInfo = {
  firstName: 'Maxwell',
  middleName: 'Alan',
  lastName: 'Root',
  login: 'mroot',
  site: 'corp',
};

// `inherit` takes its styles from a context, which an isolated story does not have.
const types = usernamePropType.filter((type) => type !== 'inherit');

export const ModeAndType: Story = {
  render: () => (
    <E2eGrid columns={types.length}>
      {usernamePropMode.flatMap((mode) =>
        [false, true].flatMap((isCompact) =>
          types.map((type) => (
            <Username
              key={`${mode}-${isCompact}-${type}`}
              mode={mode}
              type={type}
              isCompact={isCompact}
              userInfo={userInfo}
            />
          ))
        )
      )}
    </E2eGrid>
  ),
};
