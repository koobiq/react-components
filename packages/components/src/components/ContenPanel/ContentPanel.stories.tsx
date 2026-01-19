import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import { ContentPanel, ContentPanelContainer } from './index';

const meta = {
  title: 'Components/ContentPanel',
  component: ContentPanel,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof ContentPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <ContentPanelContainer defaultOpen {...args}>
      <FlexBox direction="column" gap="m">
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
          commodi cupiditate facere fugiat in ipsa maiores necessitatibus, odit
          quo quod rem repellat, sint, tenetur! Alias debitis dicta doloremque
          enim fuga fugiat maiores qui rerum sint voluptatibus. A accusantium ad
          assumenda cupiditate dolores eos excepturi fuga harum iusto molestias
          nam pariatur perferendis quam quisquam quo quod, quos ut velit. Ad
          architecto at consequatur consequuntur deleniti esse excepturi illo,
          incidunt, maxime modi, nemo nobis quia sit. Consequatur earum, ex
          pariatur sit temporibus veritatis. Eum explicabo laboriosam quae!
          Alias aperiam at deleniti deserunt, dignissimos in, iste maxime
          necessitatibus nobis quidem reiciendis, vel veritatis!
        </Typography>
        <Button slot="trigger">See details</Button>
      </FlexBox>
      <ContentPanel>
        <ContentPanel.Header>ContentPanel</ContentPanel.Header>
        <ContentPanel.Body>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A corporis
          debitis doloremque fugiat harum laudantium odit perferendis placeat
          qui, repudiandae. Doloribus excepturi ipsum maxime! Animi error ipsam
          quae ratione voluptatum. Accusamus aliquid autem commodi culpa
          distinctio dolorem ducimus eaque, eveniet expedita facilis incidunt
          labore laboriosam minus molestias non, officiis pariatur porro
          possimus quas quos rem sunt suscipit tenetur ut vel velit vero.
          Libero, perspiciatis, repellat? Earum eligendi et magni necessitatibus
          non quos sed, similique soluta tempore? Accusantium, alias animi ea
          molestiae nulla voluptates voluptatum. A ab ad aperiam blanditiis,
          commodi consectetur dolores et eveniet harum id ipsam necessitatibus
          nemo, nisi praesentium quibusdam quis reprehenderit temporibus ullam
          ut veritatis. A ab accusamus, adipisci aliquid animi aut consectetur
          cum cumque cupiditate dicta doloremque ducimus eligendi eveniet ex
          fuga fugiat illum incidunt ipsum iure iusto laborum maiores, molestias
          necessitatibus nulla numquam odio officiis perferendis possimus quia
          quibusdam ratione repudiandae sapiente unde ut vel voluptas voluptate.
          A accusamus aperiam architecto atque commodi cum ducimus earum et
          excepturi facere fuga fugiat, harum id ipsam itaque molestiae
          molestias, nemo nulla, porro quaerat quas quasi quibusdam ratione
          repellendus rerum saepe sed sint soluta tempora tenetur ullam vel
          veniam veritatis vero voluptas voluptate voluptates! Alias
          necessitatibus odit repudiandae.
        </ContentPanel.Body>
      </ContentPanel>
    </ContentPanelContainer>
  ),
};
