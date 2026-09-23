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

    it('should take a number size as pixels and a string one verbatim', () => {
      render(
        <SkeletonBlock {...baseProps} inlineSize={100} blockSize="2rem" />
      );

      const skeleton = getField();

      expect(skeleton).toHaveStyle({
        '--skeleton-inline-size': '100px',
        '--skeleton-block-size': '2rem',
      });
    });

    it('should keep the children in the DOM to size the skeleton', () => {
      render(
        <SkeletonBlock {...baseProps}>
          <span>Button</span>
        </SkeletonBlock>
      );

      expect(screen.getByText('Button')).toBeInTheDocument();
    });
  });
});
