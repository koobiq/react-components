import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { Link } from '../Link';

import { Alert, alertPropStatus } from './index.js';
import type { AlertProps } from './index.js';

const meta = {
  title: 'E2E/Alert',
  component: Alert,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof Alert>;

// Every optional part, then none of them.
const parts: AlertProps[] = [
  {
    title: 'Title',
    action: (
      <Link as="button" isPseudo>
        Action
      </Link>
    ),
    onClose: () => {},
  },
  { hideIcon: true },
];

const styles: AlertProps[] = [
  {},
  { isColored: true },
  { isCompact: true },
  { isColored: true, isCompact: true },
];

export const StatusAndStyle: Story = {
  render: () => (
    <E2eGrid columns={alertPropStatus.length}>
      {parts.flatMap((part, partIndex) =>
        styles.flatMap((style, styleIndex) =>
          alertPropStatus.map((status) => (
            <Alert
              key={`${partIndex}-${styleIndex}-${status}`}
              status={status}
              {...part}
              {...style}
            >
              {status}
            </Alert>
          ))
        )
      )}
    </E2eGrid>
  ),
};
