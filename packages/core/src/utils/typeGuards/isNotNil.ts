export const isNotNil = <T>(p: T): p is Exclude<T, undefined | null> =>
  p !== undefined && p !== null;
