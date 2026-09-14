import { useElementSize } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../Badge';
import { ClampedList } from '../ClampedList';
import { ClampedText } from '../ClampedText';
import { FlexBox } from '../FlexBox';
import { Link } from '../Link';
import { Typography } from '../Typography';

import { DescriptionList } from './index';

const meta = {
  title: 'Components/DescriptionList',
  component: DescriptionList,
  subcomponents: {
    'DescriptionList.Group': DescriptionList.Group,
    'DescriptionList.Term': DescriptionList.Term,
    'DescriptionList.Description': DescriptionList.Description,
  },
  tags: ['status:new', 'date:2026-09-13'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionList.Group id="type">
        <DescriptionList.Term>Incident type</DescriptionList.Term>
        <DescriptionList.Description>Malware</DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="identifier">
        <DescriptionList.Term>Identifier</DescriptionList.Term>
        <DescriptionList.Description>
          INC-2022-125-78253
        </DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="status">
        <DescriptionList.Term>Status</DescriptionList.Term>
        <DescriptionList.Description>
          <Badge variant="fade-theme" size="compact">
            New
          </Badge>
        </DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="assignee">
        <DescriptionList.Term>Assignee</DescriptionList.Term>
        <DescriptionList.Description>John Smith</DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="description">
        <DescriptionList.Term>Description</DescriptionList.Term>
        <DescriptionList.Description>
          An employee opened an attachment in a phishing email, and the file
          executed malicious code on the workstation.
        </DescriptionList.Description>
      </DescriptionList.Group>
    </DescriptionList>
  ),
};

export const DynamicCollection: Story = {
  render: function Render() {
    const fields = [
      { id: 'type', label: 'Incident type', value: 'Malware' },
      { id: 'identifier', label: 'Identifier', value: 'INC-2022-125-78253' },
      { id: 'status', label: 'Status', value: 'New' },
      { id: 'assignee', label: 'Assignee', value: 'John Smith' },
    ];

    return (
      <DescriptionList items={fields}>
        {(field) => (
          <DescriptionList.Group>
            <DescriptionList.Term>{field.label}</DescriptionList.Term>
            <DescriptionList.Description>
              {field.value}
            </DescriptionList.Description>
          </DescriptionList.Group>
        )}
      </DescriptionList>
    );
  },
};

export const Orientation: Story = {
  render: (args) => (
    <DescriptionList {...args} orientation="vertical">
      <DescriptionList.Group id="type">
        <DescriptionList.Term>Incident type</DescriptionList.Term>
        <DescriptionList.Description>Malware</DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="identifier">
        <DescriptionList.Term>Identifier</DescriptionList.Term>
        <DescriptionList.Description>
          INC-2022-125-78253
        </DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="assignee">
        <DescriptionList.Term>Assignee</DescriptionList.Term>
        <DescriptionList.Description>John Smith</DescriptionList.Description>
      </DescriptionList.Group>
    </DescriptionList>
  ),
};

export const ResponsiveOrientation: Story = {
  render: (args) => (
    <DescriptionList
      {...args}
      orientation={{ xs: 'vertical', m: 'horizontal' }}
    >
      <DescriptionList.Group id="type">
        <DescriptionList.Term>Incident type</DescriptionList.Term>
        <DescriptionList.Description>Malware</DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="identifier">
        <DescriptionList.Term>Identifier</DescriptionList.Term>
        <DescriptionList.Description>
          INC-2022-125-78253
        </DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="assignee">
        <DescriptionList.Term>Assignee</DescriptionList.Term>
        <DescriptionList.Description>John Smith</DescriptionList.Description>
      </DescriptionList.Group>
    </DescriptionList>
  ),
};

export const AdaptiveOrientation: Story = {
  render: function Render() {
    const { ref, width } = useElementSize<HTMLDListElement>();

    return (
      <div
        style={{
          inlineSize: 600,
          minInlineSize: 200,
          maxInlineSize: '100%',
          boxSizing: 'border-box',
          padding: 'var(--kbq-size-l)',
          border: '1px dashed var(--kbq-line-contrast-less)',
          overflow: 'auto',
          resize: 'horizontal',
        }}
      >
        <DescriptionList
          ref={ref}
          orientation={width > 0 && width <= 400 ? 'vertical' : 'horizontal'}
        >
          <DescriptionList.Group id="type">
            <DescriptionList.Term>Incident type</DescriptionList.Term>
            <DescriptionList.Description>Malware</DescriptionList.Description>
          </DescriptionList.Group>

          <DescriptionList.Group id="identifier">
            <DescriptionList.Term>Identifier</DescriptionList.Term>
            <DescriptionList.Description>
              INC-2022-125-78253
            </DescriptionList.Description>
          </DescriptionList.Group>

          <DescriptionList.Group id="assignee">
            <DescriptionList.Term>Assignee</DescriptionList.Term>
            <DescriptionList.Description>
              John Smith
            </DescriptionList.Description>
          </DescriptionList.Group>
        </DescriptionList>
      </div>
    );
  },
};

export const Columns: Story = {
  render: (args) => {
    const examples = [
      {
        columns: 'repeat(4, 1fr)',
        label: 'columns="repeat(4, 1fr)" (default)',
      },
      { columns: 'repeat(2, 1fr)', label: 'columns="repeat(2, 1fr)"' },
      { columns: '200px 1fr', label: 'columns="200px 1fr"' },
      { columns: 'auto 1fr', label: 'columns="auto 1fr"' },
    ];

    return (
      <FlexBox direction="column" alignItems="stretch" gap="xl">
        {examples.map(({ columns, label }) => (
          <FlexBox key={label} direction="column" alignItems="stretch" gap="s">
            <Typography variant="text-normal-strong">{label}</Typography>

            <DescriptionList
              {...args}
              columns={columns}
              style={{
                padding: 'var(--kbq-size-l)',
                border: '1px solid var(--kbq-line-contrast-less)',
                borderRadius: 'var(--kbq-size-m)',
              }}
            >
              <DescriptionList.Group id="type">
                <DescriptionList.Term>Incident type</DescriptionList.Term>
                <DescriptionList.Description>
                  Malware
                </DescriptionList.Description>
              </DescriptionList.Group>

              <DescriptionList.Group id="identifier">
                <DescriptionList.Term>Identifier</DescriptionList.Term>
                <DescriptionList.Description>
                  INC-2022-125-78253
                </DescriptionList.Description>
              </DescriptionList.Group>

              <DescriptionList.Group id="assignee">
                <DescriptionList.Term>Assignee</DescriptionList.Term>
                <DescriptionList.Description>
                  John Smith
                </DescriptionList.Description>
              </DescriptionList.Group>
            </DescriptionList>
          </FlexBox>
        ))}
      </FlexBox>
    );
  },
};

export const Alignment: Story = {
  render: (args) => (
    <DescriptionList {...args} alignItems="center">
      <DescriptionList.Group id="type">
        <DescriptionList.Term>Incident type</DescriptionList.Term>
        <DescriptionList.Description>Malware</DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="description">
        <DescriptionList.Term>Description</DescriptionList.Term>
        <DescriptionList.Description>
          In a distributed denial-of-service attack, the incoming traffic
          flooding the victim originates from many different sources.
        </DescriptionList.Description>
      </DescriptionList.Group>
    </DescriptionList>
  ),
};

export const LongText: Story = {
  render: (args) => (
    <DescriptionList {...args} style={{ maxInlineSize: 600 }}>
      <DescriptionList.Group id="description">
        <DescriptionList.Term>
          security.incident.description
        </DescriptionList.Term>
        <DescriptionList.Description>
          An employee opened the security_update.exe attachment in a phishing
          email. The file executed malicious code on the workstation.
        </DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="hash">
        <DescriptionList.Term>
          process.parent.executable.hash.sha256
        </DescriptionList.Term>
        <DescriptionList.Description>
          <Typography as="span" variant="mono-normal">
            5cfeaa7084b508d0ea762d8cfed396b6029eed6005d381b16e725755ec801014
          </Typography>
        </DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="path">
        <DescriptionList.Term>
          process.parent.executable.full_path
        </DescriptionList.Term>
        <DescriptionList.Description>
          C:\Users\Administrator\AppData\Local\Temp\SecurityUpdate\packages\windows\x64\security_update.exe
        </DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="url">
        <DescriptionList.Term>
          threat.mitre_attack.technique_url
        </DescriptionList.Term>
        <DescriptionList.Description>
          <Link
            href="https://attack.mitre.org/techniques/T1204/002/"
            target="_blank"
          >
            https://attack.mitre.org/techniques/T1204/002/
          </Link>
        </DescriptionList.Description>
      </DescriptionList.Group>
    </DescriptionList>
  ),
};

export const Composition: Story = {
  render: function Render() {
    const hosts = [
      'web-01',
      'web-02',
      'web-03',
      'app-01',
      'app-02',
      'db-01',
      'db-02',
      'cache-01',
      'mail-01',
      'vpn-01',
      'proxy-01',
      'backup-01',
      'dc-01',
      'dc-02',
    ].map((name, index) => ({ id: index, name }));

    return (
      <DescriptionList>
        <DescriptionList.Group id="type">
          <DescriptionList.Term>Incident type</DescriptionList.Term>
          <DescriptionList.Description>DDoS</DescriptionList.Description>
        </DescriptionList.Group>

        <DescriptionList.Group id="description">
          <DescriptionList.Term>Description</DescriptionList.Term>
          <DescriptionList.Description>
            <ClampedText rows={2}>
              In a distributed denial-of-service attack, the incoming traffic
              flooding the victim originates from many different sources. More
              sophisticated strategies are required to mitigate this type of
              attack; simply attempting to block a single source is insufficient
              as there are multiple sources. Criminal perpetrators of such
              attacks often target sites or services hosted on high-profile web
              servers such as banks or credit card payment gateways.
            </ClampedText>
          </DescriptionList.Description>
        </DescriptionList.Group>

        <DescriptionList.Group id="hosts">
          <DescriptionList.Term>Affected hosts</DescriptionList.Term>
          <DescriptionList.Description>
            <ClampedList
              items={hosts}
              collapsedVisibleCount={5}
              moreText={`${hosts.length - 5} more`}
              lessText="Collapse"
              slotProps={{
                content: { style: { display: 'inline' } },
                toggle: { icon: null, style: { margin: 0 } },
              }}
            >
              {({ visibleItems }) => (
                <ul
                  style={{
                    display: 'inline',
                    margin: 0,
                    padding: 0,
                    listStyle: 'none',
                  }}
                >
                  {visibleItems.map((host) => (
                    <li key={host.id} style={{ display: 'inline' }}>
                      <Typography
                        as="span"
                        style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}
                      >
                        {host.name}
                        {',\u00a0'}
                      </Typography>
                    </li>
                  ))}
                </ul>
              )}
            </ClampedList>
          </DescriptionList.Description>
        </DescriptionList.Group>
      </DescriptionList>
    );
  },
};
