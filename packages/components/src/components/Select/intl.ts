export default {
  'ru-RU': {
    'empty items': 'Нет вариантов выбора',
    loading: 'Загрузка…',
    'selected items': 'Выбранные элементы',
    more: ({ count }: { count: number }) => `+${count}`,
  },
  'en-US': {
    'empty items': 'No options available',
    'selected items': 'Selected items',
    loading: 'Loading…',
    more: ({ count }: { count: number }) => `+${count}`,
  },
} as unknown as Record<string, Record<string, string>>;
