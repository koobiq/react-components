import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { CodeBlock } from './index.js';

const meta = {
  title: 'E2E/CodeBlock',
  component: CodeBlock,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<typeof CodeBlock>;

const content = `// Known vulnerabilities
type Vulnerability = {
  id: number;
  name: string;
};

const vulnerabilities: Vulnerability[] = [
  { id: 1, name: 'Zero-Day Exploit' },
  { id: 2, name: 'Ransomware' },
];`;

export const Base: Story = {
  render: () => (
    <E2eGrid columns={1}>
      <CodeBlock
        files={[
          { filename: 'vulnerabilities.ts', language: 'typescript', content },
        ]}
        style={{ inlineSize: 480 }}
      />
    </E2eGrid>
  ),
};
