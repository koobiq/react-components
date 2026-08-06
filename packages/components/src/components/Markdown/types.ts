import type { ComponentPropsWithoutRef } from 'react';

import type { MarkedOptions } from 'marked';

export interface MarkdownProps extends Omit<
  ComponentPropsWithoutRef<'div'>,
  'children'
> {
  /** Markdown text to convert into HTML. */
  children: string;

  /** Options passed through to the underlying `marked` parser. */
  markedOptions?: MarkedOptions;
}
