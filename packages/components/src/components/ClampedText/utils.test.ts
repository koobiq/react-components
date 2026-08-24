import { afterEach, describe, expect, it, vi } from 'vitest';

import { getRowsCount } from './utils';

type Rect = Pick<DOMRect, 'top' | 'bottom' | 'height'>;

const createClientRects = (rects: Rect[]): DOMRectList =>
  Object.assign(rects, {
    item: (index: number) => rects[index] ?? null,
  }) as unknown as DOMRectList;

describe('getRowsCount', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('merges overlapping rects from mixed inline typography into rows', () => {
    const element = document.createElement('div');

    element.innerHTML =
      'Hash <code>a1b2c3</code> seen at <sup>2</sup> nodes<br>Second row';

    const rectsByText = new Map<string, Rect[]>([
      ['Hash ', [{ top: 10, bottom: 30, height: 20 }]],
      ['a1b2c3', [{ top: 14, bottom: 26, height: 12 }]],
      [' seen at ', [{ top: 10, bottom: 30, height: 20 }]],
      ['2', [{ top: 5, bottom: 18, height: 13 }]],
      [' nodes', [{ top: 10, bottom: 30, height: 20 }]],
      ['Second row', [{ top: 30, bottom: 50, height: 20 }]],
    ]);

    let selectedNode: Node | undefined;

    vi.spyOn(document, 'createRange').mockReturnValue({
      selectNodeContents: (node: Node) => {
        selectedNode = node;
      },
      getClientRects: () =>
        createClientRects(
          rectsByText.get(selectedNode?.textContent ?? '') ?? []
        ),
    } as unknown as Range);

    expect(getRowsCount(element)).toBe(2);
  });

  it('ignores whitespace and zero-height rects', () => {
    const element = document.createElement('div');

    element.innerHTML = 'First<span> </span><span>Second</span>';

    const rectsByText = new Map<string, Rect[]>([
      [
        'First',
        [
          { top: 0, bottom: 20, height: 20 },
          { top: 20, bottom: 20, height: 0 },
        ],
      ],
      ['Second', [{ top: 20, bottom: 40, height: 20 }]],
    ]);

    let selectedNode: Node | undefined;

    vi.spyOn(document, 'createRange').mockReturnValue({
      selectNodeContents: (node: Node) => {
        selectedNode = node;
      },
      getClientRects: () =>
        createClientRects(
          rectsByText.get(selectedNode?.textContent ?? '') ?? []
        ),
    } as unknown as Range);

    expect(getRowsCount(element)).toBe(2);
  });
});
