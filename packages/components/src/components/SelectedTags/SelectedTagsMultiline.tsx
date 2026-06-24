import { clsx, useLocalizedStringFormatter } from '@koobiq/react-core';

import { useFormFieldControlGroup } from '../FormField';

import intlMessages from './intl';
import s from './SelectedTags.module.css';
import { Tag } from './Tag';
import type { SelectedTagsProps } from './types';

export function SelectedTagsMultiline<T extends object>({
  state,
  states,
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
        {state.selectedItems?.map((item) => (
          <Tag
            key={item.key}
            className={s.tag}
            isDisabled={isDisabled}
            isReadOnly={isReadOnly}
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
    </div>
  );
}
