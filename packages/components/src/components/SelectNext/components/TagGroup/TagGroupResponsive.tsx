import type { FC } from 'react';

import {
  clsx,
  useHideOverflowItems,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';

import intlMessages from '../../intl';
import { Tag } from '../Tag';

import type { TagGroupProps } from './TagGroup';
import s from './TagGroup.module.css';
import { getHiddenCount } from './utils';

export const TagGroupResponsive: FC<TagGroupProps<unknown>> = ({
  state,
  states,
}) => {
  const { isDisabled, isInvalid } = states;
  const length = state?.selectedItems?.length || 0;

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems({
    length: length + 1,
    pinnedIndex: 0,
  });

  const hiddenCount = getHiddenCount(visibleMap);
  const t = useLocalizedStringFormatter(intlMessages);

  return (
    <div className={s.container} ref={parentRef} aria-hidden>
      <div
        className={s.base}
        data-limit-tags="responsive"
        aria-label={t.format('selected items')}
      >
        {state.selectedItems?.map((item, i) => (
          <Tag
            key={item.key}
            ref={itemsRefs[i]}
            className={clsx(s.tag, !visibleMap[i] && s.hidden)}
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
      <div
        ref={itemsRefs[itemsRefs.length - 1]}
        className={clsx(s.more, !visibleMap[length] && s.hidden)}
      >
        {t.format('more', { count: hiddenCount })}
      </div>
    </div>
  );
};
