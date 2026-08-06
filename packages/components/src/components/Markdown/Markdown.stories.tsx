import type { Meta, StoryObj } from '@storybook/react';

import { Markdown } from './index.js';

const meta = {
  title: 'Components/Markdown',
  component: Markdown,
  parameters: {
    layout: 'padded',
  },
  tags: ['status:new', 'date:2026-08-05'],
} satisfies Meta<typeof Markdown>;

export default meta;
type Story = StoryObj<typeof Markdown>;

export const Overview: Story = {
  render: () => (
    <Markdown>
      {`# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`}
    </Markdown>
  ),
};

export const Headers: Story = {
  render: () => (
    <Markdown>
      {`# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`}
    </Markdown>
  ),
};

export const HeadersCombinations: Story = {
  render: () => (
    <Markdown>
      {`## Data Protection System
### Security Levels
#### Threat Types

Recommended password length is 12 characters, encryption key length is 256 bits. Weak passwords are not rejected, the system raises security requirements.

### Attack Detection

Monitoring happens in real time. Multiple incidents form a unified threat picture. New events are displayed in the security log. If there are many threats, critical ones are highlighted with priority. Most often attacks are detected automatically, but an administrator can initiate a manual check.`}
    </Markdown>
  ),
};

export const Paragraph: Story = {
  render: () => (
    <Markdown>
      {`A brute-force attack is a cryptanalytic attack that can, in theory, be used to attempt to decrypt any encrypted data (except for data encrypted in an information-theoretically secure manner).

Such an attack might be used when it is not possible to take advantage of other weaknesses in an encryption system (if any exist) that would make the task easier.`}
    </Markdown>
  ),
};

export const TextEmphasis: Story = {
  render: () => (
    <Markdown>
      {`**bold**
__bold__

_italic_
*italic*

***bold and italic***
___bold and italic___`}
    </Markdown>
  ),
};

export const Blockquote: Story = {
  render: () => (
    <Markdown>
      {`> A [brute-force attack](#) is a cryptanalytic attack that can, in theory, be used to attempt to decrypt any encrypted data (except for data encrypted in an information-theoretically secure manner). Such an attack might be used when it is not possible to take advantage of other weaknesses in an encryption system (if any exist) that would make the task easier.`}
    </Markdown>
  ),
};

export const Lists: Story = {
  render: () => (
    <Markdown>
      {`### Ordered List:

1. First item
2. Second item
3. Third item
4. Fourth item

### Unordered List:

- First item
- Second item
- Third item
- Fourth item`}
    </Markdown>
  ),
};

export const InlineCode: Story = {
  render: () => (
    <Markdown>{'Use the `bypassSecurityTrustHtml()` function'}</Markdown>
  ),
};

export const CodeBlock: Story = {
  render: () => (
    <Markdown>
      {`\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Koobiq</title>
</head>
<body>
    <app></app>
</body>
</html>
\`\`\``}
    </Markdown>
  ),
};

export const Divider: Story = {
  render: () => <Markdown>{'---'}</Markdown>,
};

export const Link: Story = {
  render: () => (
    <Markdown>
      {`[Link](#)

A [\`brute-force\` attack](#) is a cryptanalytic attack that can, in theory, be used to attempt to decrypt any encrypted data (except for data encrypted in an information-theoretically secure manner).`}
    </Markdown>
  ),
};

export const Image: Story = {
  render: () => (
    <Markdown>
      {`![With caption text](https://koobiq.io/assets/images/markdown/markdown-image.png)
*Caption*`}
    </Markdown>
  ),
};

export const Table: Story = {
  render: () => (
    <Markdown>
      {`| Default    | Left align | Center align | Right align |
| ---------- | :--------- | :----------: | ----------: |
| Babable    | Zillya     |    ClamAV    |     Acronis |
| Cybereason | McAfee     |    Cyren     |       Zoner |
| ESET NOD32 | Alibaba    |    eScan     |      Dr.Web |`}
    </Markdown>
  ),
};

export const LineBreak: Story = {
  render: () => <Markdown>{'First line  \nSecond line'}</Markdown>,
};

export const LineBreakWithMarkedOptions: Story = {
  render: () => (
    <Markdown markedOptions={{ breaks: true }}>
      {'First line\nSecond line'}
    </Markdown>
  ),
};

export const Article: Story = {
  render: () => (
    <Markdown>
      {`# Cybersecurity Fundamentals

![With caption text](https://koobiq.io/assets/images/markdown/markdown-image.png)
*Caption*

## Network Security

Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information; extorting money from users; or interrupting normal business processes.

Implementing effective cybersecurity measures is particularly challenging today because there are more devices than people, and attackers are becoming more innovative. A successful cybersecurity approach has multiple layers of protection spread across the computers, networks, programs, or data that one intends to keep safe.

## Data Protection

### Encryption Standards

Network security involves protecting the usability and integrity of network and data. It includes both hardware and software technologies. Effective network security manages access to the network and targets a variety of threats and stops them from entering or spreading on your network.

### Authentication Methods

Multi-factor authentication adds an extra layer of security by requiring users to provide two or more verification factors to gain access to a resource. This significantly reduces the risk of unauthorized access even if passwords are compromised.

## Threat Detection

![With caption text](https://koobiq.io/assets/images/markdown/markdown-image.png)
*Image with a caption*

Advanced persistent threats represent sophisticated, long-term cyber attacks where intruders gain access to a network and remain undetected for extended periods. These attacks are typically aimed at stealing data rather than causing damage to the network or organization. Threat detection systems use machine learning and behavioral analysis to identify suspicious activities and potential security breaches before they can cause significant damage.

> Security is not a product, but a process that requires continuous monitoring and improvement.

Incident response planning is crucial for organizations to effectively handle security breaches when they occur. A well-structured incident response plan helps minimize damage and recovery time.

1. Identify and assess the security incident
2. Contain the threat to prevent further damage
3. Eradicate the threat from all affected systems
4. Recover normal operations and monitor for signs of weakness

Risk assessment and vulnerability management are ongoing processes that help organizations identify potential security gaps. Regular security audits and penetration testing help ensure that security measures remain effective against evolving threats.

Cybersecurity awareness training is essential for all employees as human error remains one of the leading causes of security breaches. Regular training helps staff recognize phishing attempts, social engineering tactics, and other common attack vectors.

### Security Monitoring

Security information and event management systems collect and analyze security-related data from various sources across an organization's infrastructure.

\`\`\`bash
$ nmap -sS -O 192.168.1.1
\`\`\`

### Compliance Standards

#### Regulatory Requirements

Organizations must comply with various cybersecurity regulations and standards depending on their industry and location. These may include GDPR, HIPAA, SOX, and industry-specific requirements that mandate specific security controls and practices.

- Regular security assessments and audits
- Implementation of appropriate technical and organizational measures
- Incident reporting and breach notification procedures

Continuous improvement in cybersecurity requires staying updated with the latest threats, technologies, and best practices in the field.`}
    </Markdown>
  ),
};
