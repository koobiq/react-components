import type { Preview } from '@storybook/react';
import '@koobiq/react-components/global.css';
import '@koobiq/design-tokens/web/new/css-tokens.css';
import '@koobiq/design-tokens/web/new/css-tokens-light.css';
import '@koobiq/design-tokens/web/new/css-tokens-dark.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/400-italic.css';
import '@fontsource/inter/500-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';

import { DocContainer } from './components';
import { StoryThemeProvider } from './decorators';
import { light, dark } from './themes';

// The dark mode addon sets the theme class from the manager, which a story opened in isolation
// (iframe.html, "Open canvas in new tab") does not have.
if (!document.body.classList.contains('kbq-dark')) {
  document.body.classList.add('kbq-light');
}

const rawStories = import.meta.glob(
  [
    '../**/*.stories.js',
    '../**/*.stories.jsx',
    '../**/*.stories.ts',
    '../**/*.stories.tsx',
  ],
  {
    eager: true,
    import: 'default',
    query: '?raw',
  }
);

export function extractStory(raw: string, storyName: string) {
  const re = new RegExp(
    `export\\s+const\\s+${storyName}\\b[\\s\\S]*?^\\};`,
    'm'
  );

  const match = raw.match(re);

  return match?.[0] ?? '';
}

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'Internationalization locale',
      toolbar: {
        title: 'Interface language',
        icon: 'globe',
        items: [
          { value: '', title: 'System' },
          { value: 'en-US', title: 'English' },
          { value: 'ru-RU', title: 'Русский' },
        ],
      },
    },
  },
  initialGlobals: {
    locale: 'en-US',
  },
  parameters: {
    viewport: {
      options: {
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
        order: ['Welcome', 'Icons', 'AI', 'Components'],
        includeName: true,
      },
    },
    backgrounds: { disable: true },
    controls: { expanded: true },
    docs: {
      container: DocContainer,
      autodoc: true,
      source: {
        language: 'tsx',
        type: 'dynamic',
        transform: (code, context) => {
          const file = context.parameters.fileName;
          if (!file) return code;

          // make "packages/…" relative key
          const rel = file.slice(file.indexOf('/packages/') + 1);

          // pull the raw text out
          const key = Object.keys(rawStories).find((k) => k.endsWith(rel));
          if (!key) return code;

          const raw = rawStories[key] as string;

          // compute exportName from context.id …
          const storyId = context.id.split('--').pop()!;

          const exportName = storyId
            .split('-')
            .map((w) => w[0].toUpperCase() + w.slice(1))
            .join('');

          return extractStory(raw, exportName) || code;
        },
      },
      toc: {
        title: 'On this page',
        headingSelector: 'h2, h3',
        ignoreSelector:
          '.sbdocs-preview h2, .sbdocs-preview h3, .changelog-page h3',
      },
    },
  },
  decorators: [StoryThemeProvider],
};

export default preview;
