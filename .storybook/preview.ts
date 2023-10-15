import type { Preview } from '@storybook/react';
import '@koobiq/react-components/global.css';
import '@koobiq/design-tokens/web/css-tokens.css';
import '@koobiq/design-tokens/web/css-tokens-light.css';
import '@koobiq/design-tokens/web/css-tokens-dark.css';

import { DocContainer } from './components';
import { withThemeProvider } from './decorators';
import { light, dark } from './themes';

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: {
        xs: {
          name: 'xs',
          styles: { width: '320px', height: '568px' },
        },
        s: {
          name: 's',
          styles: { width: '480px', height: '896px' },
        },
        m: {
          name: 'm',
          styles: { width: '768px', height: '960px' },
        },
        l: {
          name: 'l',
          styles: { width: '1024px', height: '1000px' },
        },
        xl: {
          name: 'xl',
          styles: { width: '1280px', height: '1000px' },
        },
        xxl: {
          name: 'xxl',
          styles: { width: '1536px', height: '1000px' },
        },
      },
    },
    darkMode: {
      darkClass: 'kbq-dark',
      lightClass: 'kbq-light',
      classTarget: 'body',
      stylePreview: true,
      light,
      dark,
    },
    options: {
      storySort: {
        order: ['Welcome', 'Icons', 'Components'],
        includeName: true,
      },
    },
    backgrounds: { disable: true },
    controls: { expanded: true },
    docs: {
      container: DocContainer,
      autodoc: true,
      toc: {
        title: 'On this page',
        headingSelector: 'h2, h3',
        ignoreSelector:
          '.sbdocs-preview h2, .sbdocs-preview h3, .changelog-page h3',
      },
    },
  },
  decorators: [withThemeProvider],
};

export default preview;