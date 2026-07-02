import { Fragment } from 'react';

import { clsx, useLocalizedStringFormatter } from '@koobiq/react-core';

import { useFormFieldControlGroup } from '../FormField';

import intlMessages from './intl';
import { SelectedTag } from './SelectedTag';
import s from './SelectedTags.module.css';
import type { SelectedTagsProps, SelectedTagsRenderTagProps } from './types';

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
          const tagProps: SelectedTagsRenderTagProps = {
            className: s.tag,
            isDisabled,
            isReadOnly,
            variant: isInvalid ? 'error-fade' : 'contrast-fade',
            onRemove: () => {
              if (state.selectionManager.isSelected(item.key)) {
                state.selectionManager.toggleSelection(item.key);
              }
            },
          };

          return (
            <Fragment key={item.key}>
              {renderTag ? (
                renderTag(item, tagProps)
              ) : (
                <SelectedTag {...tagProps}>{item.textValue}</SelectedTag>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
