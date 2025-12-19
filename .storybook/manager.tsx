import '@koobiq/react-components/style.css';
import '@koobiq/design-tokens/web/css-tokens.css';
import '@koobiq/design-tokens/web/css-tokens-light.css';
import '@koobiq/design-tokens/web/css-tokens-dark.css';

import React from 'react';

import { addons } from 'storybook/manager-api';

(globalThis as any).React = React;

type BadgeConfig = {
  label: string;
  style?: React.CSSProperties;
};

const badges = {
  'status:updated': {
    label: 'Updated',
    style: {
      color: 'var(--kbq-foreground-success)',
      borderColor: 'var(--kbq-line-success-fade)',
    },
  },
  'status:new': {
    label: 'New',
    style: {
      color: 'var(--kbq-foreground-theme)',
      borderColor: 'var(--kbq-line-theme-fade)',
    },
  },
  'status:deprecated': {
    label: 'Deprecated',
    style: {
      color: 'var(--kbq-foreground-error)',
      borderColor: 'var(--kbq-line-error-fade)',
    },
  },
} satisfies Record<string, BadgeConfig>;

addons.setConfig({
  sidebar: {
    filters: {
      patterns: (item) => !item.tags?.includes('hidden'),
    },
    renderLabel: (item) => {
      if (item.type !== 'component') {
        return item.name;
      }

      let badge: BadgeConfig | undefined;

      for (const tag of item.tags) {
        badge = badges[tag];

        if (badge) {
          break;
        }
      }

      if (!badge) {
        return item.name;
      }

      return (
        <div
          style={{
            flex: 1,
            gap: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>{item.name}</span>
          <span
            style={{
              ...badge.style,
              blockSize: 16,
              fontSize: '12px',
              lineHeight: '1',
              textAlign: 'center',
              borderStyle: 'solid',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              boxSizing: 'border-box',
              justifyContent: 'center',
              paddingInline: 'var(--kbq-size-xxs)',
              borderRadius: 'var(--kbq-size-xxs)',
              borderWidth: 'var(--kbq-size-border-width)',
            }}
          >
            {badge.label}
          </span>
        </div>
      );
    },
  },
});
