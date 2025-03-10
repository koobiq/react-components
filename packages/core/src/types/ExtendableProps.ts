import type { Merge } from './Merge';

export type ExtendableProps<
  OverrideProps = Record<string, unknown>,
  ExtendedProps = Record<string, unknown>,
> = Merge<ExtendedProps, OverrideProps>;
