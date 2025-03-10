import { describe, it, expect } from 'vitest';

import { capitalizeFirstLetter } from './index';

describe('capitalizeFirstLetter', () => {
  it('should set the capital letter in the word', () => {
    expect(capitalizeFirstLetter('world')).toBe('World');
  });

  it('should work correctly for an empty string', () => {
    const word = '';
    expect(capitalizeFirstLetter(word)).toBe('');
  });
});
