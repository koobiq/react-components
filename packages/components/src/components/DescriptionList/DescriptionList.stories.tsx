import { useElementSize } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { Badge } from '../Badge';
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
          <Badge variant="fade-theme">New</Badge>
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
  render: function Render(args) {
    const { ref, width } = useElementSize<HTMLDListElement>();

    return (
      <div
        style={{
          inlineSize: 600,
          minInlineSize: 200,
          maxInlineSize: '100%',
          padding: 'var(--kbq-size-l)',
          border: '1px dashed var(--kbq-line-contrast-less)',
          overflow: 'auto',
          resize: 'horizontal',
        }}
      >
        <DescriptionList
          {...args}
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

export const TermWidth: Story = {
  render: (args) => {
    const examples = [
      { termWidth: '25%', label: 'termWidth="25%" (default)' },
      { termWidth: '50%', label: 'termWidth="50%"' },
      { termWidth: 200, label: 'termWidth={200}' },
      { termWidth: 'auto', label: 'termWidth="auto"' },
    ];

    return (
      <FlexBox direction="column" gap="xl">
        {examples.map(({ termWidth, label }) => (
          <FlexBox key={label} direction="column" gap="s">
            <Typography variant="text-normal-strong">{label}</Typography>

            <DescriptionList {...args} termWidth={termWidth}>
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
            </DescriptionList>
          </FlexBox>
        ))}
      </FlexBox>
    );
  },
};

export const Alignment: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="xl">
      <FlexBox direction="column" gap="s">
        <Typography variant="text-normal-strong">
          alignItems=&quot;center&quot;
        </Typography>

        <DescriptionList {...args} alignItems="center">
          <DescriptionList.Group id="description">
            <DescriptionList.Term>Description</DescriptionList.Term>
            <DescriptionList.Description>
              In a distributed denial-of-service attack, the incoming traffic
              flooding the victim originates from many different sources. This
              makes it impossible to stop the attack by blocking a single
              source.
            </DescriptionList.Description>
          </DescriptionList.Group>
        </DescriptionList>
      </FlexBox>

      <FlexBox direction="column" gap="s">
        <Typography variant="text-normal-strong">
          justifyItems=&quot;end&quot;
        </Typography>

        <DescriptionList {...args} justifyItems="end">
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
        </DescriptionList>
      </FlexBox>
    </FlexBox>
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

export const Group: Story = {
  render: (args) => (
    <DescriptionList {...args}>
      <DescriptionList.Group id="type">
        <DescriptionList.Term>Incident type</DescriptionList.Term>
        <DescriptionList.Description>Malware</DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group
        id="status"
        style={{
          marginBlock: 'calc(-1 * var(--kbq-size-xxs))',
          marginInline: 'calc(-1 * var(--kbq-size-s))',
          paddingBlock: 'var(--kbq-size-xxs)',
          paddingInline: 'var(--kbq-size-s)',
          borderRadius: 'var(--kbq-size-s)',
          backgroundColor: 'var(--kbq-background-warning-fade)',
        }}
      >
        <DescriptionList.Term>Status</DescriptionList.Term>
        <DescriptionList.Description>Closed</DescriptionList.Description>
      </DescriptionList.Group>

      <DescriptionList.Group id="assignee">
        <DescriptionList.Term>Assignee</DescriptionList.Term>
        <DescriptionList.Description>John Smith</DescriptionList.Description>
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
