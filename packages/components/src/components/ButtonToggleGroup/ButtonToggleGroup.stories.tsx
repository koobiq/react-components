import { useState } from 'react';

import {
  IconAlignCenter16,
  IconAlignLeft16,
  IconAlignRight16,
  IconBug16,
  IconTextBold16,
  IconTextItalic16,
  IconTextUnderline16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Typography, type TypographyPropAlign } from '../Typography';

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
    <FlexBox style={{ inlineSize: 400 }}>
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
    </FlexBox>
  ),
};

export const DisabledGroup: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup defaultSelectedKeys={['center']} disabled {...args}>
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

export const DisabledItem: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup defaultSelectedKeys={['center']} {...args}>
      <ButtonToggle id="left" icon={<IconAlignLeft16 />}>
        Left
      </ButtonToggle>
      <ButtonToggle id="center" icon={<IconAlignCenter16 />} disabled>
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

export const ControlledSelection: Story = {
  name: 'Controlled selection',
  render: function Render(args: ButtonToggleGroupBaseProps) {
    const [selected, setSelected] = useState<Set<string | number>>(
      new Set(['center'])
    );

    const align = Array.from(selected)[0] as TypographyPropAlign;

    return (
      <FlexBox direction="column" gap="l" style={{ width: 300 }}>
        <ButtonToggleGroup
          selectedKeys={selected}
          onSelectionChange={setSelected}
          style={{ inlineSize: 'inherit' }}
          {...args}
        >
          <ButtonToggle id="start" icon={<IconAlignLeft16 />}>
            Left
          </ButtonToggle>
          <ButtonToggle id="center" icon={<IconAlignCenter16 />}>
            Center
          </ButtonToggle>
          <ButtonToggle id="end" icon={<IconAlignRight16 />}>
            Right
          </ButtonToggle>
        </ButtonToggleGroup>
        <Typography align={align}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi, quos!
        </Typography>
      </FlexBox>
    );
  },
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

export const Icon: Story = {
  render: (args: ButtonToggleGroupBaseProps) => (
    <ButtonToggleGroup equalItemSize {...args}>
      <ButtonToggle id="bold" icon={<IconTextBold16 />} />
      <ButtonToggle id="italic" icon={<IconTextItalic16 />} />
      <ButtonToggle id="underline" icon={<IconTextUnderline16 />} />
    </ButtonToggleGroup>
  ),
};
