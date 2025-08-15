import type { CSSProperties } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconArrowUpRightFromSquare16,
  IconChevronDown16,
  IconExclamationTriangle16,
  IconPlus16,
} from '@koobiq/react-icons';
import * as Icons from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '../Checkbox';
import { FlexBox } from '../FlexBox';

import { buttonPropVariant, Button, type ButtonProps } from './index.js';

const mappingIcons = Object.entries(Icons).reduce((acc, [key, Icon]) => ({
  ...acc,
  [key]: <Icon />,
}));

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    startIcon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
    endIcon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<ButtonProps>;

export const Base: Story = {
  render: (args) => (
    // eslint-disable-next-line no-alert
    <Button onPress={() => alert('Press')} {...args}>
      Button
    </Button>
  ),
};

export const WithIcons: Story = {
  render: (args) => (
    <Button
      startIcon={<IconPlus16 />}
      endIcon={<IconChevronDown16 />}
      {...args}
    >
      Button
    </Button>
  ),
};

export const OnlyIcon: Story = {
  render: (args) => (
    <FlexBox gap="l">
      {buttonPropVariant.map((variant) => (
        <Button
          key={variant}
          variant={variant}
          aria-label="Add"
          startIcon={<IconPlus16 />}
          onlyIcon
          {...args}
        />
      ))}
    </FlexBox>
  ),
};

export const Loading: Story = {
  render: (args) => (
    <Button isLoading {...args}>
      Button
    </Button>
  ),
};

export const Variant: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="column" alignItems="stretch">
      {buttonPropVariant.map((variant) => (
        <Button
          startIcon={<IconPlus16 />}
          key={variant}
          variant={variant}
          {...args}
        >
          variant = {variant}
        </Button>
      ))}
    </FlexBox>
  ),
};

export const Disabled: Story = {
  render: function Render(args) {
    const [isLoading, { set }] = useBoolean(false);

    return (
      <FlexBox gap="l" direction="column">
        <Button isLoading={isLoading} isDisabled {...args}>
          Button
        </Button>
        <Checkbox isSelected={isLoading} onChange={set}>
          Progress
        </Checkbox>
      </FlexBox>
    );
  },
};

export const LongLabel: Story = {
  render: (args) => (
    <FlexBox style={{ inlineSize: 240 }}>
      <Button startIcon={<IconPlus16 />} {...args}>
        A very, very, very long label inside the button
      </Button>
    </FlexBox>
  ),
};

export const FullWidth: Story = {
  render: (args) => (
    <FlexBox style={{ inlineSize: 240 }}>
      <Button startIcon={<IconPlus16 />} fullWidth {...args}>
        Button
      </Button>
    </FlexBox>
  ),
};

export const RootTag: Story = {
  render: () => (
    <Button as="a" href="/" endIcon={<IconArrowUpRightFromSquare16 />}>
      Link
    </Button>
  ),
};

export const Custom: Story = {
  render: () => {
    const destructiveFilledBtnStyle = {
      '--button-bg-color': 'var(--kbq-background-error)',
      '--button-bg-color-hover': 'var(--kbq-states-background-error-hover)',
      '--button-bg-color-active': 'var(--kbq-states-background-error-active)',
    } as CSSProperties;

    return (
      <Button
        variant="contrast-filled"
        style={destructiveFilledBtnStyle}
        startIcon={<IconExclamationTriangle16 />}
      >
        Destructive button
      </Button>
    );
  },
};
