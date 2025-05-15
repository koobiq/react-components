import {
  IconAlignCenter16,
  IconAlignLeft16,
  IconAlignRight16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import type { ButtonToggleGroupProps } from './index.js';
import { ButtonToggleGroup, ButtonToggle } from './index.js';

const meta = {
  title: 'Components/ButtonToggleGroup',
  component: ButtonToggleGroup,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof ButtonToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: ButtonToggleGroupProps) => (
    <ButtonToggleGroup {...args}>
      <ButtonToggle id="left">
        <IconAlignLeft16 />
        Left
      </ButtonToggle>
      <ButtonToggle id="center">
        <IconAlignCenter16 />
        Center
      </ButtonToggle>
      <ButtonToggle id="right">
        <IconAlignRight16 />
        Right
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};
