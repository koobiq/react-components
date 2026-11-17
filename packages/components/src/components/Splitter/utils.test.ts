import { describe, expect, it } from 'vitest';

import type { SplitterPropSize } from './types';
import {
  fitSplitterSizes,
  isViewportSize,
  resizeSplitterSizesAt,
  resolveSplitterSize,
  snapSplitterSize,
} from './utils';

const VIEWPORT = { width: 1000, height: 500 };

describe('resolveSplitterSize', () => {
  it.each<{
    size: SplitterPropSize | undefined | null;
    expected: number | null;
  }>([
    { size: 240, expected: 240 },
    { size: '240', expected: 240 },
    { size: '240px', expected: 240 },
    { size: '30%', expected: 180 },
    { size: ' 30% ', expected: 180 },
    { size: '30vw', expected: 300 },
    { size: '30vh', expected: 150 },
    { size: '12.5VW', expected: 125 },
    { size: undefined, expected: null },
    { size: null, expected: null },
    { size: 'auto', expected: null },
    { size: '12.5PX', expected: 12.5 },
    { size: '10rem', expected: null },
    { size: '2em', expected: null },
    { size: '50dvh', expected: null },
    { size: '10 px', expected: null },
    { size: Number.NaN, expected: null },
  ])(
    'resolves $size against a 600px splitter as $expected',
    ({ size, expected }) => {
      expect(resolveSplitterSize(size, 600, VIEWPORT)).toBe(expected);
    }
  );
});

describe('isViewportSize', () => {
  it.each<{ size: SplitterPropSize | undefined; expected: boolean }>([
    { size: '30vw', expected: true },
    { size: ' 30VH ', expected: true },
    { size: '30%', expected: false },
    { size: 300, expected: false },
    { size: undefined, expected: false },
  ])('reports $size as $expected', ({ size, expected }) => {
    expect(isViewportSize(size)).toBe(expected);
  });
});

describe('fitSplitterSizes', () => {
  it('leaves sizes that already fit untouched', () => {
    expect(
      fitSplitterSizes([200, 400], [0, 0], [Infinity, Infinity], 600)
    ).toEqual([200, 400]);
  });

  it('clamps to the limits and hands the residual to the panels with room', () => {
    expect(fitSplitterSizes([500, 100], [0, 0], [300, Infinity], 600)).toEqual([
      300, 300,
    ]);
  });

  it('stops once every panel sits at a limit', () => {
    expect(fitSplitterSizes([300, 300], [100, 100], [100, 100], 600)).toEqual([
      100, 100,
    ]);
  });

  it('spreads the residual across several passes when a panel fills up', () => {
    expect(
      fitSplitterSizes(
        [100, 100, 100],
        [0, 0, 0],
        [Infinity, 150, Infinity],
        600
      )
    ).toEqual([225, 150, 225]);
  });
});

describe('resizeSplitterSizesAt', () => {
  const unbounded = [Infinity, Infinity, Infinity];

  it('moves the boundary between the two panels it sits on', () => {
    expect(resizeSplitterSizesAt([300, 300], 0, 50, [0, 0], unbounded)).toEqual(
      [350, 250]
    );
  });

  it('stops the leading panel at its own maximum', () => {
    expect(
      resizeSplitterSizesAt([300, 300], 0, 200, [0, 0], [400, Infinity])
    ).toEqual([400, 200]);
  });

  it('stops at what the trailing panel can give up', () => {
    expect(
      resizeSplitterSizesAt([300, 300], 0, 250, [0, 100], unbounded)
    ).toEqual([500, 100]);
  });

  it('cascades onto the next panel once the neighbour reaches its minimum', () => {
    expect(
      resizeSplitterSizesAt([200, 200, 200], 0, 250, [0, 100, 50], unbounded)
    ).toEqual([450, 100, 50]);
  });

  it('stops once every trailing panel sits at its minimum', () => {
    expect(
      resizeSplitterSizesAt([200, 200, 200], 0, 250, [0, 100, 100], unbounded)
    ).toEqual([400, 100, 100]);
  });

  it('hands the delta further out when the neighbour is at its maximum', () => {
    expect(
      resizeSplitterSizesAt(
        [243, 200, 243],
        1,
        60,
        [0, 125, 125],
        [Infinity, 200, Infinity]
      )
    ).toEqual([303, 200, 183]);
  });

  it('stops when the far side runs out even though the near side has room', () => {
    expect(
      resizeSplitterSizesAt(
        [243, 200, 243],
        1,
        400,
        [0, 125, 125],
        [Infinity, 200, Infinity]
      )
    ).toEqual([361, 200, 125]);
  });

  it('leaves the panels before the boundary while the neighbour has room', () => {
    expect(
      resizeSplitterSizesAt([100, 200, 300], 1, 100, [0, 0, 0], unbounded)
    ).toEqual([100, 300, 200]);
  });

  it('ignores a boundary that has no trailing panel', () => {
    expect(resizeSplitterSizesAt([300, 300], 1, 50, [0, 0], unbounded)).toEqual(
      [300, 300]
    );
  });
});

describe('snapSplitterSize', () => {
  const points = (sizes: number[], tolerance = 32) =>
    sizes.map((size) => ({ size, tolerance }));

  it('pulls the target onto a snap point within its tolerance', () => {
    expect(snapSplitterSize(310, points([300]))).toBe(300);
  });

  it('leaves a target that no snap point is close enough to', () => {
    expect(snapSplitterSize(400, points([300]))).toBe(400);
  });

  it('chooses the nearest of several snap points', () => {
    expect(snapSplitterSize(310, points([300, 318, 500]))).toBe(318);
  });

  it('ignores snap points that resolve to infinity', () => {
    expect(snapSplitterSize(310, points([Infinity]))).toBe(310);
  });

  it("honours each snap point's own tolerance", () => {
    expect(
      snapSplitterSize(310, [
        { size: 290, tolerance: 8 },
        { size: 360, tolerance: 60 },
      ])
    ).toBe(360);
  });

  it('settles a tie by declaration order', () => {
    expect(snapSplitterSize(300, points([200, 400], 150))).toBe(200);
    expect(snapSplitterSize(300, points([400, 200], 150))).toBe(400);
  });
});
