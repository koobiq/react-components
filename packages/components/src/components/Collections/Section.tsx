'use client';

import type { ReactNode, FC } from 'react';

import type { SectionProps as AriaSectionProps } from '@koobiq/react-core';
import { Section as AriaSection } from '@koobiq/react-primitives';

type SectionComponent<T> = FC<AriaSectionProps<T>> & {
  getCollectionNode: unknown;
};

const SectionInner = AriaSection as SectionComponent<unknown>;

export type SectionProps<T> = {
  /** Rendered contents of the section, e.g. a header. */
  title?: ReactNode;
  /** An accessibility label for the section. */
  'aria-label'?: string;
  /** Static child items or a function to render children. */
  children: AriaSectionProps<T>['children'];
  /** Item objects in the section. */
  items?: AriaSectionProps<T>['items'];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Section<T>(_props: SectionProps<T>) {
  return null;
}

Section.getCollectionNode = SectionInner.getCollectionNode;
