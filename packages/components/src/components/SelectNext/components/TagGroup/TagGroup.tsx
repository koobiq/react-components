import type { FC } from 'react';

import {
  clsx,
  useHideOverflowItems,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';
import type { MultiSelectState } from '@koobiq/react-primitives';

import intlMessages from '../../intl';
import type { SelectPropLimitTags } from '../../types';
import { Tag } from '../Tag';

import s from './TagGroup.module.css';
import { getHiddenCount } from './utils';

export type TagGroupProps<T> = {
  state: MultiSelectState<T>;
  states: {
    isInvalid?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
  };
  limitTags?: SelectPropLimitTags;
};

export const TagGroup: FC<TagGroupProps<unknown>> = ({
  state,
  states,
  limitTags,
}) => {
  const { isDisabled, isInvalid } = states;

  const hasResponsiveTags = limitTags === 'responsive';

  const length = state?.selectedItems?.length || 0;

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems({
    length: length + 1,
    pinnedIndex: 0,
  });

  const hiddenCount = getHiddenCount(visibleMap);

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  return (
    <div
      className={s.container}
      {...(hasResponsiveTags && { ref: parentRef })}
      aria-hidden
    >
      <div
        className={s.base}
        data-limit-tags={limitTags}
        aria-label={stringFormatter.format('selected items')}
      >
        {state.selectedItems?.map((item, i) => (
          <Tag
            key={item.key}
            className={clsx(
              s.tag,
              hasResponsiveTags && !visibleMap[i] && s.hidden
            )}
            ref={itemsRefs[i]}
            isDisabled={isDisabled}
            variant={isInvalid ? 'error-fade' : 'contrast-fade'}
            onRemove={() => {
              if (state.selectionManager.isSelected(item.key)) {
                state.selectionManager.toggleSelection(item.key);
              }
            }}
          >
            {item.textValue}
          </Tag>
        ))}
      </div>
      {hasResponsiveTags && (
        <div
          ref={itemsRefs[itemsRefs.length - 1]}
          className={clsx(s.more, !visibleMap[length] && s.hidden)}
        >
          {stringFormatter.format('more', { count: hiddenCount })}
        </div>
      )}
    </div>
  );
};
