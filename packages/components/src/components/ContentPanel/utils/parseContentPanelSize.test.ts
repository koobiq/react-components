import { describe, it, expect } from 'vitest';

import { parseContentPanelSize } from './index'; // поправь путь под себя

describe('parseContentPanelSize', () => {
  it('returns null for null/undefined', () => {
    expect(parseContentPanelSize(400, null)).toBeNull();
    expect(parseContentPanelSize(400, undefined)).toBeNull();
  });

  it('parses number as px', () => {
    expect(parseContentPanelSize(400, 0)).toBe(0);
    expect(parseContentPanelSize(400, 300)).toBe(300);
  });

  it('returns null for non-finite number', () => {
    expect(parseContentPanelSize(400, Number.NaN)).toBeNull();
    expect(parseContentPanelSize(400, Number.POSITIVE_INFINITY)).toBeNull();
    expect(parseContentPanelSize(400, Number.NEGATIVE_INFINITY)).toBeNull();
  });

  it('parses numeric string as px', () => {
    expect(parseContentPanelSize(400, '400')).toBe(400);
    expect(parseContentPanelSize(400, '  400  ')).toBe(400);
    expect(parseContentPanelSize(400, '-10')).toBe(-10);
    expect(parseContentPanelSize(400, '0')).toBe(0);
  });

  it('parses percent string relative to container width', () => {
    expect(parseContentPanelSize(400, '50%')).toBe(200);
    expect(parseContentPanelSize(400, '12.5%')).toBe(50);
    expect(parseContentPanelSize(400, '0%')).toBe(0);
    expect(parseContentPanelSize(400, '100%')).toBe(400);
    expect(parseContentPanelSize(400, '-10%')).toBe(-40);
  });

  it('returns null for percent when containerWidth is missing or non-finite', () => {
    expect(parseContentPanelSize(undefined, '50%')).toBeNull();
    expect(parseContentPanelSize(null, '50%')).toBeNull();
    expect(parseContentPanelSize(Number.NaN, '50%')).toBeNull();
    expect(parseContentPanelSize(Number.POSITIVE_INFINITY, '50%')).toBeNull();
  });

  it('returns null for invalid strings', () => {
    expect(parseContentPanelSize(400, 'abc' as any)).toBeNull();
    expect(parseContentPanelSize(400, '10em' as any)).toBeNull();
    expect(parseContentPanelSize(400, '10%%' as any)).toBeNull();
    expect(parseContentPanelSize(400, '10pxpx' as any)).toBeNull();
  });

  it('returns null for invalid percent numbers', () => {
    expect(parseContentPanelSize(400, 'NaN%' as any)).toBeNull();
    expect(parseContentPanelSize(400, 'Infinity%' as any)).toBeNull();
    expect(parseContentPanelSize(400, '%50' as any)).toBeNull();
  });

  it('returns null for invalid px numbers', () => {
    expect(parseContentPanelSize(400, 'NaNpx' as any)).toBeNull();
    expect(parseContentPanelSize(400, 'Infinitypx' as any)).toBeNull();
  });
});
