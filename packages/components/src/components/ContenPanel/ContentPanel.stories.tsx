import { useEffect, useState, useRef } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconArrowsCollapseDiagonal16,
  IconArrowsExpandDiagonal16,
  IconXmark16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { AnimatedIcon } from '../AnimatedIcon';
import { Autocomplete } from '../Autocomplete';
import { Button } from '../Button';
import type { TableBodyProps } from '../Collections';
import { FlexBox } from '../FlexBox';
import { spacing } from '../layout';
import { Select } from '../Select';
import { Table, TableContainer } from '../Table';
import type { TableProps } from '../Table/types';
import { Typography } from '../Typography';

import { ContentPanel, ContentPanelContainer } from './index';
import type { ContentPanelSize } from './index';

const meta = {
  title: 'Components/ContentPanel',
  component: ContentPanel,
  subcomponents: {
    ContentPanelContainer,
    'ContentPanel.Header': ContentPanel.Header,
    'ContentPanel.Body': ContentPanel.Body,
    'ContentPanel.Footer': ContentPanel.Footer,
  },
  argTypes: {},
  tags: ['status:new', 'date:2026-01-30'],
} satisfies Meta<typeof ContentPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

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

const UsersTable = (
  props: TableProps<object> & { users: TableBodyProps<object>['items'] }
) => {
  const columns = [
    { name: 'User ID', key: 'id' },
    { name: 'Name', key: 'firstName' },
    { name: 'Last Name', key: 'lastName' },
    { name: 'Email', key: 'email' },
    { name: 'Role', key: 'role' },
  ];

  return (
    <TableContainer
      style={{ blockSize: '100%' }}
      className={spacing({ mbs: 'l' })}
    >
      <Table aria-label="The table with users" stickyHeader {...props}>
        <Table.Header columns={columns}>
          {(column) => <Table.Column>{column.name}</Table.Column>}
        </Table.Header>
        <Table.Body items={users}>
          {(item) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>
                  {item[columnKey as keyof (typeof users)[number]]}
                </Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};

const content = (
  <FlexBox gap="m" direction="column">
    <span>
      Web security is a crucial aspect of modern digital infrastructure,
      ensuring the protection of sensitive data, user privacy, and system
      integrity. As cyber threats continue to evolve, developers and
      organizations must adopt a proactive approach to securing web applications
      against attacks.
    </span>
    <span>
      One of the most common vulnerabilities is SQL injection, where attackers
      manipulate database queries to gain unauthorized access to sensitive
      information. Similarly, cross-site scripting (XSS) allows malicious
      scripts to run on a victim’s browser, leading to data theft or session
      hijacking. Another prevalent threat is cross-site request forgery (CSRF),
      in which users are tricked into executing unwanted actions on
      authenticated sites. Additionally, man-in-the-middle attacks intercept
      communication between users and servers, compromising the confidentiality
      of data. Distributed Denial-of-Service (DDoS) attacks can also cripple web
      services by overwhelming them with excessive traffic.
    </span>
    <span>
      To mitigate these risks, implementing strong security practices is
      essential. Using HTTPS ensures encrypted communication, protecting data
      from interception. Proper input validation and escaping mechanisms help
      prevent code injection attacks. Authentication and authorization
      mechanisms, including multi-factor authentication (MFA) and role-based
      access control (RBAC), add layers of security to user access. Secure API
      development, including authentication, rate limiting, and encryption,
      reduces vulnerabilities in web services. Keeping software, frameworks, and
      dependencies up to date minimizes the risk of exploiting known
      vulnerabilities. Continuous monitoring, logging, and security audits help
      detect and respond to threats before they cause significant damage.
    </span>
    <span>
      Web security is not a one-time implementation but an ongoing process that
      evolves alongside emerging threats. By following best practices and
      staying vigilant, businesses and developers can build resilient, secure
      applications that protect users and data in an increasingly connected
      world.
    </span>
  </FlexBox>
);

export const Base: Story = {
  render: function Render(args) {
    const containerStyle = {
      blockSize: 320,
      display: 'flex',
      inlineSize: 480,
      width: '100%',
      borderRadius: 'var(--kbq-size-l)',
      backgroundColor: 'var(--kbq-background-bg-secondary)',
    };

    const expandedSize: ContentPanelSize = '100%';
    const collapsedSize: ContentPanelSize = '40%';
    const [isExpanded, setExpanded] = useBoolean(false);
    const [width, setWidth] = useState<ContentPanelSize>(300);

    const isFirst = useRef(true);

    useEffect(() => {
      if (isFirst.current) {
        isFirst.current = false;

        return;
      }

      setWidth(isExpanded ? expandedSize : collapsedSize);
    }, [isExpanded, collapsedSize]);

    return (
      <ContentPanelContainer
        style={containerStyle}
        slotProps={{ body: { style: { display: 'flex' } } }}
      >
        {({ toggle, isOpen, close }) => (
          <>
            <Button onPress={toggle} className={spacing({ m: 'auto' })}>
              {isOpen ? 'Close panel' : 'Open panel'}
            </Button>
            <ContentPanel
              width={width}
              onResize={setWidth}
              className={spacing({ p: 's' })}
              hideCloseButton
              isResizable
              {...args}
            >
              <ContentPanel.Header>
                <FlexBox
                  gap="xs"
                  alignItems="center"
                  style={{ inlineSize: '100%' }}
                  justifyContent="space-between"
                >
                  <Typography variant="inherit" ellipsis>
                    Web Security
                  </Typography>
                  <FlexBox>
                    <Button
                      onPress={setExpanded.toggle}
                      variant="contrast-transparent"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      startIcon={
                        <AnimatedIcon
                          icons={[
                            <IconArrowsExpandDiagonal16 key="expand" />,
                            <IconArrowsCollapseDiagonal16 key="сollapse" />,
                          ]}
                          activeIndex={+isExpanded}
                          {...args}
                        />
                      }
                      onlyIcon
                    />
                    <Button
                      onPress={close}
                      aria-label="Close"
                      startIcon={<IconXmark16 />}
                      variant="contrast-transparent"
                      onlyIcon
                    />
                  </FlexBox>
                </FlexBox>
              </ContentPanel.Header>
              <ContentPanel.Body>{content}</ContentPanel.Body>
              <ContentPanel.Footer>
                <Button variant="fade-contrast-filled">Show more</Button>
              </ContentPanel.Footer>
            </ContentPanel>
          </>
        )}
      </ContentPanelContainer>
    );
  },
};

export const Triggers: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    const [user, setUser] = useState<(typeof users)[number]>();

    return (
      <ContentPanelContainer style={{ blockSize: 300 }}>
        {({ open, close, isOpen }) => (
          <>
            <Typography variant="text-big-strong">
              Click any table row to open Content panel
            </Typography>
            <UsersTable
              users={users}
              onRowAction={(id) => {
                setUser(users.find((user) => id === user.id));

                if (!isOpen) open();
              }}
            />
            <ContentPanel>
              <ContentPanel.Header>
                {user?.firstName}&nbsp;{user?.lastName}
              </ContentPanel.Header>
              <ContentPanel.Body>{content}</ContentPanel.Body>
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

export const Open: Story = {
  render: function Render() {
    const containerStyle = {
      blockSize: 320,
      display: 'flex',
      inlineSize: 480,
      width: '100%',
      borderRadius: 'var(--kbq-size-l)',
      backgroundColor: 'var(--kbq-background-bg-secondary)',
    };

    const [isOpen, { toggle, set }] = useBoolean();

    return (
      <FlexBox direction="column" gap="m">
        <Button onPress={toggle} variant="fade-contrast-filled">
          {isOpen ? 'Close panel ' : 'Open panel'}
        </Button>
        <ContentPanelContainer
          isOpen={isOpen}
          onOpenChange={set}
          style={containerStyle}
          slotProps={{ body: { style: { display: 'flex' } } }}
        >
          <Typography
            variant="text-big-strong"
            color="contrast-secondary"
            style={{ margin: 'auto' }}
            ellipsis
          >
            Open state is controlled externally
          </Typography>
          <ContentPanel isResizable>
            <ContentPanel.Header>Web Security</ContentPanel.Header>
            <ContentPanel.Body>{content}</ContentPanel.Body>
            <ContentPanel.Footer>
              <Button variant="fade-contrast-filled">Show more</Button>
            </ContentPanel.Footer>
          </ContentPanel>
        </ContentPanelContainer>
      </FlexBox>
    );
  },
};

export const Resizable: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render() {
    const [user, setUser] = useState<(typeof users)[number]>();

    return (
      <ContentPanelContainer style={{ blockSize: 300 }}>
        {({ open, close, isOpen }) => (
          <>
            <ContentPanel defaultWidth={400} maxWidth="80%" isResizable>
              <ContentPanel.Header>
                {user?.firstName}&nbsp;{user?.lastName}
              </ContentPanel.Header>
              <ContentPanel.Body>{content}</ContentPanel.Body>
              <ContentPanel.Footer>
                <Button onPress={close}>Ok</Button>
              </ContentPanel.Footer>
            </ContentPanel>
            <Typography variant="text-big-strong">
              Click any table row to open Content panel
            </Typography>
            <UsersTable
              users={users}
              onRowAction={(id) => {
                setUser(users.find((user) => id === user.id));

                if (!isOpen) open();
              }}
            />
          </>
        )}
      </ContentPanelContainer>
    );
  },
};

export const Standalone: Story = {
  render: function Render() {
    const [open, { toggle, set }] = useBoolean();

    const containerStyle = {
      inlineSize: 480,
      blockSize: 320,
      display: 'grid',
      overflow: 'hidden',
      width: '100%',
      gridTemplateAreas: '"stack"',
      borderRadius: 'var(--kbq-size-l)',
      backgroundColor: 'var(--kbq-background-bg-secondary)',
    };

    const bodyStyle = {
      gridArea: 'stack',
      overflow: 'scroll',
      justifySelf: 'center',
      alignSelf: 'center',
    };

    const contentStyle = {
      gridArea: 'stack',
      blockSize: '100%',
      justifySelf: 'end',
      minBlockSize: 0,
    };

    return (
      <div style={containerStyle}>
        <div style={bodyStyle}>
          <Button onPress={toggle}>Open</Button>
        </div>
        <ContentPanel
          isOpen={open}
          maxWidth={400}
          minWidth={200}
          onOpenChange={set}
          defaultWidth={300}
          style={contentStyle}
          isResizable
        >
          <ContentPanel.Header>Web Security</ContentPanel.Header>
          <ContentPanel.Body>{content}</ContentPanel.Body>
        </ContentPanel>
      </div>
    );
  },
};

export const Sandbox: Story = {
  render: () => (
    <ContentPanelContainer style={{ blockSize: 300, width: '100%' }}>
      {({ toggle, isOpen }) => (
        <>
          <FlexBox direction="column" gap="m">
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam
              commodi cupiditate facere fugiat in ipsa maiores necessitatibus,
              odit quo quod rem repellat, sint, tenetur! Alias debitis dicta
              doloremque enim fuga fugiat maiores qui rerum sint voluptatibus. A
              accusantium ad assumenda cupiditate dolores eos excepturi fuga
              harum iusto molestias nam pariatur perferendis quam quisquam quo
              quod, quos ut velit. Ad architecto at consequatur consequuntur
              deleniti esse excepturi illo, incidunt, maxime modi, nemo nobis
              quia sit. Consequatur earum, ex pariatur sit temporibus veritatis.
              Eum explicabo laboriosam quae! Alias aperiam at deleniti deserunt,
              dignissimos in, iste maxime necessitatibus nobis quidem
              reiciendis, vel veritatis!
            </Typography>
            <Button onPress={toggle}>{isOpen ? 'Close' : 'Open'}</Button>
          </FlexBox>
          <ContentPanel isResizable>
            <ContentPanel.Header>ContentPanel</ContentPanel.Header>
            <ContentPanel.Body>
              <Select
                label="Attack type"
                placeholder="Select an option"
                fullWidth
              >
                <Select.Item key="bruteforce">Bruteforce</Select.Item>
                <Select.Item key="complex-attack">Complex Attack</Select.Item>
                <Select.Item key="ddos">DDoS</Select.Item>
                <Select.Item key="dos">DoS</Select.Item>
                <Select.Item key="hips-alert">HIPS Alert</Select.Item>
                <Select.Item key="ids-ips-alert">IDS/IPS Alert</Select.Item>
                <Select.Item key="identity-theft">Identity Theft</Select.Item>
                <Select.Item key="miscellaneous">Miscellaneous</Select.Item>
                <Select.Item key="network-attack">Network Attack</Select.Item>
                <Select.Item key="post-compromise">Post Compromise</Select.Item>
                <Select.Item key="potential-attack">
                  Potential Attack
                </Select.Item>
              </Select>
              <Autocomplete
                label="Protocol"
                placeholder="Search a protocol"
                fullWidth
              >
                <Autocomplete.Item key="tls">TLS</Autocomplete.Item>
                <Autocomplete.Item key="ssh">SSH</Autocomplete.Item>
                <Autocomplete.Item key="pgp">PGP</Autocomplete.Item>
                <Autocomplete.Item key="ipsec">IPSec</Autocomplete.Item>
                <Autocomplete.Item key="kerberos">Kerberos</Autocomplete.Item>
              </Autocomplete>
              <Typography>
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
              </Typography>
            </ContentPanel.Body>
          </ContentPanel>
        </>
      )}
    </ContentPanelContainer>
  ),
};
