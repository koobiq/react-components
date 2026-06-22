import {
  clsx,
  useHideOverflowItems,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';

import { useFormFieldControlGroup } from '../FormField';

import intlMessages from './intl';
import s from './SelectedTags.module.css';
import { Tag } from './Tag';
import type { SelectedTagsProps } from './types';
import { getHiddenCount } from './utils';

export function SelectedTagsResponsive<T extends object>({
  state,
  states,
}: SelectedTagsProps<T>) {
  const { isDisabled, isInvalid } = states;
  const length = state?.selectedItems?.length || 0;

  const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems({
    length: length + 1,
    pinnedIndex: 0,
  });

  const hiddenCount = getHiddenCount(visibleMap);
  const t = useLocalizedStringFormatter(intlMessages);

  const { hasStartAddon } = useFormFieldControlGroup();

  return (
    <div
      className={clsx(s.container, hasStartAddon && s.hasStartAddon)}
      ref={parentRef}
      aria-hidden
    >
      <div
        className={s.base}
        data-limit-tags="responsive"
        aria-label={t.format('selected items')}
      >
        {state.selectedItems?.map((item, i) => (
          <Tag
            key={item.key}
            className={s.tag}
            ref={itemsRefs[i]}
            isDisabled={isDisabled}
            aria-hidden={!visibleMap[i] || undefined}
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
        className={s.more}
        ref={itemsRefs[itemsRefs.length - 1]}
        aria-hidden={!visibleMap[length] || undefined}
      >
        {t.format('more', { count: hiddenCount })}
      </div>
    </div>
  );
}
