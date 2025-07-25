import type { CSSProperties } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Grid, type GridProps } from './index';

const meta = {
  title: 'Components/Grid',
  component: Grid,
  subcomponents: { 'Grid.Item': Grid.Item },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<GridProps>;

const itemStyle = {
  textAlign: 'center',
  padding: 'var(--kbq-size-m)',
  borderRadius: 'var(--kbq-size-s)',
  fontFamily: 'var(--kbq-font-family-mono)',
  backgroundColor: 'var(--kbq-background-contrast-fade)',
} as CSSProperties;

export const Base: Story = {
  render: (args) => (
    <Grid cols={3} gap="m" {...args}>
      <Grid.Item style={itemStyle}>01</Grid.Item>
      <Grid.Item style={itemStyle} col={2}>
        02
      </Grid.Item>
      <Grid.Item style={itemStyle} col={2}>
        03
      </Grid.Item>
      <Grid.Item style={itemStyle}>04</Grid.Item>
      <Grid.Item style={itemStyle}>05</Grid.Item>
      <Grid.Item style={itemStyle}>06</Grid.Item>
      <Grid.Item style={itemStyle}>07</Grid.Item>
    </Grid>
  ),
};

export const Cols: Story = {
  render: (args) => (
    <Grid gap="m" cols={4} {...args}>
      <Grid.Item style={itemStyle}>01</Grid.Item>
      <Grid.Item style={itemStyle}>02</Grid.Item>
      <Grid.Item style={itemStyle}>03</Grid.Item>
      <Grid.Item style={itemStyle}>04</Grid.Item>
    </Grid>
  ),
};

export const Gap: Story = {
  render: (args) => (
    <Grid gap="m" rowGap="xxl" cols={2} {...args}>
      <Grid.Item style={itemStyle}>01</Grid.Item>
      <Grid.Item style={itemStyle}>02</Grid.Item>
      <Grid.Item style={itemStyle}>03</Grid.Item>
      <Grid.Item style={itemStyle}>04</Grid.Item>
    </Grid>
  ),
};

export const AlignmentItems: Story = {
  name: 'Alignment items',
  render: (args) => (
    <Grid gap="m" justifyItems="center" cols={2} {...args}>
      <Grid.Item style={itemStyle}>01</Grid.Item>
      <Grid.Item style={itemStyle}>02</Grid.Item>
      <Grid.Item style={itemStyle}>03</Grid.Item>
      <Grid.Item style={itemStyle}>04</Grid.Item>
    </Grid>
  ),
};

export const Col: Story = {
  render: (args) => (
    <Grid gap="m" cols={4} {...args}>
      <Grid.Item style={itemStyle} col={3}>
        01
      </Grid.Item>
      <Grid.Item style={itemStyle} col={1}>
        02
      </Grid.Item>
      <Grid.Item style={itemStyle} col={1}>
        03
      </Grid.Item>
      <Grid.Item style={itemStyle} col={3}>
        04
      </Grid.Item>
    </Grid>
  ),
};

export const ColStart: Story = {
  name: 'ColStart',
  render: (args) => (
    <Grid gap="m" cols={4} {...args}>
      <Grid.Item style={itemStyle} col={2} colStart={2}>
        01
      </Grid.Item>
      <Grid.Item style={itemStyle} col={1} colStart={2}>
        02
      </Grid.Item>
      <Grid.Item style={itemStyle} col={1}>
        03
      </Grid.Item>
    </Grid>
  ),
};

export const Row: Story = {
  render: (args) => (
    <Grid gap="m" cols={4} {...args}>
      <Grid.Item style={itemStyle} col={2} row={2}>
        01
      </Grid.Item>
      <Grid.Item style={itemStyle} col={1}>
        02
      </Grid.Item>
      <Grid.Item style={itemStyle} col={1}>
        03
      </Grid.Item>
      <Grid.Item style={itemStyle} col={2}>
        04
      </Grid.Item>
    </Grid>
  ),
};

export const RowStart: Story = {
  name: 'RowStart',
  render: (args) => (
    <Grid gap="xl" cols={4} {...args}>
      <Grid.Item style={itemStyle} col={2}>
        01
      </Grid.Item>
      <Grid.Item style={itemStyle} col={2}>
        02
      </Grid.Item>
      <Grid.Item rowStart={3} style={itemStyle} col={2}>
        03
      </Grid.Item>
      <Grid.Item rowStart={3} style={itemStyle} col={2}>
        04
      </Grid.Item>
    </Grid>
  ),
};

export const SelfAlignment: Story = {
  name: 'Self-alignment',
  render: (args) => (
    <Grid gap="m" cols={2} {...args}>
      <Grid.Item style={itemStyle} alignSelf="center" justifySelf="center">
        01
      </Grid.Item>
      <Grid.Item style={itemStyle}>02</Grid.Item>
      <Grid.Item style={itemStyle}>03</Grid.Item>
      <Grid.Item style={itemStyle}>04</Grid.Item>
    </Grid>
  ),
};

export const Nested: Story = {
  render: (args) => (
    <Grid gap="xl" cols={3} {...args}>
      <Grid.Item style={itemStyle}>01</Grid.Item>
      <Grid.Item style={itemStyle}>02</Grid.Item>
      <Grid.Item>
        <Grid cols={1} gap="xl">
          <Grid.Item style={itemStyle}>03</Grid.Item>
          <Grid.Item style={itemStyle}>04</Grid.Item>
        </Grid>
      </Grid.Item>
    </Grid>
  ),
};

export const ResponsiveValues: Story = {
  name: 'Responsive values',
  render: (args) => (
    <Grid gap={{ xs: 'xl', l: '6xl' }} cols={{ m: 4, xs: 1 }} {...args}>
      <Grid.Item style={itemStyle}>01</Grid.Item>
      <Grid.Item style={itemStyle}>02</Grid.Item>
      <Grid.Item style={itemStyle}>03</Grid.Item>
      <Grid.Item style={itemStyle}>04</Grid.Item>
    </Grid>
  ),
};

export const ResponsiveValuesItems: Story = {
  name: 'Responsive values for items',
  render: (args) => (
    <Grid gap="m" cols={2} {...args}>
      <Grid.Item style={itemStyle} col={{ xs: 2, m: 1 }}>
        01
      </Grid.Item>
      <Grid.Item style={itemStyle} col={{ xs: 2, m: 1 }}>
        02
      </Grid.Item>
      <Grid.Item style={itemStyle} col={{ xs: 2, m: 1 }}>
        03
      </Grid.Item>
      <Grid.Item style={itemStyle} col={{ xs: 2, m: 1 }}>
        04
      </Grid.Item>
    </Grid>
  ),
};
