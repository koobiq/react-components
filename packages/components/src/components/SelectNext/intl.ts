export default {
  'ru-RU': {
    'empty items': 'Нет вариантов выбора',
    loading: 'Загрузка…',
    'selected items': 'Выбранные элементы',
    search: 'Поиск',
    more: ({ count }: { count: number }) => `+${count}`,
  },
  'en-US': {
    'empty items': 'No options available',
    'selected items': 'Selected items',
    loading: 'Loading…',
    search: 'Search',
    more: ({ count }: { count: number }) => `+${count}`,
  },
} as unknown as Record<string, Record<string, string>>;
