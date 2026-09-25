import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { Typography } from '../Typography';

import { ClampedList } from './index.js';

const meta = {
  title: 'E2E/ClampedList',
  component: ClampedList,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof ClampedList>;

export default meta;

type Story = StoryObj<typeof ClampedList>;

const items = [
  'Brute Force',
  'Input Capture',
  'Network Sniffing',
  'OS Credential Dumping',
  'Unsecured Credentials',
];

export const CollapsedAndExpanded: Story = {
  render: () => (
    <E2eGrid columns={2}>
      {[false, true].map((defaultExpanded) => (
        <div key={String(defaultExpanded)} style={{ inlineSize: 240 }}>
          <ClampedList
            items={items}
            collapsedVisibleCount={2}
            hiddenThreshold={1}
            defaultExpanded={defaultExpanded}
          >
            {({ visibleItems }) =>
              visibleItems.map((item) => (
                <Typography key={item}>{item}</Typography>
              ))
            }
          </ClampedList>
        </div>
      ))}
    </E2eGrid>
  ),
};
