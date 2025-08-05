export const isDefined = <T>(p: T): p is Exclude<T, undefined> =>
  p !== undefined;
