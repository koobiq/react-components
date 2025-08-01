import '@koobiq/react-components/style.css';
import '@koobiq/design-tokens/web/css-tokens.css';
import '@koobiq/design-tokens/web/css-tokens-light.css';
import '@koobiq/design-tokens/web/css-tokens-dark.css';

import React from 'react';

import { Badge, type BadgePropVariant } from '@koobiq/react-components';
import { addons } from 'storybook/manager-api';

(globalThis as any).React = React;

type BadgeConfig = {
  variant: BadgePropVariant;
  label: string;
};

const badges = {
  'status:updated': {
    label: 'Updated',
    variant: 'outline-fade-theme',
  },
  'status:new': {
    label: 'New',
    variant: 'outline-fade-success',
  },
  'status:deprecated': {
    label: 'Deprecated',
    variant: 'outline-fade-error',
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
          <Badge size="compact" variant={badge.variant}>
            {badge.label}
          </Badge>
        </div>
      );
    },
  },
});
