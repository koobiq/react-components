import { describe, it, expect } from 'vitest';

import { capitalizeFirstLetter } from './index';

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a given word', () => {
    expect(capitalizeFirstLetter('world')).toBe('World');
  });

  it('should handle an empty string correctly', () => {
    const word = '';
    expect(capitalizeFirstLetter(word)).toBe('');
  });
});
