import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Table, TableContainer } from '../Table';
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

export const TableExample: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    const columns = [
      { name: 'User ID', key: 'id' },
      { name: 'First Name', key: 'firstName' },
      { name: 'Last Name', key: 'lastName' },
      { name: 'Email', key: 'email' },
      { name: 'Role', key: 'role' },
    ];

    const users = [
      {
        id: 1,
        firstName: 'Emily',
        lastName: 'Carter',
        email: 'emily.carter@example.com',
        role: 'Admin',
      },
      {
        id: 2,
        firstName: 'Michael',
        lastName: 'Thompson',
        email: 'michael.thompson@mail.com',
        role: 'Editor',
      },
      {
        id: 3,
        firstName: 'Sophia',
        lastName: 'Bellmont',
        email: 'sophia.bellmont@example.org',
        role: 'Subscriber',
      },
      {
        id: 4,
        firstName: 'Daniel',
        lastName: 'Nguyen',
        email: 'daniel.nguyen@mail.com',
        role: 'User',
      },
      {
        id: 5,
        firstName: 'Olivia',
        lastName: 'Brooks',
        email: 'olivia.brooks@example.com',
        role: 'Moderator',
      },
      {
        id: 6,
        firstName: 'James',
        lastName: 'Harris',
        email: 'james.harris@mail.org',
        role: 'User',
      },
      {
        id: 7,
        firstName: 'Isabella',
        lastName: 'Murphy',
        email: 'isabella.murphy@mail.com',
        role: 'Subscriber',
      },
      {
        id: 8,
        firstName: 'Benjamin',
        lastName: 'Lee',
        email: 'benjamin.lee@example.com',
        role: 'Editor',
      },
      {
        id: 9,
        firstName: 'Ava',
        lastName: 'Garcia',
        email: 'ava.garcia@mail.com',
        role: 'User',
      },
      {
        id: 10,
        firstName: 'William',
        lastName: 'Martinez',
        email: 'william.martinez@ex.org',
        role: 'Admin',
      },
      {
        id: 11,
        firstName: 'Mia',
        lastName: 'Robinson',
        email: 'mia.robinson@mail.org',
        role: 'Subscriber',
      },
      {
        id: 12,
        firstName: 'Alexander',
        lastName: 'Walker',
        email: 'alex.walker@example.com',
        role: 'User',
      },
      {
        id: 13,
        firstName: 'Charlotte',
        lastName: 'Scott',
        email: 'charlotte.scott@mail.com',
        role: 'Moderator',
      },
      {
        id: 14,
        firstName: 'Henry',
        lastName: 'Adams',
        email: 'henry.adams@example.org',
        role: 'User',
      },
      {
        id: 15,
        firstName: 'Harper',
        lastName: 'Bell',
        email: 'harper.bell@mail.org',
        role: 'Subscriber',
      },
    ];

    const [user, setUser] = useState<(typeof users)[0]>();

    return (
      <ContentPanelContainer>
        {({ open, close, isOpen }) => (
          <>
            <TableContainer blockSize={300}>
              <Table
                aria-label="The table with users"
                onRowAction={(id) => {
                  setUser(users.find((user) => id === user.id));

                  if (!isOpen) open();
                }}
                stickyHeader
              >
                <Table.Header columns={columns}>
                  {(column) => <Table.Column>{column.name}</Table.Column>}
                </Table.Header>
                <Table.Body items={users}>
                  {(item) => (
                    <Table.Row>
                      {(columnKey) => (
                        <Table.Cell>
                          {item[columnKey as keyof (typeof users)[0]]}
                        </Table.Cell>
                      )}
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </TableContainer>
            <ContentPanel isResizable>
              <ContentPanel.Header>
                {user?.firstName}&nbsp;{user?.lastName}
              </ContentPanel.Header>
              <ContentPanel.Body>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A
                corporis debitis doloremque fugiat harum laudantium odit
                perferendis placeat qui, repudiandae. Doloribus excepturi ipsum
                maxime! Animi error ipsam quae ratione voluptatum. Accusamus
                aliquid autem commodi culpa distinctio dolorem ducimus eaque,
                eveniet expedita facilis incidunt labore laboriosam minus
                molestias non, officiis pariatur porro possimus quas quos rem
                sunt suscipit tenetur ut vel velit vero. Libero, perspiciatis,
                repellat? Earum eligendi et magni necessitatibus non quos sed,
                similique soluta tempore? Accusantium, alias animi ea molestiae
                nulla voluptates voluptatum. A ab ad aperiam blanditiis, commodi
                consectetur dolores et eveniet harum id ipsam necessitatibus
                nemo, nisi praesentium quibusdam quis reprehenderit temporibus
                ullam ut veritatis. A ab accusamus, adipisci aliquid animi aut
                consectetur cum cumque cupiditate dicta doloremque ducimus
                eligendi eveniet ex fuga fugiat illum incidunt ipsum iure iusto
                laborum maiores, molestias necessitatibus nulla numquam odio
                officiis perferendis possimus quia quibusdam ratione repudiandae
                sapiente unde ut vel voluptas voluptate. A accusamus aperiam
                architecto atque commodi cum ducimus earum et excepturi facere
                fuga fugiat, harum id ipsam itaque molestiae molestias, nemo
                nulla, porro quaerat quas quasi quibusdam ratione repellendus
                rerum saepe sed sint soluta tempora tenetur ullam vel veniam
                veritatis vero voluptas voluptate voluptates! Alias
                necessitatibus odit repudiandae.
              </ContentPanel.Body>
              <ContentPanel.Footer>
                <Button onPress={close}>Ok</Button>
              </ContentPanel.Footer>
            </ContentPanel>
          </>
        )}
      </ContentPanelContainer>
    );
  },
};

export const Resizable: Story = {
  render: (args) => (
    <ContentPanelContainer defaultOpen {...args}>
      <FlexBox direction="column" gap="m">
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta error
          esse et fugit id in itaque maiores necessitatibus obcaecati odit
          placeat quae, quod repellat reprehenderit sapiente soluta tempora
          vitae voluptatem, voluptates voluptatibus? Atque dolore dolorum ex,
          ipsum labore laudantium maiores minima nemo nobis numquam omnis optio
          possimus sint vero voluptatum.
        </Typography>
        <Button slot="trigger">See details</Button>
      </FlexBox>
      <ContentPanel
        maxWidth={800}
        minWidth={200}
        defaultWidth={400}
        onResize={(width) => console.log(width)}
        isResizable
      >
        <ContentPanel.Header>ContentPanel</ContentPanel.Header>
        <ContentPanel.Body>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta error
          esse et fugit id in itaque maiores necessitatibus obcaecati odit
          placeat quae, quod repellat reprehenderit sapiente soluta tempora
          vitae voluptatem, voluptates voluptatibus? Atque dolore dolorum ex,
          ipsum labore laudantium maiores minima nemo nobis numquam omnis optio
          possimus sint vero voluptatum.
        </ContentPanel.Body>
      </ContentPanel>
    </ContentPanelContainer>
  ),
};
