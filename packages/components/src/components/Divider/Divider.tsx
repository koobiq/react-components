'use client';

import type { ElementType, ForwardedRef } from 'react';

import { clsx } from '@koobiq/react-core';
import type { BaseCollection } from '@koobiq/react-primitives';
import {
  useSeparator,
  CollectionNode,
  createLeafComponent,
} from '@koobiq/react-primitives';

import s from './Divider.module.css';
import type { DividerProps } from './index';

export class DividerNode extends CollectionNode<any> {
  static readonly type = 'separator';

  filter(
    collection: BaseCollection<any>,
    newCollection: BaseCollection<any>
  ): CollectionNode<any> | null {
    const prevItem = newCollection.getItem(this.prevKey!);

    if (prevItem && prevItem.type !== 'separator') {
      const clone = this.clone();
      newCollection.addDescendants(clone, collection);

      return clone;
    }

    return null;
  }
}

export const Divider = createLeafComponent(
  DividerNode,
  function Separator(props: DividerProps, ref: ForwardedRef<HTMLElement>) {
    const {
      orientation = 'horizontal',
      as = 'div',
      disablePaddings,
      flexItem,
      display,
      className,
      ...other
    } = props;

    const { separatorProps } = useSeparator({
      ...other,
      orientation,
      elementType: `${as}`,
    });

    const hasPaddings = !disablePaddings;

    const Tag = as as ElementType;

    return (
      <Tag
        data-display={display}
        data-orientation={orientation}
        data-flex-item={flexItem || undefined}
        data-disable-paddings={disablePaddings || undefined}
        {...separatorProps}
        className={clsx(
          s.base,
          s[orientation],
          display && s[display],
          hasPaddings && s.hasPaddings,
          flexItem && s.flexItem,
          className
        )}
        ref={ref}
        {...other}
      />
    );
  }
);
