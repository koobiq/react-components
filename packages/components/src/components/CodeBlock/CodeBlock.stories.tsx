import { useEffect, useMemo, useRef, useState } from 'react';

import { IconDiamond16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { SidePanel } from '../SidePanel';
import { Toggle } from '../Toggle';
import { Typography } from '../Typography';

import {
  CodeBlock,
  type CodeBlockFile,
  type CodeBlockProps,
  type CodeBlockRef,
} from './index.js';

const meta = {
  title: 'Components/CodeBlock',
  component: CodeBlock,
  subcomponents: {
    HighlightConfigProvider: CodeBlock.HighlightConfigProvider,
  },
  parameters: {
    layout: 'padded',
  },
  tags: ['status:new', 'date:2026-08-05'],
} satisfies Meta<typeof CodeBlock>;

export default meta;

type Story = StoryObj<CodeBlockProps>;

export const Overview: Story = {
  render: function Render(args) {
    const highlightConfig = useMemo(
      () => ({
        core: () => import('highlight.js/lib/core'),
        languages: {
          javascript: () => import('highlight.js/lib/languages/javascript'),
        },
      }),
      []
    );

    const [hasLineNumbers, setHasLineNumbers] = useState(true);

    const files: CodeBlockFile[] = [
      {
        content: `function getVulnerabilities() {\n\treturn ['BruteForce', 'Complex Attack', 'DDoS', 'HIPS alert', 'IDS/IPS Alert', 'Zero-Day Exploit', 'XSS', 'Malware', 'Ransomware', 'Phishing'];\n};`,
        language: 'javascript',
      },
    ];

    return (
      <CodeBlock.HighlightConfigProvider config={highlightConfig}>
        <Toggle
          isSelected={hasLineNumbers}
          onChange={setHasLineNumbers}
          style={{ marginBlockEnd: 'var(--kbq-size-m)' }}
        >
          Line numbers
        </Toggle>
        <CodeBlock
          {...args}
          canToggleSoftWrap
          files={files}
          hasLineNumbers={hasLineNumbers}
        />
      </CodeBlock.HighlightConfigProvider>
    );
  },
};

export const HeaderPinned: Story = {
  render: function Render(args) {
    const highlightConfig = useMemo(
      () => ({
        core: () => import('highlight.js/lib/core'),
        languages: {
          json: () => import('highlight.js/lib/languages/json'),
        },
      }),
      []
    );

    const files: CodeBlockFile[] = [
      {
        language: 'json',
        content: `{
  "data": [{
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my hyper-super-duper mighty bikeshed!",
      "body": "The shortest article. Ever."
    },
    "relationships": {
      "author": {
        "data": {"id": "42", "type": "people"}
      }
    }
  }],
  "included": [
    {
      "type": "people",
      "id": "42",
      "attributes": {
        "name": "John"
      }
    }
  ]
}`,
      },
    ];

    return (
      <CodeBlock.HighlightConfigProvider config={highlightConfig}>
        <CodeBlock
          {...args}
          canToggleSoftWrap
          canDownload
          defaultSoftWrap
          files={files}
          hasLineNumbers
          hideTabs={false}
          isFilled
          renderTabLabel={() => 'data'}
          style={{ blockSize: 350, marginBlockEnd: 'var(--kbq-size-xs)' }}
        />
        <CodeBlock
          {...args}
          canToggleSoftWrap
          canDownload
          defaultSoftWrap
          files={files}
          hasLineNumbers
          hideTabs={false}
          renderTabLabel={(file, fallbackFileName) => (
            <>
              <IconDiamond16
                style={{ marginInlineEnd: 'var(--kbq-size-xs)' }}
              />
              <Typography as="span" variant="caps-normal-strong">
                {file.language || fallbackFileName}
              </Typography>
            </>
          )}
          style={{ blockSize: 350 }}
        />
      </CodeBlock.HighlightConfigProvider>
    );
  },
};

export const WithMaxHeight: Story = {
  render: function Render(args) {
    const highlightConfig = useMemo(
      () => ({
        core: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      }),
      []
    );

    const [viewAll, setViewAll] = useState(false);
    const [isFilled, setIsFilled] = useState(false);

    const files: CodeBlockFile[] = [
      {
        content: `<?xml version="1.0" encoding="UTF-8" ?>\n<vulnerabilities>\n\t<vulnerability>\n\t\t<name>Cross-site scripting</name>\n\t\t<abbreviation>XSS</abbreviation>\n\t\t<description>Cross-site scripting (XSS) is a type of security vulnerability that can be found in some web applications. XSS attacks enable attackers to inject client-side scripts into web pages viewed by other users. A cross-site scripting vulnerability may be used by attackers to bypass access controls such as the same-origin policy. During the second half of 2007, XSSed documented 11,253 site-specific cross-site vulnerabilities, compared to 2,134 "traditional" vulnerabilities documented by Symantec. XSS effects vary in range from petty nuisance to significant security risk, depending on the sensitivity of the data handled by the vulnerable site and the nature of any security mitigation implemented by the site's owner network.</description>\n\t</vulnerability>\n\t<vulnerability>\n\t\t<name>Denial-of-service attack</name>\n\t\t<abbreviation>DoS</abbreviation>\n\t\t<description>In computing, a denial-of-service attack (DoS attack) is a cyber-attack in which the perpetrator seeks to make a machine or network resource unavailable to its intended users by temporarily or indefinitely disrupting services of a host connected to a network. Denial of service is typically accomplished by flooding the targeted machine or resource with superfluous requests in an attempt to overload systems and prevent some or all legitimate requests from being fulfilled. The range of attacks varies widely, spanning from inundating a server with millions of requests to slow its performance, overwhelming a server with a substantial amount of invalid data, to submitting requests with an illegitimate IP address.</description>\n\t</vulnerability>\n<vulnerabilities>`,
        language: 'xml',
      },
    ];

    return (
      <CodeBlock.HighlightConfigProvider config={highlightConfig}>
        <Toggle
          isSelected={viewAll}
          onChange={setViewAll}
          style={{
            marginBlockEnd: 'var(--kbq-size-m)',
            marginInlineEnd: 'var(--kbq-size-m)',
          }}
        >
          Show all
        </Toggle>
        <Toggle isSelected={isFilled} onChange={setIsFilled}>
          Filled
        </Toggle>
        <CodeBlock
          {...args}
          canToggleSoftWrap
          files={files}
          hasLineNumbers
          isFilled={isFilled}
          maxHeight={200}
          onViewAllChange={setViewAll}
          viewAll={viewAll}
        />
      </CodeBlock.HighlightConfigProvider>
    );
  },
};

export const WithSoftWrap: Story = {
  render: function Render(args) {
    const highlightConfig = useMemo(
      () => ({
        core: () => import('highlight.js/lib/core'),
        languages: {
          json: () => import('highlight.js/lib/languages/json'),
        },
      }),
      []
    );

    const [softWrap, setSoftWrap] = useState(false);

    const files: CodeBlockFile[] = [
      {
        content: `[\n\t{\n\t\t"name": "Cross-site scripting",\n\t\t"abbreviation": "XSS",\n\t\t"description": "Cross-site scripting (XSS) is a type of security vulnerability that can be found in some web applications. XSS attacks enable attackers to inject client-side scripts into web pages viewed by other users. A cross-site scripting vulnerability may be used by attackers to bypass access controls such as the same-origin policy. During the second half of 2007, XSSed documented 11,253 site-specific cross-site vulnerabilities, compared to 2,134 "traditional" vulnerabilities documented by Symantec. XSS effects vary in range from petty nuisance to significant security risk, depending on the sensitivity of the data handled by the vulnerable site and the nature of any security mitigation implemented by the site's owner network."\n\t}\n]`,
        language: 'json',
      },
    ];

    return (
      <CodeBlock.HighlightConfigProvider config={highlightConfig}>
        <Toggle
          isSelected={softWrap}
          onChange={setSoftWrap}
          style={{ marginBlockEnd: 'var(--kbq-size-m)' }}
        >
          Word wrap
        </Toggle>
        <CodeBlock
          {...args}
          canToggleSoftWrap
          files={files}
          hasLineNumbers
          onSoftWrapChange={setSoftWrap}
          softWrap={softWrap}
        />
      </CodeBlock.HighlightConfigProvider>
    );
  },
};

export const WithTabs: Story = {
  render: function Render(args) {
    const highlightConfig = useMemo(
      () => ({
        core: () => import('highlight.js/lib/core'),
        languages: {
          css: () => import('highlight.js/lib/languages/css'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          // The XML grammar provides the `html` alias.
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      }),
      []
    );

    const [hideTabs, setHideTabs] = useState(false);
    const [isFilled, setIsFilled] = useState(false);
    const [hasLineNumbers, setHasLineNumbers] = useState(true);

    const files: CodeBlockFile[] = [
      {
        language: 'html',
        filename: 'index.html',
        content: `<!doctype html>\n<html lang="en">\n\t<head>\n\t\t<meta charset="UTF-8" />\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n\t\t<title>Security dashboard</title>\n\t\t<link rel="stylesheet" href="./main.css" />\n\t</head>\n\t<body>\n\t\t<main id="app"></main>\n\t\t<script type="module" src="./main.ts"></script>\n\t</body>\n</html>`,
      },
      {
        language: 'typescript',
        filename: 'main.ts',
        content: `type Vulnerability = {\n\tname: string;\n\tseverity: 'critical' | 'high' | 'medium';\n};\n\nconst vulnerabilities: Vulnerability[] = [\n\t{ name: 'Cross-site scripting', severity: 'high' },\n\t{ name: 'SQL injection', severity: 'critical' },\n\t{ name: 'Open redirect', severity: 'medium' }\n];\n\nconst app = document.querySelector<HTMLElement>('#app');\n\nif (!app) throw new Error('Application root was not found');\n\napp.innerHTML = \`\n\t<h1>Vulnerabilities</h1>\n\t<ul>\n\t\t\${vulnerabilities\n\t\t\t.map(({ name, severity }) => \`<li data-severity="\${severity}">\${name}</li>\`)\n\t\t\t.join('')}\n\t</ul>\n\`;`,
      },
      {
        language: 'css',
        filename: 'main.css',
        content: `:root {\n\tfont-family: Inter, sans-serif;\n\tcolor: #1f2937;\n\tbackground: #f8fafc;\n}\n\nbody {\n\tmargin: 0;\n\tpadding: 24px;\n}\n\nmain {\n\tmax-width: 640px;\n\tmargin: 0 auto;\n}\n\nul {\n\tpadding: 0;\n\tlist-style: none;\n}\n\nli {\n\tpadding: 12px;\n\tborder-bottom: 1px solid #e2e8f0;\n}`,
      },
    ];

    return (
      <CodeBlock.HighlightConfigProvider config={highlightConfig}>
        <Toggle
          isSelected={hideTabs}
          onChange={setHideTabs}
          style={{
            marginBlockEnd: 'var(--kbq-size-m)',
            marginInlineEnd: 'var(--kbq-size-m)',
          }}
        >
          Hide tabs
        </Toggle>
        <Toggle
          isSelected={isFilled}
          onChange={setIsFilled}
          style={{ marginInlineEnd: 'var(--kbq-size-m)' }}
        >
          Filled
        </Toggle>
        <Toggle isSelected={hasLineNumbers} onChange={setHasLineNumbers}>
          Line numbers
        </Toggle>
        <CodeBlock
          {...args}
          canDownload
          canToggleSoftWrap
          defaultActiveFileIndex={1}
          files={files}
          hasLineNumbers={hasLineNumbers}
          hideTabs={hideTabs}
          isFilled={isFilled}
        />
      </CodeBlock.HighlightConfigProvider>
    );
  },
};

export const WithTabsAndShadow: Story = {
  render: function Render(args) {
    const highlightConfig = useMemo(
      () => ({
        core: () => import('highlight.js/lib/core'),
        languages: {
          css: () => import('highlight.js/lib/languages/css'),
          typescript: () => import('highlight.js/lib/languages/typescript'),
          // The XML grammar provides the `html` alias.
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      }),
      []
    );

    const codeBlockRef = useRef<CodeBlockRef>(null);

    const files: CodeBlockFile[] = [
      {
        language: 'html',
        filename: 'index.html',
        content: `<!doctype html>\n<html lang="en">\n\t<head>\n\t\t<meta charset="UTF-8" />\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0" />\n\t\t<title>Security dashboard</title>\n\t\t<link rel="stylesheet" href="./main.css" />\n\t</head>\n\t<body>\n\t\t<main id="app"></main>\n\t\t<script type="module" src="./main.ts"></script>\n\t</body>\n</html>`,
      },
      {
        language: 'typescript',
        filename: 'main.ts',
        content: `type Vulnerability = {\n\tname: string;\n\tseverity: 'critical' | 'high' | 'medium';\n};\n\nconst vulnerabilities: Vulnerability[] = [\n\t{ name: 'Cross-site scripting', severity: 'high' },\n\t{ name: 'SQL injection', severity: 'critical' },\n\t{ name: 'Open redirect', severity: 'medium' }\n];\n\nconst app = document.querySelector<HTMLElement>('#app');\n\nif (!app) throw new Error('Application root was not found');\n\napp.innerHTML = \`\n\t<h1>Vulnerabilities</h1>\n\t<ul>\n\t\t\${vulnerabilities\n\t\t\t.map(({ name, severity }) => \`<li data-severity="\${severity}">\${name}</li>\`)\n\t\t\t.join('')}\n\t</ul>\n\`;`,
      },
      {
        language: 'css',
        filename: 'main.css',
        content: `:root {\n\tfont-family: Inter, sans-serif;\n\tcolor: #1f2937;\n\tbackground: #f8fafc;\n}\n\nbody {\n\tmargin: 0;\n\tpadding: 24px;\n}\n\nmain {\n\tmax-width: 640px;\n\tmargin: 0 auto;\n}\n\nul {\n\tpadding: 0;\n\tlist-style: none;\n}\n\nli {\n\tpadding: 12px;\n\tborder-bottom: 1px solid #e2e8f0;\n}`,
      },
    ];

    useEffect(() => {
      codeBlockRef.current?.scrollTo({ bottom: 0, behavior: 'instant' });
    }, []);

    return (
      <CodeBlock.HighlightConfigProvider config={highlightConfig}>
        <CodeBlock
          {...args}
          ref={codeBlockRef}
          canToggleSoftWrap
          defaultActiveFileIndex={2}
          defaultSoftWrap
          files={files}
          hasLineNumbers
          style={{ blockSize: 350 }}
        />
      </CodeBlock.HighlightConfigProvider>
    );
  },
};

export const WithFilled: Story = {
  render: function Render(args) {
    const highlightConfig = useMemo(
      () => ({
        core: () => import('highlight.js/lib/core'),
        languages: {
          bash: () => import('highlight.js/lib/languages/bash'),
        },
      }),
      []
    );

    const [isFilled, setIsFilled] = useState(true);
    const [alwaysShowActionBar, setAlwaysShowActionBar] = useState(false);

    const files: CodeBlockFile[] = [
      {
        language: 'bash',
        content: 'npm install @koobiq/components',
      },
    ];

    return (
      <CodeBlock.HighlightConfigProvider config={highlightConfig}>
        <Toggle
          isSelected={isFilled}
          onChange={setIsFilled}
          style={{
            marginBlockEnd: 'var(--kbq-size-m)',
            marginInlineEnd: 'var(--kbq-size-m)',
          }}
        >
          Filled
        </Toggle>
        <Toggle
          isSelected={alwaysShowActionBar}
          onChange={setAlwaysShowActionBar}
        >
          Always show actionbar
        </Toggle>
        <CodeBlock
          {...args}
          alwaysShowActionBar={alwaysShowActionBar}
          files={files}
          isFilled={isFilled}
        />
      </CodeBlock.HighlightConfigProvider>
    );
  },
};

export const WithNoBorder: Story = {
  render: function Render(args) {
    const highlightConfig = useMemo(
      () => ({
        core: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      }),
      []
    );

    const xss = `\t<vulnerability>\n\t\t<name>Cross-site scripting</name>\n\t\t<abbreviation>XSS</abbreviation>\n\t\t<description>Cross-site scripting (XSS) is a type of security vulnerability that can be found in some web applications. XSS attacks enable attackers to inject client-side scripts into web pages viewed by other users. A cross-site scripting vulnerability may be used by attackers to bypass access controls such as the same-origin policy. During the second half of 2007, XSSed documented 11,253 site-specific cross-site vulnerabilities, compared to 2,134 "traditional" vulnerabilities documented by Symantec. XSS effects vary in range from petty nuisance to significant security risk, depending on the sensitivity of the data handled by the vulnerable site and the nature of any security mitigation implemented by the site's owner network.</description>\n\t</vulnerability>`;
    const dos = `\t<vulnerability>\n\t\t<name>Denial-of-service attack</name>\n\t\t<abbreviation>DoS</abbreviation>\n\t\t<description>In computing, a denial-of-service attack (DoS attack) is a cyber-attack in which the perpetrator seeks to make a machine or network resource unavailable to its intended users by temporarily or indefinitely disrupting services of a host connected to a network. Denial of service is typically accomplished by flooding the targeted machine or resource with superfluous requests in an attempt to overload systems and prevent some or all legitimate requests from being fulfilled. The range of attacks varies widely, spanning from inundating a server with millions of requests to slow its performance, overwhelming a server with a substantial amount of invalid data, to submitting requests with an illegitimate IP address.</description>\n\t</vulnerability>`;

    const files: CodeBlockFile[] = [
      {
        content: `<?xml version="1.0" encoding="UTF-8" ?>\n<vulnerabilities>\n${[
          xss,
          dos,
          ...Array.from({ length: 10 }, () => xss),
        ].join('\n')}\n<vulnerabilities>`,
        language: 'xml',
        link: 'https://github.com/koobiq/angular-components',
      },
    ];

    return (
      <CodeBlock.HighlightConfigProvider config={highlightConfig}>
        <SidePanel
          size="small"
          control={(props) => <Button {...props}>Open sidepanel</Button>}
        >
          {() => (
            <SidePanel.Body
              style={{
                flexGrow: 1,
                minBlockSize: 0,
                overflow: 'hidden',
                padding: 0,
              }}
            >
              <CodeBlock
                {...args}
                canToggleSoftWrap
                defaultSoftWrap
                files={files}
                hasLineNumbers
                hideBorder
                style={{ blockSize: '100%' }}
              />
            </SidePanel.Body>
          )}
        </SidePanel>
      </CodeBlock.HighlightConfigProvider>
    );
  },
};

export const WithLink: Story = {
  render: function Render(args) {
    const highlightConfig = useMemo(
      () => ({
        core: () => import('highlight.js/lib/core'),
        languages: {
          xml: () => import('highlight.js/lib/languages/xml'),
        },
      }),
      []
    );

    const files: CodeBlockFile[] = [
      {
        link: 'https://en.wikipedia.org/wiki/Cross-site_scripting',
        filename: 'vulnerabilities.xml',
        content: `<?xml version="1.0" encoding="UTF-8" ?>\n<vulnerabilities>\n\t<vulnerability>\n\t\t<name>Cross-site scripting</name>\n\t\t<abbreviation>XSS</abbreviation>\n\t\t<description>Cross-site scripting (XSS) is a type of security vulnerability that can be found in some web applications. XSS attacks enable attackers to inject client-side scripts into web pages viewed by other users. A cross-site scripting vulnerability may be used by attackers to bypass access controls such as the same-origin policy. During the second half of 2007, XSSed documented 11,253 site-specific cross-site vulnerabilities, compared to 2,134 "traditional" vulnerabilities documented by Symantec. XSS effects vary in range from petty nuisance to significant security risk, depending on the sensitivity of the data handled by the vulnerable site and the nature of any security mitigation implemented by the site's owner network.</description>\n\t</vulnerability>\n<vulnerabilities>`,
        language: 'xml',
      },
    ];

    return (
      <CodeBlock.HighlightConfigProvider config={highlightConfig}>
        <CodeBlock {...args} files={files} hasLineNumbers hideCopyButton />
      </CodeBlock.HighlightConfigProvider>
    );
  },
};
