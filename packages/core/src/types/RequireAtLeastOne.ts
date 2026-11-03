/**
 * Makes `T` require at least one of the listed `Keys`, leaving the rest of
 * the properties unchanged.
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Omit<
  T,
  Keys
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];
