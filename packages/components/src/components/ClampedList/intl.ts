export default {
  'ru-RU': {
    collapse: 'Свернуть',
    'show more': ({ count }: { count: number }) => `Показать ещё ${count}`,
  },
  'en-US': {
    collapse: 'Collapse',
    'show more': ({ count }: { count: number }) => `Show ${count} more`,
  },
} as unknown as Record<string, Record<string, string>>;
