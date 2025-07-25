import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { spacing } from '../layout';

import car from './__stories__/red_car.jpeg';
import {
  typographyPropVariant,
  Typography,
  type TypographyProps,
} from './index.js';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  argTypes: {},
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<TypographyProps>;

export const Base: Story = {
  render: (args) => <Typography {...args}>Design-system</Typography>,
};

export const Variant: Story = {
  render: () => (
    <FlexBox direction="column" gap="m">
      {typographyPropVariant.map((variant) => (
        <Typography key={variant} variant={variant}>
          {variant}
        </Typography>
      ))}
    </FlexBox>
  ),
};

export const RootTag: Story = {
  render: () => (
    <figure className={spacing({ m: '0' })}>
      <img
        src={car}
        width="200"
        height="200"
        alt="A red high-speed car"
        style={{ borderRadius: 8 }}
      />
      <Typography as="figcaption" variant="italic-normal">
        A red high-speed car
      </Typography>
    </figure>
  ),
};

export const Align: Story = {
  render: () => (
    <FlexBox style={{ inlineSize: '100%' }}>
      <Typography align="start" style={{ flexGrow: 1 }}>
        align = start
      </Typography>
      <Typography align="center" style={{ flexGrow: 1 }}>
        align = center
      </Typography>
      <Typography align="end" style={{ flexGrow: 1 }}>
        align = end
      </Typography>
    </FlexBox>
  ),
};

export const Color: Story = {
  render: () => (
    <FlexBox gap="m">
      <Typography color="success">Text</Typography>
      <Typography color="warning">Text</Typography>
      <Typography color="theme">Text</Typography>
      <Typography color="error">Text</Typography>
      <Typography color="inherit">Text</Typography>
    </FlexBox>
  ),
};

export const Ellipsis: Story = {
  render: () => (
    <FlexBox style={{ inlineSize: '50%' }}>
      <Typography align="start" ellipsis>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nulla quo
        recusandae reprehenderit sapiente tenetur? Adipisci aspernatur aut
        beatae consectetur debitis, earum eum eveniet exercitationem explicabo
        fugit harum illo modi non, nulla officiis quas quibusdam quo recusandae?
        Accusamus aliquam aspernatur ipsa iusto nam nobis nulla obcaecati quam,
        recusandae repellat sunt tempora?
      </Typography>
    </FlexBox>
  ),
};
