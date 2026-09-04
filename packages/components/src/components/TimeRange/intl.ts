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
 * The Russian adjective "последний" must agree in gender with the unit noun
 * it modifies, so a single fixed prefix can't cover the singular ("last
 * minute") forms — only the plural ("last N minutes") forms share one prefix.
 */
const ruSingularPrefix: Record<string, string> = {
  minutes: 'Последняя',
  hours: 'Последний',
  days: 'Последний',
  weeks: 'Последняя',
  months: 'Последний',
  years: 'Последний',
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
  getPrefix: (count: number, unit: string) => string
): string {
  const forms = units[unit];
  const category = new Intl.PluralRules(pluralLocale).select(count);
  const label = forms?.[category] ?? forms?.other ?? unit;
  const prefix = getPrefix(count, unit);

  return count === 1 ? `${prefix} ${label}` : `${prefix} ${count} ${label}`;
}

export default {
  'en-US': {
    apply: 'Apply',
    cancel: 'Cancel',
    from: 'from',
    to: 'to',
    fromTimeLabel: 'from time',
    fromDateLabel: 'from date',
    toTimeLabel: 'to time',
    toDateLabel: 'to date',
    placeholder: 'Select period',
    presets: 'Period',
    allTime: 'All time',
    currentQuarter: 'Current quarter',
    currentYear: 'Current year',
    range: 'Period',
    duration: (args: DurationArgs) =>
      formatDuration(args, 'en-US', enUnits, () => 'Last'),
  },
  'ru-RU': {
    apply: 'Применить',
    cancel: 'Отмена',
    from: 'с',
    to: 'по',
    fromTimeLabel: 'время начала',
    fromDateLabel: 'дата начала',
    toTimeLabel: 'время окончания',
    toDateLabel: 'дата окончания',
    placeholder: 'Выберите период',
    presets: 'Период',
    allTime: 'Все время',
    currentQuarter: 'Текущий квартал',
    currentYear: 'Текущий год',
    range: 'Период',
    duration: (args: DurationArgs) =>
      formatDuration(args, 'ru-RU', ruUnits, (count, unit) =>
        count === 1 ? (ruSingularPrefix[unit] ?? 'Последний') : 'Последние'
      ),
  },
} as unknown as Record<string, Record<string, string>>;
