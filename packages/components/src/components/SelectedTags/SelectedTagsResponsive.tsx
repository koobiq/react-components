import { Fragment } from 'react';

import {
  clsx,
  useHideOverflowItems,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';

import { useFormFieldControlGroup } from '../FormField';
import { Tag } from '../Tag';

import intlMessages from './intl';
import s from './SelectedTags.module.css';
import type { SelectedTagsProps, SelectedTagsRenderTagProps } from './types';
import { getHiddenCount } from './utils';

export function SelectedTagsResponsive<T extends object>({
  state,
  states,
  renderTag,
}: SelectedTagsProps<T>) {
  const { isDisabled, isInvalid, isReadOnly } = states;
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
        {state.selectedItems?.map((item, i) => {
          const onRemove = () => {
            if (state.selectionManager.isSelected(item.key)) {
              state.selectionManager.toggleSelection(item.key);
            }
          };

          const tagProps: SelectedTagsRenderTagProps = {
            ref: itemsRefs[i],
            className: s.tag,
            isDisabled,
            'aria-hidden': !visibleMap[i] || undefined,
            variant: isInvalid ? 'error-fade' : 'contrast-fade',
            slotProps: !isReadOnly
              ? {
                  removeIcon: {
                    as: 'div',
                    isDisabled,
                    tabIndex: undefined,
                    onPress: onRemove,
                  },
                }
              : undefined,
          };

          return (
            <Fragment key={item.key}>
              {renderTag ? (
                renderTag(item, tagProps)
              ) : (
                <Tag {...tagProps}>{item.textValue}</Tag>
              )}
            </Fragment>
          );
        })}
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
