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

const badgeByTag = {
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
} as const satisfies Record<string, BadgeConfig>;

type BadgeTag = keyof typeof badgeByTag;

const ttlDaysByStatus: Partial<Record<BadgeTag, number>> = {
  'status:new': 30,
  'status:updated': 30,
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parseFromTag(tags: readonly string[] | undefined): Date | undefined {
  if (!tags) {
    return undefined;
  }

  const fromTag = tags.find((tag) => tag.startsWith('date:'));

  if (!fromTag) {
    return undefined;
  }

  const isoDate = fromTag.slice('date:'.length).trim();
  const parsed = new Date(isoDate);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
}

function isStatusBadgeExpired(
  tags: readonly string[] | undefined,
  statusTag: BadgeTag
): boolean {
  const ttlDays = ttlDaysByStatus[statusTag];
  if (!ttlDays) return false;

  const fromDate = parseFromTag(tags);
  if (!fromDate) return false;

  const expiresAt = fromDate.getTime() + ttlDays * MS_PER_DAY;

  return Date.now() > expiresAt;
}

function findStatusBadge(tags: readonly string[]): {
  statusTag: BadgeTag;
  badge: BadgeConfig;
} | null {
  for (const tag of tags) {
    if (tag in badgeByTag) {
      const statusTag = tag as BadgeTag;

      return { statusTag, badge: badgeByTag[statusTag] };
    }
  }

  return null;
}

addons.setConfig({
  sidebar: {
    filters: {
      patterns: (item) => !item.tags?.includes('hidden'),
    },
    renderLabel: (item) => {
      if (item.type !== 'component') return item.name;

      const statusBadge = findStatusBadge(item.tags);

      if (!statusBadge) return item.name;

      if (isStatusBadgeExpired(item.tags, statusBadge.statusTag)) {
        return item.name;
      }

      const { badge } = statusBadge;

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
