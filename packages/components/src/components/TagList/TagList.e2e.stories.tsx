import { IconGlobe16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { TagList, tagListPropVariant } from './index.js';

const meta = {
  title: 'E2E/TagList',
  component: TagList,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof TagList>;

export default meta;

type Story = StoryObj<typeof TagList>;

// Hover and focus come from React Aria as data attributes, so only the states set by props.
export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={1}>
      {tagListPropVariant.map((variant) => (
        <TagList
          key={variant}
          aria-label={variant}
          variant={variant}
          selectionMode="multiple"
          defaultSelectedKeys={['selected']}
          disabledKeys={['disabled']}
          onRemove={() => {}}
        >
          <TagList.Tag key="normal">normal</TagList.Tag>
          <TagList.Tag key="selected">selected</TagList.Tag>
          <TagList.Tag key="disabled">disabled</TagList.Tag>
          <TagList.Tag key="icon" icon={<IconGlobe16 />}>
            with icon
          </TagList.Tag>
        </TagList>
      ))}
    </E2eGrid>
  ),
};
