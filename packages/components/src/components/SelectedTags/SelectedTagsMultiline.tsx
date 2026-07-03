import { Fragment } from 'react';

import { clsx, useLocalizedStringFormatter } from '@koobiq/react-core';

import { useFormFieldControlGroup } from '../FormField';
import { Tag, type TagProps } from '../Tag';

import intlMessages from './intl';
import s from './SelectedTags.module.css';
import type { SelectedTagsProps } from './types';

export function SelectedTagsMultiline<T extends object>({
  state,
  states,
  renderTag,
}: SelectedTagsProps<T>) {
  const { isDisabled, isInvalid, isReadOnly } = states;
  const t = useLocalizedStringFormatter(intlMessages);

  const { hasStartAddon } = useFormFieldControlGroup();

  return (
    <div
      className={clsx(s.container, hasStartAddon && s.hasStartAddon)}
      aria-hidden
    >
      <div
        className={s.base}
        data-limit-tags="multiline"
        aria-label={t.format('selected items')}
      >
        {state.selectedItems?.map((item) => {
          const onRemove = () => {
            if (state.selectionManager.isSelected(item.key)) {
              state.selectionManager.toggleSelection(item.key);
            }
          };

          const tagProps: TagProps = {
            className: s.tag,
            isDisabled,
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
    </div>
  );
}
