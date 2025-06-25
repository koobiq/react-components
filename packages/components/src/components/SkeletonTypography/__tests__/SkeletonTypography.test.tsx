import { getRowWidth } from '../utils';

describe('getRowWidth', () => {
  it('returns 50% if it is the only row', () => {
    expect(getRowWidth(0, 1)).toBe('50%');
  });

  it('returns 50% if it is the last row', () => {
    expect(getRowWidth(1, 2)).toBe('50%');
    expect(getRowWidth(9, 10)).toBe('50%');
  });

  it('returns 95% if it is the first row in a group of three', () => {
    expect(getRowWidth(0, 10)).toBe('95%');
    expect(getRowWidth(3, 10)).toBe('95%');
    expect(getRowWidth(6, 10)).toBe('95%');
  });

  it('returns 100% if it is the second row in a group of three', () => {
    expect(getRowWidth(1, 10)).toBe('100%');
    expect(getRowWidth(4, 10)).toBe('100%');
    expect(getRowWidth(7, 10)).toBe('100%');
  });

  it('returns 90% if it is the third row in a group of three', () => {
    expect(getRowWidth(2, 10)).toBe('90%');
    expect(getRowWidth(5, 10)).toBe('90%');
    expect(getRowWidth(8, 10)).toBe('90%');
  });
});
