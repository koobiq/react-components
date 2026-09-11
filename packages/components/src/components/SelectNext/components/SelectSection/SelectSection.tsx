'use client';

import type { ForwardedRef, ReactElement } from 'react';
import { useContext } from 'react';

import type {
  Key,
  Node,
  SectionProps,
  ExtendableComponentPropsWithRef,
} from '@koobiq/react-core';
import { filterDOMProps, mergeProps } from '@koobiq/react-core';
import {
  useListBoxSection,
  createBranchComponent,
  Collection,
  SectionNode,
} from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';
import { Typography } from '../../../Typography';
import { SelectContext } from '../../SelectContext';
import { CollectionBranch } from '../../utils';

const { listHeading } = utilClasses;

export type SelectSectionProps<T> = ExtendableComponentPropsWithRef<
  SectionProps<T> & {
    /** The unique id of the item. */
    id?: Key;
    /**
     * Values the section's items depend on, in addition to the `dependencies`
     * of the Select. Takes effect for a section written out in JSX; for
     * sections rendered from the Select's `items`, list the values on the Select.
     */
    dependencies?: ReadonlyArray<unknown>;
  },
  'section'
>;

export type SelectSectionComponent = <T extends object>(
  props: SelectSectionProps<T>
) => ReactElement | null;

function SelectSectionInner<T extends object>(
  props: SelectSectionProps<T>,
  ref: ForwardedRef<HTMLElement>,
  section: Node<T>
) {
  const state = useContext(SelectContext)!;
  const { className, style } = props;

  const { headingProps, groupProps } = useListBoxSection({
    heading: section.rendered,
    'aria-label': props['aria-label'] ?? undefined,
  });

  const DOMProps = filterDOMProps(props as any, { global: true });
  delete DOMProps.id;

  return (
    <section
      {...mergeProps(DOMProps, groupProps)}
      className={className}
      style={style}
      ref={ref}
    >
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

const SelectSectionRoot = createBranchComponent(
  SectionNode,
  SelectSectionInner,
  // Render the children through `Collection` rather than the built-in
  // `useCollectionChildren`, so the section inherits `dependencies` from the
  // Select it is rendered in and adds its own on top.
  ({ items, children, dependencies }) => (
    <Collection items={items} dependencies={dependencies}>
      {children}
    </Collection>
  )
);

// The type is spelled out: the inferred one leaks an unresolved type parameter
// into the declaration output, which API Extractor cannot follow.
export const SelectSection = SelectSectionRoot as SelectSectionComponent;
