type DurationArgs = { count: number; unit: string };

const enUnits: Record<string, { one: string; other: string }> = {
  minutes: { one: 'minute', other: 'minutes' },
  hours: { one: 'hour', other: 'hours' },
  days: { one: 'day', other: 'days' },
  weeks: { one: 'week', other: 'weeks' },
  months: { one: 'month', other: 'months' },
  years: { one: 'year', other: 'years' },
};

const ruUnits: Record<
  string,
  { one: string; few: string; many: string; other: string }
> = {
  minutes: { one: 'минута', few: 'минуты', many: 'минут', other: 'минуты' },
  hours: { one: 'час', few: 'часа', many: 'часов', other: 'часа' },
  days: { one: 'день', few: 'дня', many: 'дней', other: 'дня' },
  weeks: { one: 'неделя', few: 'недели', many: 'недель', other: 'недели' },
  months: { one: 'месяц', few: 'месяца', many: 'месяцев', other: 'месяца' },
  years: { one: 'год', few: 'года', many: 'лет', other: 'года' },
};

/**
 * The plural units table is keyed per-locale already (`enUnits`/`ruUnits`), so
 * the plural category is resolved against that same fixed locale rather than
 * the formatter's runtime locale, which isn't exposed by `LocalizedStringFormatter`.
 */
function formatDuration(
  { count, unit }: DurationArgs,
  pluralLocale: string,
  units: Record<string, Record<string, string>>,
  prefix: string
): string {
  const forms = units[unit];
  const category = new Intl.PluralRules(pluralLocale).select(count);
  const label = forms?.[category] ?? forms?.other ?? unit;

  return count === 1 ? `${prefix} ${label}` : `${prefix} ${count} ${label}`;
}

export default {
  'en-US': {
    apply: 'Apply',
    cancel: 'Cancel',
    from: 'from',
    to: 'to',
    placeholder: 'Select period',
    presets: 'Period',
    allTime: 'All time',
    currentQuarter: 'Current quarter',
    currentYear: 'Current year',
    range: 'Custom range',
    duration: (args: DurationArgs) =>
      formatDuration(args, 'en-US', enUnits, 'Last'),
  },
  'ru-RU': {
    apply: 'Применить',
    cancel: 'Отмена',
    from: 'С',
    to: 'По',
    placeholder: 'Выберите период',
    presets: 'Период',
    allTime: 'Всё время',
    currentQuarter: 'Текущий квартал',
    currentYear: 'Текущий год',
    range: 'Свой диапазон',
    duration: (args: DurationArgs) =>
      formatDuration(args, 'ru-RU', ruUnits, 'Последние'),
  },
} as unknown as Record<string, Record<string, string>>;
