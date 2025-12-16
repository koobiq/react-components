import type { Meta, StoryObj } from '@storybook/react';

import { Breadcrumbs, BreadcrumbItem } from './index.js';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  subcomponents: { BreadcrumbItem },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Base: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem onPress={() => alert('Pressed Folder 1')}>
        Folder 1
      </BreadcrumbItem>
      <BreadcrumbItem onPress={() => alert('Pressed Folder 2')}>
        Folder 2
      </BreadcrumbItem>
      <BreadcrumbItem>Folder 3</BreadcrumbItem>
    </Breadcrumbs>
  ),
};
