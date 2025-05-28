import { forwardRef, type Ref } from 'react';

import { useDOMRef, mergeProps, clsx } from '@koobiq/react-core';
import { useTagGroup, useListState } from '@koobiq/react-primitives';

import { TagInner } from './components';
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
  const { variant = 'theme-fade', style, className, slotProps } = props;
  const domRef = useDOMRef(ref);

  const state = useListState(props);

  const { gridProps } = useTagGroup(props, state, domRef);

  const rootProps = mergeProps(
    { className: clsx(s.base, className), style, ref: domRef },
    gridProps,
    slotProps?.root
  );

  return (
    <div {...rootProps}>
      {[...state.collection].map((item) => (
        <TagInner key={item.key} item={item} variant={variant} state={state} />
      ))}
    </div>
  );
}

export const TagGroup = forwardRef(TagGroupRender) as TagGroupComponentProp;
