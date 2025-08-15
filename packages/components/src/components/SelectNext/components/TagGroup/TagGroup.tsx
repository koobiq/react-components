import type { FC } from 'react';

import { logger } from '@koobiq/logger';
import type { MultiSelectState } from '@koobiq/react-primitives';

import type { SelectPropLimitTags } from '../../types';

import { TagGroupMultiline } from './TagGroupMultiline';
import { TagGroupResponsive } from './TagGroupResponsive';

export type TagGroupProps<T> = {
  state: MultiSelectState<T>;
  states: {
    isInvalid?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
  };
  limitTags?: SelectPropLimitTags;
};

function assertNever(x: never) {
  logger.error(`Unhandled limitTags variant: ${x as string}`);

  return null;
}

export const TagGroup: FC<TagGroupProps<unknown>> = ({
  limitTags = 'responsive',
  ...rest
}) => {
  switch (limitTags) {
    case 'responsive':
      return <TagGroupResponsive {...rest} />;
    case 'multiline':
      return <TagGroupMultiline {...rest} />;
    default:
      return assertNever(limitTags as never);
  }
};
