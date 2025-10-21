'use client';

import type { FC } from 'react';

import { logger } from '@koobiq/logger';
import type { MultiSelectState } from '@koobiq/react-primitives';

import type { SelectPropSelectedTagsOverflow } from '../../types';

import { TagGroupMultiline } from './TagGroupMultiline';
import { TagGroupResponsive } from './TagGroupResponsive';

export type TagGroupProps<T> = {
  state: MultiSelectState<T>;
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

export const TagGroup: FC<TagGroupProps<unknown>> = ({
  selectedTagsOverflow = 'responsive',
  ...rest
}) => {
  switch (selectedTagsOverflow) {
    case 'responsive':
      return <TagGroupResponsive {...rest} />;
    case 'multiline':
      return <TagGroupMultiline {...rest} />;
    default:
      return assertNever(selectedTagsOverflow as never);
  }
};
