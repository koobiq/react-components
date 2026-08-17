import {
  IconChevronDownS16,
  IconClock16,
  IconPlus16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Menu } from '../Menu';
import { Typography } from '../Typography';

import {
  SplitButton,
  type SplitButtonProps,
  type SplitButtonPropVariant,
} from './index';

import './__stories__/styles.css';

const meta = {
  title: 'Components/SplitButton',
  component: SplitButton,
  subcomponents: { Button, Menu },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-08-14'],
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<SplitButtonProps>;

export const Base: Story = {
  render: (args) => {
    const menuItems = (
      <>
        <Menu.Item key="template">Create from template</Menu.Item>
        <Menu.Item key="import">Import</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </>
    );

    return (
      <SplitButton {...args} aria-label="Split action">
        <Button>Split Button</Button>
        <Menu
          placement="bottom end"
          control={(props) => (
            <Button
              {...props}
              onlyIcon
              aria-label="More options"
              startIcon={<IconChevronDownS16 />}
            />
          )}
        >
          {menuItems}
        </Menu>
      </SplitButton>
    );
  },
};

export const Variant: Story = {
  render: () => {
    const menuItems = (
      <>
        <Menu.Item key="template">Create from template</Menu.Item>
        <Menu.Item key="import">Import</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </>
    );

    const splitButtonVariants: {
      label: string;
      variant: SplitButtonPropVariant;
    }[] = [
      { label: 'Filled Contrast', variant: 'contrast-filled' },
      { label: 'Filled Fade Contrast', variant: 'fade-contrast-filled' },
      { label: 'Outline Fade Theme', variant: 'fade-theme-outline' },
      { label: 'Outline Fade Contrast', variant: 'fade-contrast-outline' },
      { label: 'Transparent Theme', variant: 'theme-transparent' },
      { label: 'Transparent Contrast', variant: 'contrast-transparent' },
    ];

    return (
      <div className="split-button-demo">
        {splitButtonVariants.map(({ label, variant }) => (
          <FlexBox
            key={variant}
            gap="s"
            direction="column"
            alignItems="flex-start"
          >
            <Typography className="split-button-demo__header">
              {label}
            </Typography>
            <SplitButton variant={variant} aria-label={`${label} split action`}>
              <Button startIcon={<IconPlus16 />}>Split Button</Button>
              <Menu
                placement="bottom end"
                control={(props) => (
                  <Button
                    {...props}
                    onlyIcon
                    aria-label={`More ${label} actions`}
                    startIcon={<IconChevronDownS16 />}
                  />
                )}
              >
                {menuItems}
              </Menu>
            </SplitButton>
          </FlexBox>
        ))}
      </div>
    );
  },
};

export const Content: Story = {
  render: () => {
    const menuItems = (
      <>
        <Menu.Item key="template">Create from template</Menu.Item>
        <Menu.Item key="import">Import</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </>
    );

    return (
      <FlexBox
        gap="l"
        alignItems="center"
        direction="column"
        justifyContent="center"
      >
        <SplitButton
          aria-label="Split action"
          style={{ justifyContent: 'center' }}
        >
          <Button onlyIcon aria-label="Add" startIcon={<IconPlus16 />} />
          <Menu
            placement="bottom end"
            control={(props) => (
              <Button
                {...props}
                onlyIcon
                aria-label="More options"
                startIcon={<IconChevronDownS16 />}
              />
            )}
          >
            {menuItems}
          </Menu>
        </SplitButton>

        <SplitButton
          aria-label="Split action"
          style={{ justifyContent: 'center' }}
        >
          <Button>Split Button</Button>
          <Menu
            placement="bottom end"
            control={(props) => (
              <Button
                {...props}
                onlyIcon
                aria-label="More options"
                startIcon={<IconChevronDownS16 />}
              />
            )}
          >
            {menuItems}
          </Menu>
        </SplitButton>

        <SplitButton
          aria-label="Split action"
          style={{ justifyContent: 'center' }}
        >
          <Button startIcon={<IconPlus16 />}>Split Button</Button>
          <Menu
            placement="bottom end"
            control={(props) => (
              <Button
                {...props}
                onlyIcon
                aria-label="More options"
                startIcon={<IconChevronDownS16 />}
              />
            )}
          >
            {menuItems}
          </Menu>
        </SplitButton>
      </FlexBox>
    );
  },
};

export const TextOverflow: Story = {
  render: () => {
    const menuItems = (
      <>
        <Menu.Item key="template">Create from template</Menu.Item>
        <Menu.Item key="import">Import</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </>
    );

    return (
      <div style={{ maxInlineSize: 320 }}>
        <SplitButton aria-label="Split action">
          <Button startIcon={<IconPlus16 />}>
            Save engineering time with unified payments functionality. We obsess
            over the maze of gateways, payments rails, and financial
            institutions that make up the global economic landscape so that your
            teams can build what you need on one platform.
          </Button>
          <Menu
            placement="bottom end"
            control={(props) => (
              <Button
                {...props}
                onlyIcon
                aria-label="More options"
                startIcon={<IconChevronDownS16 />}
              />
            )}
          >
            {menuItems}
          </Menu>
        </SplitButton>
      </div>
    );
  },
};

export const DisabledState: Story = {
  render: () => {
    const menuItems = (
      <>
        <Menu.Item key="template">Create from template</Menu.Item>
        <Menu.Item key="import">Import</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </>
    );

    return (
      <FlexBox gap="l" alignItems="flex-start">
        <FlexBox gap="s" direction="column" alignItems="flex-start">
          <Typography className="split-button-demo__header">
            Primary Disabled
          </Typography>
          <SplitButton aria-label="Split action">
            <Button isDisabled startIcon={<IconPlus16 />}>
              Split Button
            </Button>
            <Menu
              placement="bottom end"
              control={(props) => (
                <Button
                  {...props}
                  onlyIcon
                  aria-label="More options"
                  startIcon={<IconChevronDownS16 />}
                />
              )}
            >
              {menuItems}
            </Menu>
          </SplitButton>
        </FlexBox>

        <FlexBox gap="s" direction="column" alignItems="flex-start">
          <Typography className="split-button-demo__header">
            Secondary Disabled
          </Typography>
          <SplitButton aria-label="Split action">
            <Button startIcon={<IconPlus16 />}>Split Button</Button>
            <Menu
              placement="bottom end"
              control={(props) => (
                <Button
                  {...props}
                  isDisabled
                  onlyIcon
                  aria-label="More options"
                  startIcon={<IconChevronDownS16 />}
                />
              )}
            >
              {menuItems}
            </Menu>
          </SplitButton>
        </FlexBox>

        <FlexBox gap="s" direction="column" alignItems="flex-start">
          <Typography className="split-button-demo__header">
            Completely Disabled
          </Typography>
          <SplitButton isDisabled aria-label="Split action">
            <Button startIcon={<IconPlus16 />}>Split Button</Button>
            <Menu
              placement="bottom end"
              control={(props) => (
                <Button
                  {...props}
                  onlyIcon
                  aria-label="More options"
                  startIcon={<IconChevronDownS16 />}
                />
              )}
            >
              {menuItems}
            </Menu>
          </SplitButton>
        </FlexBox>
      </FlexBox>
    );
  },
};

export const ProgressState: Story = {
  render: () => {
    const menuItems = (
      <>
        <Menu.Item key="template">Create from template</Menu.Item>
        <Menu.Item key="import">Import</Menu.Item>
        <Menu.Item key="duplicate">Duplicate</Menu.Item>
      </>
    );

    return (
      <FlexBox gap="l" alignItems="flex-start">
        <FlexBox gap="s" direction="column" alignItems="flex-start">
          <Typography className="split-button-demo__header">
            Primary in Progress
          </Typography>
          <SplitButton aria-label="Split action">
            <Button isLoading startIcon={<IconClock16 />}>
              Split Button
            </Button>
            <Menu
              placement="bottom end"
              control={(props) => (
                <Button
                  {...props}
                  onlyIcon
                  aria-label="More options"
                  startIcon={<IconChevronDownS16 />}
                />
              )}
            >
              {menuItems}
            </Menu>
          </SplitButton>
        </FlexBox>

        <FlexBox gap="s" direction="column" alignItems="flex-start">
          <Typography className="split-button-demo__header">
            Secondary in Progress
          </Typography>
          <SplitButton aria-label="Split action">
            <Button startIcon={<IconClock16 />}>Split Button</Button>
            <Menu
              placement="bottom end"
              control={(props) => (
                <Button
                  {...props}
                  isLoading
                  onlyIcon
                  aria-label="More options"
                  startIcon={<IconChevronDownS16 />}
                />
              )}
            >
              {menuItems}
            </Menu>
          </SplitButton>
        </FlexBox>

        <FlexBox gap="s" direction="column" alignItems="flex-start">
          <Typography className="split-button-demo__header">
            Completely in Progress
          </Typography>
          <SplitButton isLoading aria-label="Split action">
            <Button startIcon={<IconClock16 />}>Split Button</Button>
            <Menu
              placement="bottom end"
              control={(props) => (
                <Button
                  {...props}
                  onlyIcon
                  aria-label="More options"
                  startIcon={<IconChevronDownS16 />}
                />
              )}
            >
              {menuItems}
            </Menu>
          </SplitButton>
        </FlexBox>
      </FlexBox>
    );
  },
};

export const MenuWidth: Story = {
  render: () => (
    <SplitButton panelAutoWidth aria-label="Split action">
      <Button>Split Button</Button>
      <Menu
        placement="bottom end"
        control={(props) => (
          <Button
            {...props}
            onlyIcon
            aria-label="More options"
            startIcon={<IconChevronDownS16 />}
          />
        )}
      >
        <Menu.Item key="a">A</Menu.Item>
        <Menu.Item key="b">B</Menu.Item>
      </Menu>
    </SplitButton>
  ),
};
