import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Home from './App';

describe('Home page', () => {
  it('renders the Koobiq + Vite title', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { name: /Koobiq\s+\+ Vite/ })
    ).toBeInTheDocument();
  });
});
