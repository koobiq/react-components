import { join } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';
import preserveDirectives from 'rollup-preserve-directives';
import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';

const toPath = (_path: string) => join(process.cwd(), _path);

const config: StorybookConfig = {
  staticDirs: [toPath('.storybook/public')],
  stories: [
    '../packages/**/*.@(mdx|stories.@(js|ts|tsx))',
    '../docs/**/*.@(mdx|stories.@(js|ts|tsx))',
  ],
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
          '@koobiq/react-icons': toPath('packages/icons/src'),
          '@koobiq/react-primitives': toPath('packages/primitives/src'),
          '@koobiq/react-components': toPath('packages/components/src'),
        },
      },
    });
  },
  core: {
    disableTelemetry: true,
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
