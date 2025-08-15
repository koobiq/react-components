import type { FC } from 'react';

import { useLocalizedStringFormatter } from '@koobiq/react-core';

import intlMessages from '../../intl';
import { Tag } from '../Tag';

import type { TagGroupProps } from './TagGroup';
import s from './TagGroup.module.css';

export const TagGroupMultiline: FC<TagGroupProps<unknown>> = ({
  state,
  states,
}) => {
  const { isDisabled, isInvalid } = states;
  const t = useLocalizedStringFormatter(intlMessages);

  return (
    <div className={s.container} aria-hidden>
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
};
