import type { Meta, StoryObj } from '@storybook/react';

import { Disclosure } from './Disclosure';
import { type DisclosureProps } from './index';

const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  subcomponents: {
    'Disclosure.Trigger': Disclosure.Trigger,
    'Disclosure.Panel': Disclosure.Panel,
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<DisclosureProps>;

export const Base: Story = {
  render: (args) => (
    <Disclosure style={{ inlineSize: 300 }} {...args}>
      <Disclosure.Trigger>Action</Disclosure.Trigger>
      <Disclosure.Panel>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab distinctio
        est libero nulla praesentium quidem quis quos sed sit velit!
      </Disclosure.Panel>
    </Disclosure>
  ),
};
