import {
  IconAlignCenter16,
  IconAlignLeft16,
  IconAlignRight16,
  IconBug16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import type { ButtonToggleGroupBaseProps } from './index.js';
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
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup defaultSelectedKeys={['center']} {...args}>
      <ButtonToggle id="left" icon={<IconAlignLeft16 />}>
        Left
      </ButtonToggle>
      <ButtonToggle id="center" icon={<IconAlignCenter16 />}>
        Center
      </ButtonToggle>
      <ButtonToggle id="right" icon={<IconAlignRight16 />}>
        Right
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};

export const FullWidth: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup defaultSelectedKeys={['left']} fullWidth {...args}>
      <ButtonToggle id="left" icon={<IconAlignLeft16 />}>
        Left
      </ButtonToggle>
      <ButtonToggle id="center" icon={<IconAlignCenter16 />}>
        Center
      </ButtonToggle>
      <ButtonToggle id="right" icon={<IconAlignRight16 />}>
        Right
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};

export const Disabled: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup defaultSelectedKeys={['center']} {...args}>
      <ButtonToggle id="left" icon={<IconAlignLeft16 />}>
        Left
      </ButtonToggle>
      <ButtonToggle id="center" disabled icon={<IconAlignCenter16 />}>
        Center
      </ButtonToggle>
      <ButtonToggle id="right" icon={<IconAlignRight16 />}>
        Right
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};

export const LongText: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup
      defaultSelectedKeys={['first']}
      style={{ inlineSize: 360 }}
      {...args}
    >
      <ButtonToggle id="first" icon={<IconBug16 />}>
        First
      </ButtonToggle>
      <ButtonToggle id="second" icon={<IconBug16 />}>
        Second
      </ButtonToggle>
      <ButtonToggle id="third" icon={<IconBug16 />}>
        Lorem ipsum dolor sit amet.
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};

export const EqualItemSize: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup
      defaultSelectedKeys={['first']}
      style={{ inlineSize: 300 }}
      equalItemSize
      {...args}
    >
      <ButtonToggle id="first" icon={<IconBug16 />}>
        First
      </ButtonToggle>
      <ButtonToggle id="second" icon={<IconBug16 />}>
        Second
      </ButtonToggle>
      <ButtonToggle id="third" icon={<IconBug16 />}>
        Lorem ipsum dolor sit amet.
      </ButtonToggle>
    </ButtonToggleGroup>
  ),
};
