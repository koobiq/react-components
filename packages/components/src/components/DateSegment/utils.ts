type TimeType = 'hour' | 'minute' | 'second';

export function isTime(t: string): t is TimeType {
  return t === 'hour' || t === 'minute' || t === 'second';
}
