import { IconBell16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import {
  IconItem,
  iconItemPropColor,
  iconItemPropSize,
  iconItemPropVariant,
} from './index.js';

const meta = {
  title: 'E2E/IconItem',
  component: IconItem,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof IconItem>;

export default meta;

type Story = StoryObj<typeof IconItem>;

export const Variant: Story = {
  render: () => (
    <E2eGrid columns={iconItemPropColor.length}>
      {iconItemPropSize.flatMap((size) =>
        iconItemPropVariant.flatMap((variant) =>
          iconItemPropColor.map((color) => (
            <IconItem
              key={`${size}-${variant}-${color}`}
              size={size}
              variant={variant}
              color={color}
            >
              <IconBell16 />
            </IconItem>
          ))
        )
      )}
    </E2eGrid>
  ),
};
