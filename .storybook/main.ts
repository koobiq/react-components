import { join, dirname } from 'node:path';

import type { StorybookConfig } from '@storybook/react-vite';
import remarkGfm from 'remark-gfm';
import preserveDirectives from 'rollup-preserve-directives';
import { mergeConfig } from 'vite';
import type { UserConfig } from 'vite';

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}

const toPath = (_path: string) => join(process.cwd(), _path);

const config: StorybookConfig = {
  staticDirs: [toPath('.storybook/public')],
  stories: [
    '../packages/**/*.@(mdx|stories.@(js|ts|tsx))',
    '../docs/**/*.@(mdx|stories.@(js|ts|tsx))',
  ],
  addons: [
    {
      name: getAbsolutePath('@storybook/addon-docs'),
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm],
          },
        },
      },
    },
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-storysource'),
    getAbsolutePath('@storybook/addon-controls'),
    getAbsolutePath('@storybook/addon-links'),
    getAbsolutePath('@storybook/addon-viewport'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('storybook-dark-mode'),
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
    name: getAbsolutePath('@storybook/react-vite'),
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
    },
  },
};

export default config;
