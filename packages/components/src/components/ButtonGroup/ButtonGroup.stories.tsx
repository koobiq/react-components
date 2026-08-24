import {
  IconBoxArchive16,
  IconChevronDownS16,
  IconClock16,
  IconEllipsisVertical16,
  IconMinus16,
  IconPlus16,
  IconTriangleExclamation16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';

import {
  ButtonGroup,
  type ButtonGroupProps,
  buttonGroupPropVariant,
} from './index';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  subcomponents: { Button },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-07-29'],
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<ButtonGroupProps>;

export const Base: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Archive</Button>
      <Button>Snooze</Button>
      <Button>Delete</Button>
    </ButtonGroup>
  ),
};

export const Variant: Story = {
  render: () => (
    <FlexBox gap="l" direction="column" alignItems="flex-start">
      {buttonGroupPropVariant.map((variant) => (
        <ButtonGroup key={variant} variant={variant}>
          <Button startIcon={<IconPlus16 />}>Archive</Button>
          <Button startIcon={<IconPlus16 />}>Snooze</Button>
          <Button startIcon={<IconPlus16 />}>Delete</Button>
        </ButtonGroup>
      ))}
    </FlexBox>
  ),
};

export const Content: Story = {
  render: () => (
    <FlexBox gap="l" direction="column" alignItems="center">
      <ButtonGroup variant="fade-contrast-filled">
        <Button
          startIcon={<IconBoxArchive16 />}
          endIcon={<IconChevronDownS16 />}
        >
          Archive
        </Button>
        <Button
          startIcon={<IconTriangleExclamation16 />}
          endIcon={<IconChevronDownS16 />}
        >
          Report
        </Button>
        <Button startIcon={<IconClock16 />} endIcon={<IconChevronDownS16 />}>
          Snooze
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="fade-contrast-filled">
        <Button startIcon={<IconBoxArchive16 />}>Archive</Button>
        <Button startIcon={<IconTriangleExclamation16 />}>Report</Button>
        <Button startIcon={<IconClock16 />}>Snooze</Button>
      </ButtonGroup>
      <ButtonGroup variant="fade-contrast-filled">
        <Button>Archive</Button>
        <Button>Report</Button>
        <Button>Snooze</Button>
      </ButtonGroup>
      <ButtonGroup variant="fade-contrast-filled">
        <Button
          startIcon={<IconBoxArchive16 />}
          aria-label="Archive"
          onlyIcon
        />
        <Button
          startIcon={<IconTriangleExclamation16 />}
          aria-label="Report"
          onlyIcon
        />
        <Button onlyIcon startIcon={<IconClock16 />} aria-label="Snooze" />
      </ButtonGroup>
    </FlexBox>
  ),
};

export const MixedContent: Story = {
  render: () => (
    <ButtonGroup variant="fade-contrast-filled">
      <Button startIcon={<IconBoxArchive16 />} endIcon={<IconChevronDownS16 />}>
        Archive
      </Button>
      <Button endIcon={<IconChevronDownS16 />}>Report</Button>
      <Button>Snooze</Button>
      <Button
        startIcon={<IconEllipsisVertical16 />}
        aria-label="More actions"
        onlyIcon
      />
    </ButtonGroup>
  ),
};

export const OnlyIcon: Story = {
  render: () => (
    <FlexBox gap="l" direction="column" alignItems="flex-start">
      {buttonGroupPropVariant.map((variant) => (
        <ButtonGroup key={variant} variant={variant}>
          <Button startIcon={<IconMinus16 />} aria-label="Decrease" onlyIcon />
          <Button startIcon={<IconPlus16 />} aria-label="Increase" onlyIcon />
        </ButtonGroup>
      ))}
    </FlexBox>
  ),
};

export const Orientation: Story = {
  render: () => (
    <FlexBox gap="l" alignItems="flex-start">
      {buttonGroupPropVariant.map((variant) => (
        <ButtonGroup key={variant} variant={variant} orientation="vertical">
          <Button startIcon={<IconPlus16 />} aria-label="Increase" onlyIcon />
          <Button startIcon={<IconMinus16 />} aria-label="Decrease" onlyIcon />
        </ButtonGroup>
      ))}
    </FlexBox>
  ),
};

export const Disabled: Story = {
  render: () => (
    <FlexBox gap="l" direction="column" alignItems="flex-start">
      <ButtonGroup isDisabled>
        <Button>Archive</Button>
        <Button>Snooze</Button>
        <Button>Delete</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button>Archive</Button>
        <Button isDisabled>Snooze</Button>
        <Button>Delete</Button>
      </ButtonGroup>
    </FlexBox>
  ),
};

export const Loading: Story = {
  render: () => (
    <FlexBox gap="l" direction="column" alignItems="flex-start">
      <ButtonGroup variant="fade-contrast-filled">
        <Button>Archive</Button>
        <Button>Report</Button>
        <Button isLoading startIcon={<IconClock16 />}>
          Snooze
        </Button>
      </ButtonGroup>
      <ButtonGroup variant="fade-contrast-filled" isLoading>
        <Button>Archive</Button>
        <Button>Report</Button>
        <Button startIcon={<IconClock16 />}>Snooze</Button>
      </ButtonGroup>
    </FlexBox>
  ),
};

export const RootTag: Story = {
  render: () => (
    <ButtonGroup as="section" aria-label="Message actions">
      <Button>Archive</Button>
      <Button>Snooze</Button>
      <Button>Delete</Button>
    </ButtonGroup>
  ),
};
