'use client';

import type { CSSProperties, Ref } from 'react';
import { forwardRef, useContext } from 'react';

import type { Collection as AriaCollection, Node } from '@koobiq/react-core';
import { clsx } from '@koobiq/react-core';
import {
  Collection,
  CollectionBuilder,
  CollectionRendererContext,
} from '@koobiq/react-primitives';

import { getResponsiveValue } from '../../utils';
import { useMatchedBreakpoints } from '../Provider';

import {
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from './components';
import s from './DescriptionList.module.css';
import type { DescriptionListComponent, DescriptionListProps } from './types';

type DescriptionListInnerProps<T extends object> = Omit<
  DescriptionListProps<T>,
  'ref' | 'items' | 'children' | 'dependencies'
> & {
  listRef?: Ref<HTMLDListElement>;
  collection: AriaCollection<Node<T>>;
};

function DescriptionListInner<T extends object>(
  props: DescriptionListInnerProps<T>
) {
  const {
    listRef,
    collection,
    orientation: orientationProp = 'horizontal',
    columns,
    alignItems = 'start',
    justifyItems = 'start',
    className,
    style: styleProp,
    ...other
  } = props;

  const { CollectionRoot } = useContext(CollectionRendererContext);
  const breakpoints = useMatchedBreakpoints();

  const orientation =
    getResponsiveValue(orientationProp, breakpoints) ?? 'horizontal';

  const style = {
    ...styleProp,
    ...(columns !== undefined && { '--description-list-columns': columns }),
  } as CSSProperties;

  return (
    <dl
      {...other}
      ref={listRef}
      style={style}
      className={clsx(
        s.base,
        orientation === 'vertical' && s.vertical,
        alignItems === 'center' && s.alignCenter,
        alignItems === 'end' && s.alignEnd,
        justifyItems === 'center' && s.justifyCenter,
        justifyItems === 'end' && s.justifyEnd,
        className
      )}
      data-orientation={orientation}
      data-align-items={alignItems}
      data-justify-items={justifyItems}
    >
      <CollectionRoot collection={collection} />
    </dl>
  );
}

function DescriptionListRender<T extends object = object>(
  props: Omit<DescriptionListProps<T>, 'ref'>,
  ref?: Ref<HTMLDListElement>
) {
  const { items, children, dependencies, ...other } = props;

  return (
    <CollectionBuilder
      content={
        <Collection items={items} dependencies={dependencies}>
          {children}
        </Collection>
      }
    >
      {(collection) => (
        <DescriptionListInner
          {...other}
          listRef={ref}
          collection={collection}
        />
      )}
    </CollectionBuilder>
  );
}

const DescriptionListRoot = forwardRef(DescriptionListRender);

DescriptionListRoot.displayName = 'DescriptionList';

/**
 * DescriptionList displays term-description pairs,
 * e.g. the properties of an incident or an object.
 */
export const DescriptionList = Object.assign(
  DescriptionListRoot as DescriptionListComponent,
  {
    Group: DescriptionListGroup,
    Term: DescriptionListTerm,
    Description: DescriptionListDescription,
  }
);
