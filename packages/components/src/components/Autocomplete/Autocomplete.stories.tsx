import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';

import { Autocomplete, type AutocompleteProps } from './index.js';

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<AutocompleteProps<any>>;

export const Base: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="l">
      <Button>Outer button</Button>
      <Autocomplete label="Favorite Animal" {...args}>
        <Autocomplete.Item key="red panda">Red Panda</Autocomplete.Item>
        <Autocomplete.Item key="cat">Cat</Autocomplete.Item>
        <Autocomplete.Item key="dog">Dog</Autocomplete.Item>
        <Autocomplete.Item key="aardvark">Aardvark</Autocomplete.Item>
        <Autocomplete.Item key="kangaroo">Kangaroo</Autocomplete.Item>
        <Autocomplete.Item key="snake">Snake</Autocomplete.Item>
      </Autocomplete>
    </FlexBox>
  ),
};
