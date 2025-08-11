import type { FC } from 'react';

import { useLocalizedStringFormatter } from '@koobiq/react-core';
import type { MultiSelectState } from '@koobiq/react-primitives';

import intlMessages from '../../intl.json';
import { Tag } from '../Tag';

import s from './TagGroup.module.css';

export type TagGroupProps<T> = {
  state: MultiSelectState<T>;
  states: {
    isInvalid?: boolean;
    isDisabled?: boolean;
    isRequired?: boolean;
  };
};

export const TagGroup: FC<TagGroupProps<unknown>> = ({ state, states }) => {
  const { isDisabled, isInvalid } = states;

  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  return (
    <div
      aria-hidden
      className={s.base}
      aria-label={stringFormatter.format('selected items')}
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
  );
};
