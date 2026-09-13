'use client';

import type { ForwardedRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { CollectionNode, createLeafComponent } from '@koobiq/react-primitives';

import type { DescriptionListGroupProps } from '../../types';

import s from './DescriptionListGroup.module.css';

class DescriptionListGroupNode extends CollectionNode<unknown> {
  static readonly type = 'item';
}

/** DescriptionList.Group — wraps a term and its description. */
export const DescriptionListGroup = createLeafComponent(
  DescriptionListGroupNode,
  function DescriptionListGroup(
    props: DescriptionListGroupProps,
    ref: ForwardedRef<HTMLDivElement>
  ) {
    const { className, children, ...other } = props;

    // `id` is the key of the group in the collection, not a DOM id.
    return (
      <div
        {...other}
        id={undefined}
        ref={ref}
        className={clsx(s.base, className)}
        data-slot="group"
      >
        {children}
      </div>
    );
  }
);
