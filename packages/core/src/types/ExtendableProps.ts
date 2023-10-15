export type ExtendableProps<
  OverrideProps = Record<string, unknown>,
  ExtendedProps = Record<string, unknown>,
> = OverrideProps & Omit<ExtendedProps, keyof OverrideProps>;
