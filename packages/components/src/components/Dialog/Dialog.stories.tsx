import type { StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { Dialog, type DialogBaseProps } from './index.js';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  subcomponents: {
    'Dialog.Header': Dialog.Header,
    'Dialog.Body': Dialog.Body,
    'Dialog.Footer': Dialog.Footer,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: DialogBaseProps) => (
    <Dialog {...args}>
      <Dialog.Header>Title</Dialog.Header>
      <Dialog.Body>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad at
        doloribus exercitationem expedita laudantium magnam, nobis quod quos
        soluta totam unde voluptas. Accusamus consequuntur illum labore
        molestias quidem quo, repudiandae?
      </Dialog.Body>
      <Dialog.Footer>
        <Button>Action</Button>
      </Dialog.Footer>
    </Dialog>
  ),
};
