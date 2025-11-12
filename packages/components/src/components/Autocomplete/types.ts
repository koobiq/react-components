import type { ReactElement } from 'react';

export type AutocompleteProps<T> = any | T;

export type AutocompleteComponent = <T>(
  props: AutocompleteProps<T>
) => ReactElement | null;
