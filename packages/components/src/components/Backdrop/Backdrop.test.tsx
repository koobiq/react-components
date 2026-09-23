import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Backdrop } from './index';

describe('Backdrop', () => {
  const baseProps = { 'data-testid': 'backdrop' };

  it('should not render the content when closed', () => {
    render(
      <Backdrop {...baseProps}>
        <span>content</span>
      </Backdrop>
    );

    expect(screen.queryByTestId('backdrop')).not.toBeInTheDocument();
    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  it('should render the content when {isOpen} is true', () => {
    render(
      <Backdrop {...baseProps} isOpen>
        <span>content</span>
      </Backdrop>
    );

    expect(screen.getByTestId('backdrop')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});
