export function monthIndex(d: { year: number; month: number }) {
  return d.year * 12 + d.month; // month: 1..12
}
