import type { StoryObj } from '@storybook/react';

import { Button } from '../Button';

import {
  Dialog,
  type DialogBaseProps,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from './index.js';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  subcomponents: { DialogHeader, DialogContent, DialogFooter },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: DialogBaseProps) => (
    <Dialog {...args}>
      <DialogHeader>Title</DialogHeader>
      <DialogContent>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad at
        doloribus exercitationem expedita laudantium magnam, nobis quod quos
        soluta totam unde voluptas. Accusamus consequuntur illum labore
        molestias quidem quo, repudiandae?
      </DialogContent>
      <DialogFooter>
        <Button>Action</Button>
      </DialogFooter>
    </Dialog>
  ),
};
