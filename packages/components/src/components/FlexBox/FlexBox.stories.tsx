import type { CSSProperties } from 'react';

import { IconRadarO32 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Divider } from '../Divider';
import { spacing } from '../layout';
import { Typography } from '../Typography';

import { FlexBox, type FlexBoxProps } from './index';

const meta = {
  title: 'Components/FlexBox',
  component: FlexBox,
} satisfies Meta<typeof FlexBox>;

export default meta;
type Story = StoryObj<FlexBoxProps>;

const styleBlock = {
  flex: 1,
  blockSize: 32,
  borderRadius: 8,
  textAlign: 'center',
  backgroundColor: 'var(--kbq-background-contrast-fade)',
} as CSSProperties;

export const Base: Story = {
  render: (args) => (
    <FlexBox gap="xl" {...args}>
      {new Array(4).fill(null).map((_, idx) => (
        <div key={idx} style={styleBlock} />
      ))}
    </FlexBox>
  ),
};

export const Gap: Story = {
  render: (args) => {
    const styleBlock = {
      blockSize: 64,
      inlineSize: 64,
      borderRadius: 8,
      backgroundColor: 'var(--kbq-background-contrast-fade)',
    };

    return (
      <FlexBox gap="s" rowGap="3xl" colGap="3xl" wrap="wrap" {...args}>
        {new Array(16).fill(null).map((_, idx) => (
          <div key={idx} style={styleBlock} />
        ))}
      </FlexBox>
    );
  },
};

export const Direction: Story = {
  render: (args) => {
    const styleBlock = {
      blockSize: 64,
      inlineSize: 64,
      borderRadius: 8,
      backgroundColor: 'var(--kbq-background-contrast-fade)',
    };

    return (
      <FlexBox gap="m" direction="column" {...args}>
        {new Array(4).fill(null).map((_, idx) => (
          <div key={idx} style={styleBlock} />
        ))}
      </FlexBox>
    );
  },
};

export const Alignment: Story = {
  render: () => {
    const styleBlock = {
      blockSize: 32,
      inlineSize: 96,
      borderRadius: 8,
      backgroundColor: 'var(--kbq-background-contrast-fade)',
    };

    return (
      <FlexBox justifyContent="space-between" gap="xl">
        <FlexBox direction="column" gap="l" alignItems="flex-start">
          <div style={styleBlock}></div>
          <div style={{ ...styleBlock, inlineSize: 144 }} />
          <div style={{ ...styleBlock, inlineSize: 176 }} />
        </FlexBox>
        <FlexBox direction="column" gap="l" alignItems="center">
          <div style={styleBlock} />
          <div style={{ ...styleBlock, inlineSize: 144 }} />
          <div style={{ ...styleBlock, inlineSize: 176 }} />
        </FlexBox>
        <FlexBox direction="column" gap="l" alignItems="flex-end">
          <div style={styleBlock} />
          <div style={{ ...styleBlock, inlineSize: 144 }} />
          <div style={{ ...styleBlock, inlineSize: 176 }} />
        </FlexBox>
      </FlexBox>
    );
  },
};

export const ResponsiveValues: Story = {
  name: 'Responsive values',
  render: (args) => {
    const styleBlock = {
      blockSize: 32,
      borderRadius: 8,
      inlineSize: 140,
      backgroundColor: 'var(--kbq-background-contrast-fade)',
    } as CSSProperties;

    return (
      <FlexBox
        gap={{ xs: 'xl', l: '6xl' }}
        justifyContent="space-between"
        direction={{ xs: 'column', l: 'row' }}
        {...args}
      >
        {new Array(4).fill(null).map((_, idx) => (
          <div key={idx} style={styleBlock} />
        ))}
      </FlexBox>
    );
  },
};

export const Example: Story = {
  render: (args) => {
    const styleContainer = {
      padding: 16,
      borderRadius: 12,
      boxShadow: 'var(--kbq-shadow-overlay)',
    } as CSSProperties;

    return (
      <FlexBox {...args} alignItems="center" style={styleContainer}>
        <FlexBox alignItems="center" gap="m">
          <IconRadarO32 />
          <Divider orientation="vertical" flexItem />
          <Typography variant="text-big-strong">Antivirus</Typography>
        </FlexBox>
        <Button className={spacing({ mis: 'auto' })}>Enable</Button>
      </FlexBox>
    );
  },
};
