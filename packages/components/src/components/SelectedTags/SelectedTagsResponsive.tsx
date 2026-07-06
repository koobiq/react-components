import { Fragment } from 'react';

import {
  clsx,
  useHideOverflowItems,
  useLocalizedStringFormatter,
} from '@koobiq/react-core';

import { useFormFieldControlGroup } from '../FormField';
import { Tag, type TagProps } from '../Tag';

import intlMessages from './intl';
import s from './SelectedTags.module.css';
import type { SelectedTagsProps } from './types';
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

          const tagProps: TagProps = {
            ref: itemsRefs[i],
            className: s.tag,
            'aria-hidden': !visibleMap[i] || undefined,
            allowsRemoving: true,
            isDisabled,
            variant: isInvalid ? 'error-fade' : 'contrast-fade',
            slotProps: {
              removeIcon: {
                as: 'div',
                tabIndex: undefined,
                onPress: onRemove,
                isDisabled: isReadOnly || isDisabled,
              },
            },
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
