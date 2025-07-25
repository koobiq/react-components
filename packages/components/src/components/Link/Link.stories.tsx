import { type CSSProperties } from 'react';

import { useBoolean } from '@koobiq/react-core';
import { IconBolt16, IconNorthEast16, IconStar16 } from '@koobiq/react-icons';
import * as Icons from '@koobiq/react-icons';
import { linkTo } from '@storybook/addon-links';
import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '../Checkbox';
import { FlexBox } from '../FlexBox';
import { type LinkProps, RouterProvider } from '../index';
import { Typography } from '../Typography';

import { Link } from './Link';

const mappingIcons = Object.entries(Icons).reduce((acc, [key, Icon]) => ({
  ...acc,
  [key]: <Icon />,
}));

const meta = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    startIcon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
    endIcon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<LinkProps>;

export const Base: Story = {
  render: (args) => (
    <Link href="https://react.koobiq.io" target="_blank" {...args}>
      Link
    </Link>
  ),
};

export const Variant: Story = {
  render: () => (
    <FlexBox gap="m" direction="column" alignItems="center">
      <Link href="#" variant="text-compact">
        variant = text-compact
      </Link>
      <Link href="#" variant="text-normal">
        variant = text-normal
      </Link>
      <Link href="#" variant="text-big">
        variant = text-big
      </Link>
    </FlexBox>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <FlexBox gap="m" direction="column" alignItems="center">
      <Link href="#" startIcon={<IconBolt16 />}>
        Link
      </Link>
      <Link href="#" startIcon={<IconStar16 />} endIcon={<IconStar16 />}>
        Link
      </Link>
      <Link
        target="_blank"
        rel="noreferrer"
        endIcon={<IconNorthEast16 />}
        href="https://react.koobiq.io/"
        style={{ '--link-gap': 0 } as CSSProperties}
      >
        External link
      </Link>
    </FlexBox>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Link href="#" isDisabled>
      Link
    </Link>
  ),
};

export const AllowVisited: Story = {
  render: function Render() {
    const [allowVisited, { set: setAllowVisited }] = useBoolean(true);

    return (
      <FlexBox gap="l" direction="column">
        <Link href="https://react.koobiq.io/" allowVisited={allowVisited}>
          Link
        </Link>
        <Checkbox isSelected={allowVisited} onChange={setAllowVisited}>
          AllowVisited
        </Checkbox>
      </FlexBox>
    );
  },
};

export const RootTag: Story = {
  render: function Render() {
    const [isDisabled, { set: setIsDisabled }] = useBoolean(false);
    const [isPseudo, { set: setIsPseudo }] = useBoolean(true);

    return (
      <FlexBox gap="l" direction="column">
        <FlexBox gap="xl">
          <Link
            as="button"
            isPseudo={isPseudo}
            isDisabled={isDisabled}
            onPress={() => alert("I'm a button")}
          >
            Button
          </Link>
          <Link
            as="span"
            isPseudo={isPseudo}
            isDisabled={isDisabled}
            onPress={() => alert("I'm a span")}
          >
            Pseudo-link
          </Link>
        </FlexBox>
        <FlexBox gap="xl">
          <Checkbox isSelected={isDisabled} onChange={setIsDisabled}>
            Disabled
          </Checkbox>
          <Checkbox isSelected={isPseudo} onChange={setIsPseudo}>
            Pseudo
          </Checkbox>
        </FlexBox>
      </FlexBox>
    );
  },
};

export const Composition: Story = {
  render: () => (
    <Typography variant="text-big-medium">
      Title with&nbsp;
      <Link href="#" variant="inherit">
        Link
      </Link>
    </Typography>
  ),
};

export const RouterProviderStory: Story = {
  render: function Render() {
    return (
      <RouterProvider
        navigate={(href) => {
          linkTo(href)();
        }}
      >
        <Link href="Icons">Link</Link>
      </RouterProvider>
    );
  },
};
