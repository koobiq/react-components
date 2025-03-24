'use client';

import type { ReactNode, FC } from 'react';

import type { SectionProps } from '@koobiq/react-primitives';
import { Section } from '@koobiq/react-primitives';

type SectionComponent<T> = FC<SectionProps<T>> & {
  getCollectionNode: unknown;
};

const SectionInner = Section as SectionComponent<unknown>;

export type ListSectionProps<T> = {
  /** Rendered contents of the section, e.g. a header. */
  title?: ReactNode;
  /** An accessibility label for the section. */
  'aria-label'?: string;
  /** Static child items or a function to render children. */
  children: SectionProps<T>['children'];
  /** Item objects in the section. */
  items?: SectionProps<T>['items'];
};

export function ListSection<T>(props: ListSectionProps<T>) {
  return <Section {...props} />;
}

ListSection.getCollectionNode = SectionInner.getCollectionNode;
