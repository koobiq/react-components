import type { ReactNode } from 'react';

type E2eGridProps = {
  /** Usually the number of states in a row. */
  columns: number;
  children: ReactNode;
};

/** The screenshot target of a test component: a grid sized to its content. */
export const E2eGrid = ({ columns, children }: E2eGridProps) => (
  <div
    data-testid="e2eScreenshotTarget"
    style={{
      display: 'inline-grid',
      gridTemplateColumns: `repeat(${columns}, max-content)`,
      // Items keep their own size instead of stretching to the cell.
      placeItems: 'start',
      gap: 'var(--kbq-size-s)',
      padding: 'var(--kbq-size-xxs)',
    }}
  >
    {children}
  </div>
);
