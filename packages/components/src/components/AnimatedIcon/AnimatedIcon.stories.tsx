import { useBoolean } from '@koobiq/react-core';
import {
  IconArrowDownToBracket16,
  IconChevronDown16,
  IconStar16,
  IconStarO16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { IconButton } from '../IconButton';
import { ProgressSpinner } from '../ProgressSpinner';

import { type AnimatedIconBaseProps } from './index.js';
import { AnimatedIcon } from './index.js';

const meta = {
  title: 'Components/AnimatedIcon',
  component: AnimatedIcon,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AnimatedIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: function Render(args: AnimatedIconBaseProps) {
    const [state, { toggle }] = useBoolean(false);

    return (
      <IconButton onPress={toggle} variant="theme-contrast">
        <AnimatedIcon
          icons={[
            <IconArrowDownToBracket16 key="arrow-down" />,
            <ProgressSpinner
              key="spinner"
              aria-label="progress"
              slotProps={{ spin: { style: { color: 'inherit' } } }}
            />,
          ]}
          activeIndex={+state}
          {...args}
        />
      </IconButton>
    );
  },
};

export const Icons: Story = {
  render: function Render(args: AnimatedIconBaseProps) {
    const [state, { toggle }] = useBoolean(false);

    return (
      <IconButton onPress={toggle} variant="theme-contrast">
        <AnimatedIcon
          icons={[<IconStarO16 key="star" />, <IconStar16 key="star-o" />]}
          activeIndex={+state}
          {...args}
        />
      </IconButton>
    );
  },
};

export const Directions: Story = {
  render: function Render(args: AnimatedIconBaseProps) {
    const [state, { toggle }] = useBoolean(false);

    return (
      <IconButton onPress={toggle} variant="theme-contrast">
        <AnimatedIcon
          icons={[<IconChevronDown16 key="chevron" />]}
          directions={[0, 180]}
          activeIndex={+state}
          {...args}
        />
      </IconButton>
    );
  },
};
