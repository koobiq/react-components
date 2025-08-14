export default {
  'ru-RU': {
    'selected items': 'Выбранные элементы',
    clear: 'Очистить',
    more: ({ count }: { count: number }) => `ещё ${count}`,
  },
  'en-US': {
    'selected items': 'Selected items',
    clear: 'Clear',
    more: ({ count }: { count: number }) => `${count} more`,
  },
} as unknown as Record<string, Record<string, string>>;
