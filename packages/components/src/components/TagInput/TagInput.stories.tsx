import type { Meta, StoryObj } from '@storybook/react-vite';

import { FlexBox } from '../FlexBox';

import { TagInput } from './TagInput';

// DRAFT — TagInput is still a work-in-progress composer over
// `TagListInner`. This story exists so the in-progress UX can be
// previewed in the dev sandbox.
const meta = {
  title: 'Components/TagInput (draft)',
  component: TagInput,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Base: Story = {
  render: function Render(args) {
    return (
      <FlexBox direction="column" gap="s" style={{ inlineSize: 320 }}>
        <TagInput
          aria-label="Libraries"
          placeholder="Add a library and press Enter"
          defaultValue={['React', 'Typescript']}
          {...args}
        />
      </FlexBox>
    );
  },
};
