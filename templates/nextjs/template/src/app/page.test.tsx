import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Home from './page';

describe('Home page', () => {
  it('renders the Koobiq + Next.js title', () => {
    render(<Home />);

    expect(
      screen.getByRole('heading', { name: 'Koobiq + Next.js' })
    ).toBeInTheDocument();
  });
});
