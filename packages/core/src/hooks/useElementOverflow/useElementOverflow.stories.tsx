import { useState } from 'react';

import type { Meta } from '@storybook/react';

import { useElementOverflow } from './useElementOverflow';

const meta = {
  title: 'Hooks/useElementOverflow',
} satisfies Meta<typeof useElementOverflow>;

export default meta;

export const Base = () => {
  const { ref, isOverflow, isOverflowX, isOverflowY } =
    useElementOverflow<HTMLSpanElement>();

  return (
    <div style={{ inlineSize: 240 }}>
      <span
        ref={ref}
        style={{
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        A long value that does not fit within the available inline size
      </span>
      <p>isOverflow: {String(isOverflow)}</p>
      <p>isOverflowX: {String(isOverflowX)}</p>
      <p>isOverflowY: {String(isOverflowY)}</p>
    </div>
  );
};

export const VerticalOverflow = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref, isOverflowY } = useElementOverflow<HTMLDivElement>();

  return (
    <div style={{ inlineSize: 280 }}>
      <div
        ref={ref}
        style={{
          maxBlockSize: isExpanded ? 'none' : 60,
          overflow: 'hidden',
          lineHeight: '20px',
        }}
      >
        The security scan completed successfully.
        <br />
        Review the detected issues before publishing the report.
        <br />
        This preview is intentionally limited to three lines.
        <br />
        Additional details remain available when the content is expanded.
      </div>

      <button
        type="button"
        disabled={!isOverflowY && !isExpanded}
        onClick={() => setIsExpanded((value) => !value)}
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
};
