'use client';

import { logger } from '@koobiq/logger';

import { SelectedTagsMultiline } from './SelectedTagsMultiline';
import { SelectedTagsResponsive } from './SelectedTagsResponsive';
import type { SelectedTagsProps } from './types';

function assertNever(x: never) {
  logger.error(`Unhandled selectedTagsOverflow variant: ${x as string}`);

  return null;
}

export function SelectedTags<T extends object>({
  selectedTagsOverflow = 'responsive',
  ...rest
}: SelectedTagsProps<T>) {
  switch (selectedTagsOverflow) {
    case 'responsive':
      return <SelectedTagsResponsive {...rest} />;
    case 'multiline':
      return <SelectedTagsMultiline {...rest} />;
    default:
      return assertNever(selectedTagsOverflow as never);
  }
}
