import type { ComponentPropsWithoutRef } from 'react';

export interface MarkdownProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'dangerouslySetInnerHTML'
> {
  /** Markdown text to convert into HTML. */
  children: string;
}
