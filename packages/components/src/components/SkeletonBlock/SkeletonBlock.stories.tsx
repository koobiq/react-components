import { useBoolean } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { flex } from '../layout';
import { Toggle } from '../Toggle';

import type { SkeletonBlockBaseProps } from './index';
import { SkeletonBlock } from './index';

const meta = {
  title: 'Components/SkeletonBlock',
  component: SkeletonBlock,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof SkeletonBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: SkeletonBlockBaseProps) => (
    <SkeletonBlock inlineSize={100} blockSize={100} {...args} />
  ),
};

export const Example1: Story = {
  name: 'Example 1',
  render: function Render(args: SkeletonBlockBaseProps) {
    const [show, { toggle }] = useBoolean(false);

    return (
      <div className={flex({ gap: 'm', direction: 'column' })}>
        <Toggle onChange={toggle}>Skeletonization</Toggle>
        {show ? (
          <SkeletonBlock {...args}>
            <Button>Send message</Button>
          </SkeletonBlock>
        ) : (
          <Button>Send message</Button>
        )}
      </div>
    );
  },
};

export const Example2: Story = {
  name: 'Example 2',
  render: function Render() {
    const [show, { toggle }] = useBoolean(false);

    return (
      <div className={flex({ gap: 'm', direction: 'column' })}>
        <Toggle onChange={toggle}>Skeletonization</Toggle>
        {show ? (
          <div
            className={flex({ gap: 's', alignItems: 'center' })}
            style={{ blockSize: 20 }}
          >
            <SkeletonBlock inlineSize={16} blockSize={16} />
            <SkeletonBlock inlineSize={100} blockSize={16} />
          </div>
        ) : (
          <Checkbox>Check me</Checkbox>
        )}
      </div>
    );
  },
};
