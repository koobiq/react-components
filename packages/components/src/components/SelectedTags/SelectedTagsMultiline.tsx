import { Fragment } from 'react';

import { clsx, useLocalizedStringFormatter } from '@koobiq/react-core';

import { useFormFieldControlGroup } from '../FormField';
import { Tag } from '../Tag';

import intlMessages from './intl';
import s from './SelectedTags.module.css';
import type { SelectedTagsProps } from './types';
import { getSelectedTagProps } from './utils';

export function SelectedTagsMultiline<T extends object>({
  state,
  states,
  renderTag,
}: SelectedTagsProps<T>) {
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
          const tagProps = getSelectedTagProps(item, state, states);

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
