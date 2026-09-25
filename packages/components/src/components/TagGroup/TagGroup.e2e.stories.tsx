import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Tag, TagGroup, tagGroupPropVariant } from './index.js';
import type { TagGroupProps } from './index.js';

const meta = {
  title: 'E2E/TagGroup',
  component: TagGroup,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof TagGroup>;

export default meta;

type Story = StoryObj<typeof TagGroup>;

type State = { title: string } & Partial<TagGroupProps<object>>;

// Hover and focus come from React Aria as data attributes, so only the states set by props.
const states: State[] = [
  { title: 'normal' },
  { title: 'disabled', disabledKeys: ['tag'] },
  { title: 'removable', onRemove: () => {} },
  { title: 'removable disabled', disabledKeys: ['tag'], onRemove: () => {} },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {tagGroupPropVariant.flatMap((variant) =>
        states.map(({ title, ...state }) => (
          <TagGroup
            key={`${variant}-${title}`}
            aria-label={title}
            variant={variant}
            {...state}
          >
            <Tag key="tag">{title}</Tag>
          </TagGroup>
        ))
      )}
    </E2eGrid>
  ),
};
