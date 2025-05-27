import { forwardRef, type Ref } from 'react';

import { useDOMRef } from '@koobiq/react-core';
import { useTagGroup, useListState } from '@koobiq/react-primitives';

import { Tag } from './components';
import s from './TagGroup.module.css';
import type {
  TagGroupComponentProp,
  TagGroupProps,
  TagGroupRef,
} from './types';

function TagGroupRender<T extends object>(
  props: Omit<TagGroupProps<T>, 'ref'>,
  ref: Ref<TagGroupRef>
) {
  const { variant = 'theme-fade' } = props;
  const domRef = useDOMRef(ref);

  const state = useListState(props);

  const { gridProps } = useTagGroup(props, state, domRef);

  return (
    <div className={s.base} {...gridProps} ref={domRef}>
      {[...state.collection].map((item) => (
        <Tag key={item.key} item={item} variant={variant} state={state} />
      ))}
    </div>
  );
}

export const TagGroup = forwardRef(TagGroupRender) as TagGroupComponentProp;
