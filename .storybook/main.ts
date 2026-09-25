import { join } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';
import preserveDirectives from 'rollup-preserve-directives';
import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';

const toPath = (_path: string) => join(process.cwd(), _path);

// Storybook starts a test build from the flag or from the env variable, and reads the variable as
// truthy unless it is empty, `0` or `false`: the stories below have to follow the same rule.
const sbTestBuild = (process.env.SB_TESTBUILD ?? '').toLowerCase();

const isTestBuild =
  process.argv.includes('--test') || !['', '0', 'false'].includes(sbTestBuild);

// The e2e test components and the documentation are of no use to each other: the suite opens
// nothing but `E2E/*`, and a docs build would keep the test components reachable by URL, since
// `!dev` only hides a story from the sidebar.
const stories = isTestBuild
  ? ['../packages/**/*.e2e.stories.@(js|ts|tsx)']
  : [
      '../packages/**/!(*.e2e).@(mdx|stories.@(js|ts|tsx))',
      '../docs/**/*.@(mdx|stories.@(js|ts|tsx))',
    ];

const config: StorybookConfig = {
  staticDirs: [toPath('.storybook/public')],
  stories,
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-mcp',
    '@storybook/addon-links',
    '@chromatic-com/storybook',
    '@vueless/storybook-dark-mode',
  ],
  async viteFinal(config: UserConfig) {
    return mergeConfig(config, {
      build: {
        cssMinify: 'lightningcss',
      },
      plugins: [preserveDirectives()],
      define: {
        'process.env.UNSAFE_DISABLE_ELEMENT_ERRORS': false,
      },
      resolve: {
        alias: {
          '@koobiq/logger': toPath('packages/logger/src'),
          '@koobiq/react-core': toPath('packages/core/src'),
          '@koobiq/react-primitives': toPath('packages/primitives/src'),
          '@koobiq/react-components': toPath('packages/components/src'),
        },
      },
    });
  },
  core: {
    disableTelemetry: true,
  },
  build: {
    test: {
      // The e2e build keeps the doc blocks preview.ts imports through DocContainer.
      disableBlocks: false,
    },
  },
  features: {
    componentsManifest: true,
  },
  framework: {
    name: '@storybook/react-vite',
    options: {
      // strictMode: true,
    },
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: join(process.cwd(), 'tsconfig.json'),
      exclude: [
        '**/*.stories.tsx',
        '**/.storybook/**/*.ts',
        '**/.storybook/**/*.tsx',
      ],
      // Filter out third-party props from node_modules.
      propFilter: (prop) => {
        if (!prop.parent) return true;

        const file = prop.parent.fileName;

        return (
          file.includes('/src/') ||
          file.includes('react-aria') ||
          file.includes('@react-aria') ||
          file.includes('@react-stately') ||
          file.includes('@internationalized')
        );
      },
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
    },
  },
};

export default config;
