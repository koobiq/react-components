import type { CSSProperties } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconCloud16,
  IconDashboard16,
  IconDatabase16,
  IconChevronDoubleLeftS16,
  IconChevronDoubleRightS16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Grid } from '../Grid';
import { spacing } from '../layout';
import { List } from '../List';
import { Typography } from '../Typography';

import {
  Sidebar,
  type SidebarProps,
  type SidebarRenderProps,
  sidebarPropPlacement,
} from './index';

const items = [
  { icon: <IconDashboard16 />, label: 'Dashboard' },
  { icon: <IconDatabase16 />, label: 'Storage' },
  { icon: <IconCloud16 />, label: 'Network' },
];

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  argTypes: {
    placement: {
      options: sidebarPropPlacement,
      control: { type: 'inline-radio' },
    },
  },
  tags: ['status:new', 'date:2026-07-15'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<SidebarProps>;

const containerStyle = {
  display: 'flex',
  blockSize: 320,
  border: '1px solid var(--kbq-line-contrast-less)',
} as CSSProperties;

const sidebarStyle = {
  backgroundColor: 'var(--kbq-background-bg-tertiary)',
  flex: 'none',
} as CSSProperties;

const listStyle = {
  flex: 'none',
  inlineSize: '100%',
} as CSSProperties;

const contentStyle = {
  display: 'flex',
  gap: 'var(--kbq-size-xs)',
  flexDirection: 'column',
  alignItems: 'start',
  padding: 'var(--kbq-size-m)',
  flex: '1 1 auto',
  minInlineSize: 0,
} as CSSProperties;

const Content = ({
  isOpen,
  toggle,
  placement = 'start',
}: Pick<SidebarRenderProps, 'isOpen' | 'toggle'> & {
  placement?: SidebarProps['placement'];
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', inlineSize: '100%' }}>
    <List aria-label="Navigation" style={listStyle} isPadded>
      {items.map(({ icon, label }) => (
        <List.Item key={label} textValue={label} style={{ paddingInline: 8 }}>
          <List.ItemAddon>{icon}</List.ItemAddon>
          {isOpen && <List.ItemText>{label}</List.ItemText>}
        </List.Item>
      ))}
    </List>

    <Button
      onlyIcon={!isOpen}
      onPress={toggle}
      variant="fade-contrast-filled"
      startIcon={
        !isOpen ? (
          placement === 'start' ? (
            <IconChevronDoubleRightS16 />
          ) : (
            <IconChevronDoubleLeftS16 />
          )
        ) : undefined
      }
      className={spacing({ m: 'xxs' })}
      style={{ marginBlockStart: 'auto' }}
    >
      {isOpen ? 'Close' : 'Open'}
    </Button>
  </div>
);

export const Base: Story = {
  render: (args) => (
    <div style={containerStyle}>
      <Sidebar {...args} closedSize={40} style={sidebarStyle}>
        {({ isOpen, toggle }) => <Content isOpen={isOpen} toggle={toggle} />}
      </Sidebar>
      <div style={contentStyle}>
        <Typography variant="text-normal">
          Press <kbd>[</kbd> to toggle the sidebar.
        </Typography>
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [isOpen, { toggle, set }] = useBoolean(true);

    return (
      <div style={containerStyle}>
        <Sidebar
          closedSize={40}
          isOpen={isOpen}
          style={sidebarStyle}
          onOpenChange={set}
          {...args}
        >
          {({ isOpen, toggle }) => <Content isOpen={isOpen} toggle={toggle} />}
        </Sidebar>
        <div style={contentStyle}>
          <Typography>The sidebar is {isOpen ? 'open' : 'closed'}.</Typography>
          <Button aria-label={isOpen ? 'Close' : 'Open'} onPress={toggle}>
            {isOpen ? 'Close' : 'Open'}
          </Button>
        </div>
      </div>
    );
  },
};

export const Size: Story = {
  render: function Render() {
    const sizeExamples: Array<{
      label: string;
      size: SidebarProps['size'];
      closedSize: SidebarProps['closedSize'];
    }> = [
      { label: 'Pixels: 320px → 56px', size: 320, closedSize: 56 },
      { label: 'Percentages: 50% → 25%', size: '50%', closedSize: '25%' },
      {
        label: 'Clamp: min 240px, preferred 50%, max 320px',
        size: 'clamp(240px, 50%, 320px)',
        closedSize: 32,
      },
    ];

    return (
      <Grid gap="l">
        {sizeExamples.map(({ label, size, closedSize }) => (
          <Grid key={label} gap="xs">
            <Typography variant="text-normal">{label}</Typography>
            <FlexBox
              style={{
                blockSize: 160,
                inlineSize: '100%',
                border: '1px solid var(--kbq-line-contrast-less)',
                overflow: 'hidden',
              }}
            >
              <Sidebar
                defaultOpen
                size={size}
                style={sidebarStyle}
                keyboardShortcut={null}
                closedSize={closedSize}
              >
                <Typography style={{ padding: 'var(--kbq-size-l)' }}>
                  Sidebar
                </Typography>
              </Sidebar>
              <FlexBox style={{ flex: '1 1 auto', minInlineSize: 0 }}>
                <Typography style={{ padding: 'var(--kbq-size-l)' }}>
                  Content
                </Typography>
              </FlexBox>
            </FlexBox>
          </Grid>
        ))}
      </Grid>
    );
  },
};

export const Placement: Story = {
  render: () => (
    <div style={containerStyle}>
      <Sidebar
        size="25%"
        closedSize={40}
        placement="start"
        style={sidebarStyle}
        defaultOpen
      >
        {({ isOpen, toggle }) => (
          <Content isOpen={isOpen} toggle={toggle} placement="start" />
        )}
      </Sidebar>
      <div
        style={{
          flex: '1 1 auto',
          minInlineSize: 0,
          padding: 'var(--kbq-size-l)',
        }}
      >
        <Typography variant="text-normal">
          <kbd>[</kbd> toggles the left sidebar, <kbd>]</kbd> the right one.
        </Typography>
      </div>
      <Sidebar
        size="25%"
        closedSize={40}
        placement="end"
        style={sidebarStyle}
        defaultOpen
      >
        {({ isOpen, toggle }) => (
          <Content isOpen={isOpen} toggle={toggle} placement="end" />
        )}
      </Sidebar>
    </div>
  ),
};

export const Keyboard: Story = {
  render: (args) => (
    <div style={containerStyle}>
      <Sidebar
        closedSize={40}
        style={sidebarStyle}
        keyboardShortcut={{ code: 'KeyB' }}
        {...args}
      >
        {({ isOpen, toggle }) => <Content isOpen={isOpen} toggle={toggle} />}
      </Sidebar>
      <div style={contentStyle}>
        <Typography variant="text-normal">
          Press <kbd>B</kbd> to toggle the sidebar.
        </Typography>
      </div>
    </div>
  ),
};
