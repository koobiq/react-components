import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { SkeletonBlock } from './index';

function getField() {
  return screen.getByTestId('skeleton');
}

describe('Skeleton', () => {
  const baseProps = {
    'data-testid': 'skeleton',
  };

  describe('basic component behavior', () => {
    it('should accept {className} and {ref} props for the main container', () => {
      const ref = createRef<HTMLDivElement>();

      render(<SkeletonBlock {...baseProps} className="foo" ref={ref} />);

      const skeleton = getField();
      expect(ref.current).toBe(skeleton);
      expect(skeleton).toHaveClass('foo');
    });

    it('should apply tokens when {waveColor} and {bgColor} are provided', () => {
      render(
        <SkeletonBlock {...baseProps} waveColor="black" bgColor="black" />
      );

      const skeleton = getField();

      expect(skeleton).toHaveStyle({
        '--skeleton-wave-color': 'black',
        '--skeleton-bg-color': 'black',
      });
    });
  });
});
