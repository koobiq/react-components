import type { StoryObj } from '@storybook/react';

import { Container, type ContainerBaseProps } from './index';

const meta = {
  title: 'Components/Container',
  component: Container,
};

export default meta;
type Story = StoryObj<typeof meta>;

const containerStyle = {
  blockSize: 300,
  backgroundColor: 'var(--kbq-background-bg-secondary)',
};

const boxStyle = {
  blockSize: 'inherit',
  backgroundColor: 'var(--kbq-background-theme-fade)',
};

export const Base: Story = {
  render: (args: ContainerBaseProps) => (
    <Container style={containerStyle} maxInlineSize={400} margins="m" {...args}>
      <div style={boxStyle} />
    </Container>
  ),
};

export const MaxInlineSize: Story = {
  name: 'MaxInlineSize',
  render: (args: ContainerBaseProps) => (
    <Container style={containerStyle} maxInlineSize={400} {...args}>
      <div style={boxStyle} />
    </Container>
  ),
};

export const Margins: Story = {
  render: (args: ContainerBaseProps) => (
    <Container
      style={containerStyle}
      maxInlineSize={400}
      margins="3xl"
      {...args}
    >
      <div style={boxStyle} />
    </Container>
  ),
};

export const Position: Story = {
  render: (args: ContainerBaseProps) => (
    <Container
      style={containerStyle}
      maxInlineSize={400}
      position="start"
      {...args}
    >
      <div style={boxStyle} />
    </Container>
  ),
};

export const Fixed: Story = {
  name: 'Responsive values',
  render: (args: ContainerBaseProps) => (
    <Container style={{ ...containerStyle, width: 600 }} isFixed {...args}>
      <div style={boxStyle} />
    </Container>
  ),
};

export const ResponsiveValues: Story = {
  name: 'Responsive values',
  render: (args: ContainerBaseProps) => (
    <Container
      style={containerStyle}
      maxInlineSize={{ xs: '100%', l: 960 }}
      margins={{ xs: 's', l: 'l' }}
      {...args}
    >
      <div style={boxStyle} />
    </Container>
  ),
};
