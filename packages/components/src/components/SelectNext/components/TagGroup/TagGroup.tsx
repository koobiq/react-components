'use client';

import { logger } from '@koobiq/logger';
import type { SelectState } from '@koobiq/react-primitives';
import type { SelectionMode } from '@react-types/select';

import type { SelectPropSelectedTagsOverflow } from '../../types';

import { TagGroupMultiline } from './TagGroupMultiline';
import { TagGroupResponsive } from './TagGroupResponsive';

export type TagGroupProps<
  T extends object,
  M extends SelectionMode = 'single',
> = {
  state: SelectState<T, M>;
  states: {
    isInvalid?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
  };
  selectedTagsOverflow?: SelectPropSelectedTagsOverflow;
};

function assertNever(x: never) {
  logger.error(`Unhandled selectedTagsOverflow variant: ${x as string}`);

  return null;
}

export function TagGroup<T extends object, M extends SelectionMode = 'single'>({
  selectedTagsOverflow = 'responsive',
  ...rest
}: TagGroupProps<T, M>) {
  switch (selectedTagsOverflow) {
    case 'responsive':
      return <TagGroupResponsive {...rest} />;
    case 'multiline':
      return <TagGroupMultiline {...rest} />;
    default:
      return assertNever(selectedTagsOverflow as never);
  }
}
