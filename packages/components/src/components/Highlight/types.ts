export const highlightPropVariant = ['background', 'bold'] as const;

export type HighlightPropVariant = (typeof highlightPropVariant)[number];

export type HighlightBaseProps = {
  /** The text to search in and render. */
  text?: string;
  /**
   * The search query. Matching is case-insensitive and every occurrence is highlighted.
   * When empty, the text is rendered without highlighting.
   */
  query?: string;
  /**
   * The variant to use.
   * @default 'background'
   */
  variant?: HighlightPropVariant;
  /** The component renders `text`, so it accepts no children. */
  children?: never;
  /** Additional CSS-classes. */
  className?: string;
};
