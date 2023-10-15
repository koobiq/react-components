import { IconStar16, IconStarO16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox, type CheckboxProps } from './index.js';

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: CheckboxProps) => (
    <Checkbox
      aria-label="checkbox"
      {...args}
      style={({ hovered, pressed }) => ({
        cursor: 'pointer',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(hovered && { opacity: 0.9 }),
        ...(pressed && { opacity: 0.8 }),
      })}
    >
      {({ checked }) =>
        checked ? (
          <IconStar16 width={24} height={24} />
        ) : (
          <IconStarO16 width={24} height={24} />
        )
      }
    </Checkbox>
  ),
};
