import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Markdown } from './index.js';

const meta = {
  title: 'E2E/Markdown',
  component: Markdown,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Markdown>;

export default meta;

type Story = StoryObj<typeof Markdown>;

const markdown = `# Incident report

A **brute-force** attack on the *admin* account. Read the [guide](https://koobiq.io) and run \`nmap -sS\`.

> The account was locked after 5 failed attempts.

---

## Actions

- Block the source address
- Reset the password

1. Identify the incident
2. Contain the threat

\`\`\`sh
iptables -A INPUT -s 10.0.0.7 -j DROP
systemctl restart sshd
\`\`\`

| Severity | Count |
| -------- | ----- |
| High     | 3     |
| Low      | 12    |`;

export const Elements: Story = {
  render: () => (
    <E2eGrid columns={1}>
      <Markdown style={{ inlineSize: 480 }}>{markdown}</Markdown>
    </E2eGrid>
  ),
};
