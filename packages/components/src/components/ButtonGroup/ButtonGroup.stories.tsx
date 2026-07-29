import {
  IconBoxArchive16,
  IconChevronDown16,
  IconClock16,
  IconEllipsisVertical16,
  IconMinus16,
  IconPlus16,
  IconTriangleExclamation16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button, buttonPropVariant, type ButtonPropVariant } from '../Button';
import { FlexBox } from '../FlexBox';
import { Menu } from '../Menu';
import { Typography } from '../Typography';

import { ButtonGroup, type ButtonGroupProps } from './index';

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
      {buttonPropVariant.map((variant) => (
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
          endIcon={<IconChevronDown16 />}
        >
          Archive
        </Button>
        <Button
          startIcon={<IconTriangleExclamation16 />}
          endIcon={<IconChevronDown16 />}
        >
          Report
        </Button>
        <Button startIcon={<IconClock16 />} endIcon={<IconChevronDown16 />}>
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
      <Button startIcon={<IconBoxArchive16 />} endIcon={<IconChevronDown16 />}>
        Archive
      </Button>
      <Button endIcon={<IconChevronDown16 />}>Report</Button>
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
      {buttonPropVariant.map((variant) => (
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
      {buttonPropVariant.map((variant) => (
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
    <ButtonGroup variant="fade-contrast-filled">
      <Button>Archive</Button>
      <Button>Report</Button>
      <Button isLoading startIcon={<IconClock16 />}>
        Snooze
      </Button>
    </ButtonGroup>
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

export const SplitButton: Story = {
  render: () => {
    const splitButtonVariants: {
      label: string;
      variant: ButtonPropVariant;
    }[] = [
      { label: 'Filled Contrast', variant: 'contrast-filled' },
      { label: 'Filled Fade Contrast', variant: 'fade-contrast-filled' },
      { label: 'Outline Fade Theme', variant: 'fade-theme-outline' },
      { label: 'Outline Fade Contrast', variant: 'fade-contrast-outline' },
      { label: 'Transparent Theme', variant: 'theme-transparent' },
      { label: 'Transparent Contrast', variant: 'contrast-transparent' },
    ];

    return (
      <>
        <style>{`
        .split-button-demo {
          display: grid;
          grid-template-columns: repeat(2, max-content);
          gap: var(--kbq-size-3xl) var(--kbq-size-6xl);
        }

        .split-button-demo__group
          > [data-slot='button']:not(:last-child) {
          margin-inline-end: 0;
          box-shadow: none;
        }

        .split-button-demo__group[data-variant='contrast-filled'] {
          --split-button-divider-color: var(--kbq-line-on-contrast-fade);
        }

        .split-button-demo__group[data-variant='fade-contrast-filled'],
        .split-button-demo__group[data-variant='fade-contrast-outline'],
        .split-button-demo__group[data-variant='contrast-transparent'] {
          --split-button-divider-color: var(--kbq-line-contrast-fade);
        }

        .split-button-demo__group[data-variant='fade-theme-outline'],
        .split-button-demo__group[data-variant='theme-transparent'] {
          --split-button-divider-color: var(--kbq-line-theme-fade);
        }

        .split-button-demo__group > [data-slot='button']:last-child {
          background-image: linear-gradient(
            var(--split-button-divider-color),
            var(--split-button-divider-color)
          );
          background-repeat: no-repeat;
          background-position: 0 50%;
          background-size: var(--kbq-size-border-width) var(--kbq-size-l);
        }

        .split-button-demo__group
          > [data-slot='button']:last-child[aria-expanded='true'],
        .split-button-demo__group
          > [data-slot='button']:last-child:is(
            :hover,
            :focus-visible
          ),
        .split-button-demo__group
          > [data-slot='button']:not(:last-child):is(
            :hover,
            :focus-visible
          )
          + [data-slot='button']:last-child {
          background-image: none;
        }
      `}</style>
        <div className="split-button-demo">
          {splitButtonVariants.map(({ label, variant }) => (
            <FlexBox
              key={variant}
              gap="s"
              direction="column"
              alignItems="flex-start"
            >
              <Typography>{label}</Typography>
              <ButtonGroup
                className="split-button-demo__group"
                variant={variant}
                aria-label={`${label} split action`}
              >
                <Button startIcon={<IconPlus16 />}>Split Button</Button>
                <Menu
                  placement="bottom end"
                  control={(props) => (
                    <Button
                      {...props}
                      onlyIcon
                      aria-label={`More ${label} actions`}
                      startIcon={<IconChevronDown16 />}
                    />
                  )}
                >
                  <Menu.Item key="template">Create from template</Menu.Item>
                  <Menu.Item key="import">Import</Menu.Item>
                </Menu>
              </ButtonGroup>
            </FlexBox>
          ))}
        </div>
      </>
    );
  },
};
