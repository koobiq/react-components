import type { CSSProperties } from 'react';

import type { StoryObj } from '@storybook/react';

import { Grid, GridItem } from './index';
import type { GridBaseProps } from './index.js';

const meta = {
  title: 'Components/Grid',
  component: Grid,
  subcomponents: { GridItem },
};

export default meta;
type Story = StoryObj<typeof meta>;

const itemStyle = {
  textAlign: 'center',
  padding: 'var(--kbq-size-m)',
  borderRadius: 'var(--kbq-size-s)',
  fontFamily: 'var(--kbq-font-family-mono)',
  backgroundColor: 'var(--kbq-background-contrast-fade)',
} as CSSProperties;

export const Base: Story = {
  render: (args: GridBaseProps) => (
    <Grid cols={3} gap="m" {...args}>
      <GridItem style={itemStyle}>01</GridItem>
      <GridItem style={itemStyle} col={2}>
        02
      </GridItem>
      <GridItem style={itemStyle} col={2}>
        03
      </GridItem>
      <GridItem style={itemStyle}>04</GridItem>
      <GridItem style={itemStyle}>05</GridItem>
      <GridItem style={itemStyle}>06</GridItem>
      <GridItem style={itemStyle}>07</GridItem>
    </Grid>
  ),
};

export const Cols: Story = {
  render: (args: GridBaseProps) => (
    <Grid gap="m" cols={4} {...args}>
      <GridItem style={itemStyle}>01</GridItem>
      <GridItem style={itemStyle}>02</GridItem>
      <GridItem style={itemStyle}>03</GridItem>
      <GridItem style={itemStyle}>04</GridItem>
    </Grid>
  ),
};

export const Gap: Story = {
  render: (args: GridBaseProps) => (
    <Grid gap="m" rowGap="xxl" cols={2} {...args}>
      <GridItem style={itemStyle}>01</GridItem>
      <GridItem style={itemStyle}>02</GridItem>
      <GridItem style={itemStyle}>03</GridItem>
      <GridItem style={itemStyle}>04</GridItem>
    </Grid>
  ),
};

export const AlignmentItems: Story = {
  name: 'Alignment items',
  render: (args: GridBaseProps) => (
    <Grid gap="m" justifyItems="center" cols={2} {...args}>
      <GridItem style={itemStyle}>01</GridItem>
      <GridItem style={itemStyle}>02</GridItem>
      <GridItem style={itemStyle}>03</GridItem>
      <GridItem style={itemStyle}>04</GridItem>
    </Grid>
  ),
};

export const Col: Story = {
  render: (args: GridBaseProps) => (
    <Grid gap="m" cols={4} {...args}>
      <GridItem style={itemStyle} col={3}>
        01
      </GridItem>
      <GridItem style={itemStyle} col={1}>
        02
      </GridItem>
      <GridItem style={itemStyle} col={1}>
        03
      </GridItem>
      <GridItem style={itemStyle} col={3}>
        04
      </GridItem>
    </Grid>
  ),
};

export const ColStart: Story = {
  name: 'ColStart',
  render: (args: GridBaseProps) => (
    <Grid gap="m" cols={4} {...args}>
      <GridItem style={itemStyle} col={2} colStart={2}>
        01
      </GridItem>
      <GridItem style={itemStyle} col={1} colStart={2}>
        02
      </GridItem>
      <GridItem style={itemStyle} col={1}>
        03
      </GridItem>
    </Grid>
  ),
};

export const Row: Story = {
  render: (args: GridBaseProps) => (
    <Grid gap="m" cols={4} {...args}>
      <GridItem style={itemStyle} col={2} row={2}>
        01
      </GridItem>
      <GridItem style={itemStyle} col={1}>
        02
      </GridItem>
      <GridItem style={itemStyle} col={1}>
        03
      </GridItem>
      <GridItem style={itemStyle} col={2}>
        04
      </GridItem>
    </Grid>
  ),
};

export const RowStart: Story = {
  name: 'RowStart',
  render: (args: GridBaseProps) => (
    <Grid gap="xl" cols={4} {...args}>
      <GridItem style={itemStyle} col={2}>
        01
      </GridItem>
      <GridItem style={itemStyle} col={2}>
        02
      </GridItem>
      <GridItem rowStart={3} style={itemStyle} col={2}>
        03
      </GridItem>
      <GridItem rowStart={3} style={itemStyle} col={2}>
        04
      </GridItem>
    </Grid>
  ),
};

export const SelfAlignment: Story = {
  name: 'Self-alignment',
  render: (args: GridBaseProps) => (
    <Grid gap="m" cols={2} {...args}>
      <GridItem style={itemStyle} alignSelf="center" justifySelf="center">
        01
      </GridItem>
      <GridItem style={itemStyle}>02</GridItem>
      <GridItem style={itemStyle}>03</GridItem>
      <GridItem style={itemStyle}>04</GridItem>
    </Grid>
  ),
};

export const Nested: Story = {
  render: (args: GridBaseProps) => (
    <Grid gap="xl" cols={3} {...args}>
      <GridItem style={itemStyle}>01</GridItem>
      <GridItem style={itemStyle}>02</GridItem>
      <GridItem>
        <Grid cols={1} gap="xl">
          <GridItem style={itemStyle}>03</GridItem>
          <GridItem style={itemStyle}>04</GridItem>
        </Grid>
      </GridItem>
    </Grid>
  ),
};

export const ResponsiveValues: Story = {
  name: 'Responsive values',
  render: (args: GridBaseProps) => (
    <Grid gap={{ xs: 'xl', l: '6xl' }} cols={{ m: 4, xs: 1 }} {...args}>
      <GridItem style={itemStyle}>01</GridItem>
      <GridItem style={itemStyle}>02</GridItem>
      <GridItem style={itemStyle}>03</GridItem>
      <GridItem style={itemStyle}>04</GridItem>
    </Grid>
  ),
};

export const ResponsiveValuesItems: Story = {
  name: 'Responsive values for items',
  render: (args: GridBaseProps) => (
    <Grid gap="m" cols={2} {...args}>
      <GridItem style={itemStyle} col={{ xs: 2, m: 1 }}>
        01
      </GridItem>
      <GridItem style={itemStyle} col={{ xs: 2, m: 1 }}>
        02
      </GridItem>
      <GridItem style={itemStyle} col={{ xs: 2, m: 1 }}>
        03
      </GridItem>
      <GridItem style={itemStyle} col={{ xs: 2, m: 1 }}>
        04
      </GridItem>
    </Grid>
  ),
};
