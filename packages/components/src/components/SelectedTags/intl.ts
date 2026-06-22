export default {
  'ru-RU': {
    'selected items': 'Выбранные элементы',
    more: ({ count }: { count: number }) => `+${count}`,
  },
  'en-US': {
    'selected items': 'Selected items',
    more: ({ count }: { count: number }) => `+${count}`,
  },
} as unknown as Record<string, Record<string, string>>;
