import type { Breakpoints } from '../../components';

export type ResponsiveValue<T> = Partial<Record<keyof Breakpoints, T>>;

function isRecordResponsiveValue<T>(
  value: ResponsiveValue<T>
): value is ResponsiveValue<T> {
  return typeof value === 'object' && value !== null;
}

export function getResponsiveValue<T>(
  prop: ResponsiveValue<T> | T,
  breakpoints: string[]
): T | undefined {
  if (typeof prop !== 'object' || prop === null) return prop;

  let returned: T | undefined;

  if (isRecordResponsiveValue(prop)) {
    for (const breakpoint of breakpoints) {
      if (Object.hasOwn(prop, breakpoint)) {
        returned = prop[breakpoint];
      }
    }
  }

  return returned;
}
