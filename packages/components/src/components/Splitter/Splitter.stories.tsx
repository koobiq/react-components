import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { ButtonToggle, ButtonToggleGroup } from '../ButtonToggleGroup';
import { FlexBox } from '../FlexBox';
import { Toggle } from '../Toggle';

import {
  Splitter,
  splitterPropAppearance,
  splitterPropOrientation,
} from './index';
import type {
  SplitterPropAppearance,
  SplitterPropOrientation,
  SplitterProps,
} from './index';

const meta = {
  title: 'Components/Splitter',
  component: Splitter,
  subcomponents: {
    'Splitter.Panel': Splitter.Panel,
  },
  tags: ['status:new', 'date:2026-11-16'],
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<SplitterProps>;

export const Base: Story = {
  render: (args) => {
    const content = {
      flex: 1,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--kbq-foreground-contrast-secondary)',
    };

    return (
      <Splitter
        style={{
          blockSize: 200,
          border: '1px solid var(--kbq-line-contrast-less)',
          borderRadius: 'var(--kbq-size-border-radius)',
        }}
        {...args}
      >
        <Splitter.Panel minSize={100}>
          <div style={content}>Panel 1</div>
        </Splitter.Panel>
        <Splitter.Panel minSize={100}>
          <div style={content}>Panel 2</div>
        </Splitter.Panel>
      </Splitter>
    );
  },
};

export const Appearance: Story = {
  render: function Render(args) {
    const [appearance, setAppearance] =
      useState<SplitterPropAppearance>('handle');

    const content = {
      flex: 1,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--kbq-foreground-contrast-secondary)',
      backgroundColor: 'var(--kbq-background-bg-secondary)',
      borderRadius: 'var(--kbq-size-border-radius)',
    };

    return (
      <FlexBox direction="column" alignItems="center" gap="l">
        <ButtonToggleGroup
          selectedKey={appearance}
          onSelectionChange={(key) =>
            setAppearance(key as SplitterPropAppearance)
          }
        >
          {splitterPropAppearance.map((item) => (
            <ButtonToggle key={item} id={item}>
              {item}
            </ButtonToggle>
          ))}
        </ButtonToggleGroup>
        <Splitter
          appearance={appearance}
          style={{ blockSize: 200, inlineSize: '100%' }}
          {...args}
        >
          <Splitter.Panel minSize={125}>
            <div style={{ ...content, marginInlineEnd: 'var(--kbq-size-s)' }}>
              Panel 1
            </div>
          </Splitter.Panel>
          <Splitter.Panel minSize={125}>
            <div style={{ ...content, marginInlineStart: 'var(--kbq-size-s)' }}>
              Panel 2
            </div>
          </Splitter.Panel>
        </Splitter>
      </FlexBox>
    );
  },
};

export const Orientation: Story = {
  render: function Render(args) {
    const [orientation, setOrientation] =
      useState<SplitterPropOrientation>('vertical');

    const content = {
      flex: 1,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--kbq-foreground-contrast-secondary)',
    };

    return (
      <FlexBox direction="column" alignItems="center" gap="l">
        <ButtonToggleGroup
          selectedKey={orientation}
          onSelectionChange={(key) =>
            setOrientation(key as SplitterPropOrientation)
          }
        >
          {splitterPropOrientation.map((item) => (
            <ButtonToggle key={item} id={item}>
              {item}
            </ButtonToggle>
          ))}
        </ButtonToggleGroup>
        <Splitter
          orientation={orientation}
          style={{
            blockSize: 300,
            inlineSize: '100%',
            border: '1px solid var(--kbq-line-contrast-less)',
            borderRadius: 'var(--kbq-size-border-radius)',
          }}
          {...args}
        >
          <Splitter.Panel minSize={70}>
            <div style={content}>Panel 1</div>
          </Splitter.Panel>
          <Splitter.Panel minSize={70}>
            <div style={content}>Panel 2</div>
          </Splitter.Panel>
        </Splitter>
      </FlexBox>
    );
  },
};

export const Disabled: Story = {
  render: function Render(args) {
    const [isDisabled, setIsDisabled] = useState(true);

    const content = {
      flex: 1,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--kbq-foreground-contrast-secondary)',
    };

    return (
      <FlexBox direction="column" alignItems="center" gap="l">
        <Toggle isSelected={isDisabled} onChange={setIsDisabled}>
          disabled
        </Toggle>
        <Splitter
          isDisabled={isDisabled}
          style={{
            blockSize: 200,
            inlineSize: '100%',
            border: '1px solid var(--kbq-line-contrast-less)',
            borderRadius: 'var(--kbq-size-border-radius)',
          }}
          {...args}
        >
          <Splitter.Panel minSize={100}>
            <div style={content}>Panel 1</div>
          </Splitter.Panel>
          <Splitter.Panel minSize={100}>
            <div style={content}>Panel 2</div>
          </Splitter.Panel>
        </Splitter>
      </FlexBox>
    );
  },
};

export const Constraints: Story = {
  render: (args) => {
    const content = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      color: 'var(--kbq-foreground-contrast-secondary)',
      backgroundColor: 'var(--kbq-background-bg-secondary)',
      borderRadius: 'var(--kbq-size-border-radius)',
    } as const;

    return (
      <Splitter appearance="transparent" style={{ blockSize: 200 }} {...args}>
        <Splitter.Panel minSize={125}>
          <div style={{ ...content, marginInlineEnd: 'var(--kbq-size-s)' }}>
            Panel 1<small>min: 125px</small>
          </div>
        </Splitter.Panel>
        <Splitter.Panel size="30%" minSize={150} maxSize="30vw">
          <div style={{ ...content, marginInline: 'var(--kbq-size-s)' }}>
            Panel 2<small>size: 30%</small>
            <small>min: 150px, max: 30vw</small>
          </div>
        </Splitter.Panel>
        <Splitter.Panel minSize={125}>
          <div style={{ ...content, marginInlineStart: 'var(--kbq-size-s)' }}>
            Panel 3<small>min: 125px</small>
          </div>
        </Splitter.Panel>
      </Splitter>
    );
  },
};

export const Snapping: Story = {
  render: (args) => {
    const content = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      color: 'var(--kbq-foreground-contrast-secondary)',
    } as const;

    return (
      <Splitter
        style={{
          blockSize: 200,
          border: '1px solid var(--kbq-line-contrast-less)',
          borderRadius: 'var(--kbq-size-border-radius)',
        }}
        {...args}
      >
        <Splitter.Panel>
          <div style={content}>Panel 1</div>
        </Splitter.Panel>
        <Splitter.Panel
          minSize={200}
          maxSize={500}
          snapSizes={[300, 400]}
          snapTolerance={100}
        >
          <div style={content}>
            Panel 2<small>snap: 300px, 400px</small>
            <small>tolerance: 100px</small>
          </div>
        </Splitter.Panel>
      </Splitter>
    );
  },
};

export const Collapsible: Story = {
  render: function Render(args) {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isTerminalCollapsed, setTerminalCollapsed] = useState(false);

    const content = {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      color: 'var(--kbq-foreground-contrast-secondary)',
    } as const;

    return (
      <FlexBox direction="column" gap="l">
        <FlexBox gap="l">
          <Toggle
            isSelected={isSidebarCollapsed}
            onChange={setSidebarCollapsed}
          >
            Sidebar collapsed
          </Toggle>
          <Toggle
            isSelected={isTerminalCollapsed}
            onChange={setTerminalCollapsed}
          >
            Terminal collapsed
          </Toggle>
        </FlexBox>
        <Splitter
          style={{
            blockSize: 300,
            inlineSize: '100%',
            border: '1px solid var(--kbq-line-contrast-less)',
            borderRadius: 'var(--kbq-size-border-radius)',
          }}
          {...args}
        >
          <Splitter.Panel
            size={150}
            minSize={125}
            maxSize={200}
            isCollapsible
            isCollapsed={isSidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          >
            <div style={content}>
              Sidebar
              {!isSidebarCollapsed && <small>Drag left to collapse</small>}
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <Splitter orientation="vertical" style={{ flex: 1 }}>
              <Splitter.Panel minSize={100}>
                <div style={content}>Editor</div>
              </Splitter.Panel>
              <Splitter.Panel
                size={100}
                minSize={75}
                isCollapsible
                collapsedSize={30}
                isCollapsed={isTerminalCollapsed}
                onCollapsedChange={setTerminalCollapsed}
              >
                <div style={content}>
                  Terminal
                  {!isTerminalCollapsed && (
                    <small>Drag bottom to collapse</small>
                  )}
                </div>
              </Splitter.Panel>
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      </FlexBox>
    );
  },
};

export const Nested: Story = {
  render: (args) => {
    const content = {
      flex: 1,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--kbq-foreground-contrast-secondary)',
    };

    return (
      <Splitter
        style={{
          blockSize: 300,
          border: '1px solid var(--kbq-line-contrast-less)',
          borderRadius: 'var(--kbq-size-border-radius)',
        }}
        {...args}
      >
        <Splitter.Panel maxSize={200}>
          <div style={content}>Sidebar</div>
        </Splitter.Panel>
        <Splitter.Panel>
          <Splitter orientation="vertical" style={{ flex: 1 }}>
            <Splitter.Panel minSize={100}>
              <Splitter style={{ flex: 1 }}>
                <Splitter.Panel minSize={100}>
                  <div style={content}>Editor 1</div>
                </Splitter.Panel>
                <Splitter.Panel minSize={100}>
                  <div style={content}>Editor 2</div>
                </Splitter.Panel>
              </Splitter>
            </Splitter.Panel>
            <Splitter.Panel size={50}>
              <div style={content}>Terminal</div>
            </Splitter.Panel>
          </Splitter>
        </Splitter.Panel>
      </Splitter>
    );
  },
};

export const ControlledLayout: Story = {
  render: function Render(args) {
    const [layout, setLayout] = useState<number[] | null>(null);

    const content = {
      flex: 1,
      display: 'grid',
      placeItems: 'center',
      color: 'var(--kbq-foreground-contrast-secondary)',
    };

    return (
      <FlexBox direction="column" gap="l">
        <FlexBox alignItems="center" gap="l">
          <Button
            variant="fade-contrast-filled"
            onPress={() => setLayout(null)}
          >
            Reset
          </Button>
          <span>
            layout:{' '}
            {layout
              ? layout.map((share) => `${Math.round(share)}%`).join(' / ')
              : 'null'}
          </span>
        </FlexBox>
        <Splitter
          layout={layout}
          onLayoutChange={setLayout}
          style={{
            blockSize: 200,
            inlineSize: '100%',
            border: '1px solid var(--kbq-line-contrast-less)',
            borderRadius: 'var(--kbq-size-border-radius)',
          }}
          {...args}
        >
          <Splitter.Panel size="25%" minSize={100}>
            <div style={content}>Panel 1</div>
          </Splitter.Panel>
          <Splitter.Panel minSize={100}>
            <div style={content}>Panel 2</div>
          </Splitter.Panel>
        </Splitter>
      </FlexBox>
    );
  },
};
