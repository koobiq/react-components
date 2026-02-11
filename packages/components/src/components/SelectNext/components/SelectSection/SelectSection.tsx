'use client';

import type { ForwardedRef } from 'react';
import { useContext } from 'react';

import type { Key, Node, SectionProps } from '@koobiq/react-core';
import { filterDOMProps, mergeProps } from '@koobiq/react-core';
import {
  useListBoxSection,
  createBranchComponent,
  SectionNode,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Typography } from '../../../Typography';
import { SelectContext } from '../../SelectContext';
import { CollectionBranch } from '../../utils';

const { listHeading } = utilClasses;

export type ListSectionProps<T> = SectionProps<T> & {
  /** The unique id of the item. */
  id?: Key;
};

function SelectSectionInner<T extends object>(
  props: ListSectionProps<T>,
  ref: ForwardedRef<HTMLElement>,
  section: Node<T>,
  // TODO: work out with it
  className: string = ''
) {
  console.warn(className);

  const state = useContext(SelectContext)!;

  const { headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    'aria-label': props['aria-label'] ?? undefined,
  });

  const DOMProps = filterDOMProps(props as any, { global: true });
  delete DOMProps.id;

  return (
    <section {...mergeProps(DOMProps, groupProps)} ref={ref}>
      <Typography
        as="span"
        display="block"
        variant="caps-compact-strong"
        color="contrast-secondary"
        className={listHeading}
        {...headingProps}
      >
        {props.title}
      </Typography>
      <CollectionBranch collection={state.collection} parent={section} />
    </section>
  );
}

export const SelectSection = createBranchComponent(
  SectionNode,
  SelectSectionInner
);
