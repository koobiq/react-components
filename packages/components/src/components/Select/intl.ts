export default {
  'ru-RU': {
    'empty items': 'Нет вариантов выбора',
    'load more': 'Загрузка',
    'selected items': 'Выбранные элементы',
    clear: 'Очистить',
    more: ({ count }: { count: number }) => `еще ${count}`,
  },
  'en-US': {
    'empty items': 'No options available',
    'selected items': 'Selected items',
    'load more': 'Load More…',
    clear: 'Clear',
    more: ({ count }: { count: number }) => `${count} more`,
  },
} as unknown as Record<string, Record<string, string>>;
