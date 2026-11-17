import { createRef, useState } from 'react';

import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Provider } from '../Provider';

import { Splitter } from './index';
import type { SplitterPanelBaseProps, SplitterProps } from './index';

/** Size the splitter measures itself as; every expectation is expressed against it. */
const CONTAINER_SIZE = 600;

const mocks = {
  width: CONTAINER_SIZE,
  height: CONTAINER_SIZE,
  observers: new Set<ResizeObserverCallback>(),
};

/** jsdom has no `ResizeObserver`; this one lets a test resize the splitter. */
class MockResizeObserver {
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe() {
    mocks.observers.add(this.callback);
  }

  unobserve() {}

  disconnect() {
    mocks.observers.delete(this.callback);
  }
}

type TestPanel = Omit<SplitterPanelBaseProps, 'id'> & { id: string };

const TWO_PANELS: TestPanel[] = [{ id: 'first' }, { id: 'second' }];

const renderPanels = (panels: TestPanel[]) =>
  panels.map(({ id, ...panel }) => (
    <Splitter.Panel key={id} id={id} data-testid={id} {...panel}>
      {id}
    </Splitter.Panel>
  ));

const renderSplitter = (
  panels: TestPanel[] = TWO_PANELS,
  props: Partial<SplitterProps> = {}
) => {
  const ui = (nextPanels: TestPanel[], nextProps: Partial<SplitterProps>) => (
    <Provider locale="en-US">
      <Splitter data-testid="splitter" {...nextProps}>
        {renderPanels(nextPanels)}
      </Splitter>
    </Provider>
  );

  const result = render(ui(panels, props));

  return {
    ...result,
    update: (
      nextPanels: TestPanel[] = panels,
      nextProps: Partial<SplitterProps> = props
    ) => result.rerender(ui(nextPanels, nextProps)),
  };
};

const getSplitter = () => screen.getByTestId('splitter');
const getSeparators = () => screen.getAllByRole('separator');
const getSeparator = (index = 0) => getSeparators()[index] as HTMLElement;

/** Panel sizes in pixels, read back out of the percentage tracks the splitter writes. */
const getSizes = (): number[] => {
  const { style } = getSplitter();

  const [template, total] = style.gridTemplateRows
    ? [style.gridTemplateRows, mocks.height]
    : [style.gridTemplateColumns, mocks.width];

  return template
    .split(' ')
    .map((track) => Math.round((parseFloat(track) / 100) * total));
};

/** Resizes the splitter and lets it measure itself again. */
const resizeTo = (width: number, height = width) => {
  mocks.width = width;
  mocks.height = height;

  act(() =>
    mocks.observers.forEach((callback) => callback([], {} as ResizeObserver))
  );
};

const pressKey = (key: string, index = 0, init: KeyboardEventInit = {}) =>
  fireEvent.keyDown(getSeparator(index), { key, ...init });

/** Presses the separator, moves the pointer through `travel` (absolute offsets from the press) and releases it. */
const drag = (
  travel: number[],
  {
    index = 0,
    axis = 'x',
    release = true,
  }: { index?: number; axis?: 'x' | 'y'; release?: boolean } = {}
) => {
  const point = (offset: number) =>
    axis === 'x'
      ? { clientX: offset, clientY: 0 }
      : { clientX: 0, clientY: offset };

  fireEvent.mouseDown(getSeparator(index), { button: 0, ...point(0) });

  travel.forEach((offset) =>
    fireEvent.mouseMove(window, { button: 0, ...point(offset) })
  );

  if (release) {
    fireEvent.mouseUp(window, { button: 0, ...point(travel.at(-1) ?? 0) });
  }
};

/** Ends a drag left open with `release: false`. */
const release = () => fireEvent.mouseUp(window, { button: 0 });

describe('Splitter', () => {
  beforeEach(() => {
    mocks.width = CONTAINER_SIZE;
    mocks.height = CONTAINER_SIZE;
    vi.stubGlobal('ResizeObserver', MockResizeObserver);
    // `useMove` falls back to mouse events in tests without `PointerEvent`.
    vi.stubGlobal('PointerEvent', undefined);

    vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(
      () => mocks.width
    );

    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(
      () => mocks.height
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    mocks.observers.clear();
  });

  it('forwards the ref and merges consumer props', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Splitter
        ref={ref}
        data-testid="splitter"
        className="custom"
        style={{ color: 'red' }}
      >
        <Splitter.Panel className="panel">first</Splitter.Panel>
        <Splitter.Panel>second</Splitter.Panel>
      </Splitter>
    );

    expect(ref.current).toBe(getSplitter());
    expect(getSplitter()).toHaveClass('custom');
    expect(getSplitter().style.color).toBe('red');
    expect(screen.getByText('first').parentElement).toHaveClass('panel');
  });

  describe('sizes', () => {
    it('gives panels an equal share when none declares a size', () => {
      renderSplitter();

      expect(getSizes()).toEqual([300, 300]);
    });

    it('renders a separator after every panel but the last', () => {
      renderSplitter([{ id: 'first' }, { id: 'second' }, { id: 'third' }]);

      expect(getSeparators()).toHaveLength(2);
      expect(screen.getByTestId('third')).not.toContainElement(getSeparator(1));
    });

    it('honours declared sizes and lets the rest share what is left', () => {
      renderSplitter([
        { id: 'first', size: 200 },
        { id: 'second' },
        { id: 'third' },
      ]);

      expect(getSizes()).toEqual([200, 200, 200]);
    });

    it.each<{ title: string; panel: TestPanel; expected: number[] }>([
      {
        title: 'a percentage size',
        panel: { id: 'first', size: '25%' },
        expected: [150, 450],
      },
      {
        title: 'a px string',
        panel: { id: 'first', size: '150px' },
        expected: [150, 450],
      },
      {
        title: 'a percentage minimum',
        panel: { id: 'first', size: 100, minSize: '50%' },
        expected: [300, 300],
      },
      {
        title: 'a percentage maximum',
        panel: { id: 'first', size: 500, maxSize: '25%' },
        expected: [150, 450],
      },
      {
        title: 'a percentage snap size',
        panel: { id: 'first', size: 190, snapSizes: ['35%'] },
        expected: [210, 390],
      },
    ])('resolves $title', ({ panel, expected }) => {
      renderSplitter([panel, { id: 'second' }]);

      expect(getSizes()).toEqual(expected);
    });

    it('resolves a percentage collapsed size', () => {
      renderSplitter([
        {
          id: 'first',
          size: 200,
          minSize: 100,
          isCollapsible: true,
          collapsedSize: '10%',
        },
        { id: 'second' },
      ]);

      pressKey('Enter');

      expect(getSizes()).toEqual([60, 540]);
    });

    it('mixes units across the panels of one splitter', () => {
      renderSplitter([
        { id: 'first', size: '25%' },
        { id: 'second', size: '150px' },
        { id: 'third' },
      ]);

      expect(getSizes()).toEqual([150, 150, 300]);
    });

    it('warns once about a size in an unsupported unit and ignores it', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { update } = renderSplitter([
        { id: 'first', minSize: '10rem' },
        { id: 'second' },
      ]);

      update([
        { id: 'first', minSize: '10rem', maxSize: 500 },
        { id: 'second' },
      ]);

      expect(warn).toHaveBeenCalledOnce();
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('"10rem"'));
      expect(getSizes()).toEqual([300, 300]);
    });

    it('re-resolves percentages when the splitter is resized', () => {
      renderSplitter([
        { id: 'first', size: '25%', minSize: '20%' },
        { id: 'second' },
      ]);

      expect(getSizes()).toEqual([150, 450]);

      resizeTo(800);

      expect(getSizes()).toEqual([200, 600]);
    });

    it('keeps the proportions of a resized layout when the splitter is resized', () => {
      renderSplitter([
        { id: 'first', size: '40%' },
        { id: 'second', size: '60%' },
      ]);

      pressKey('Home');

      expect(getSizes()).toEqual([0, 600]);

      pressKey('ArrowRight');
      resizeTo(1200);

      expect(getSizes()).toEqual([16, 1184]);
    });

    it('resolves sizes in viewport units and follows the viewport', () => {
      vi.stubGlobal('innerWidth', 1000);
      vi.stubGlobal('innerHeight', 500);

      renderSplitter([{ id: 'first', size: '20vw' }, { id: 'second' }]);

      expect(getSizes()).toEqual([200, 400]);

      vi.stubGlobal('innerWidth', 1500);
      act(() => window.dispatchEvent(new Event('resize')));

      expect(getSizes()).toEqual([300, 300]);
    });

    it('clamps a declared size to the panel constraints', () => {
      renderSplitter([
        { id: 'first', size: 50, minSize: 100 },
        { id: 'second' },
      ]);

      expect(getSizes()).toEqual([100, 500]);
    });

    it('settles the seeded layout onto a snap size', () => {
      renderSplitter([
        { id: 'first', size: 280, snapSizes: [300] },
        { id: 'second' },
      ]);

      expect(getSizes()).toEqual([300, 300]);
    });

    it('leaves a layout it was handed unsnapped', () => {
      renderSplitter([{ id: 'first', snapSizes: [300] }, { id: 'second' }], {
        layout: [45, 55],
      });

      expect(getSizes()).toEqual([270, 330]);
    });

    it('keeps the tracks below the container when the minimums cannot fit', () => {
      renderSplitter([
        { id: 'first', minSize: 400 },
        { id: 'second', minSize: 400 },
      ]);

      expect(getSizes()).toEqual([400, 400]);
    });

    it('lays panels out against the height when vertical', () => {
      mocks.height = 300;

      renderSplitter([{ id: 'first', size: 100 }, { id: 'second' }], {
        orientation: 'vertical',
      });

      expect(getSplitter().style.gridTemplateColumns).toBe('');
      expect(getSizes()).toEqual([100, 200]);
    });

    it('falls back to equal tracks until it has been measured', () => {
      mocks.width = 0;

      renderSplitter();

      expect(getSplitter().style.gridTemplateColumns).toBe(
        'repeat(2, minmax(0, 1fr))'
      );
    });
  });

  describe('layout', () => {
    it('lays panels out from a controlled layout', () => {
      renderSplitter(TWO_PANELS, { layout: [25, 75] });

      expect(getSizes()).toEqual([150, 450]);
    });

    it('refits a layout to the panel constraints', () => {
      renderSplitter([{ id: 'first', minSize: 250 }, { id: 'second' }], {
        layout: [10, 90],
      });

      expect(getSizes()).toEqual([250, 350]);
    });

    it('returns to the declared sizes when the layout is cleared', () => {
      const panels = [{ id: 'first', size: 200 }, { id: 'second' }];
      const { update } = renderSplitter(panels, { layout: [50, 50] });

      expect(getSizes()).toEqual([300, 300]);

      update(panels, { layout: null });

      expect(getSizes()).toEqual([200, 400]);
    });

    it('ignores a layout whose length does not match the panels', () => {
      renderSplitter(TWO_PANELS, { layout: [20, 30, 50] });

      expect(getSizes()).toEqual([300, 300]);
    });

    it('starts from a default layout and reports changes', () => {
      const onLayoutChange = vi.fn();

      renderSplitter(TWO_PANELS, { defaultLayout: [25, 75], onLayoutChange });

      expect(getSizes()).toEqual([150, 450]);

      pressKey('ArrowRight');

      expect(getSizes()).toEqual([158, 442]);

      expect(onLayoutChange).toHaveBeenLastCalledWith([
        (158 / 600) * 100,
        (442 / 600) * 100,
      ]);
    });

    it('stays on the controlled layout until the host updates it', () => {
      const onLayoutChange = vi.fn();

      renderSplitter(TWO_PANELS, { layout: [50, 50], onLayoutChange });

      pressKey('ArrowRight');

      expect(onLayoutChange).toHaveBeenCalledOnce();
      expect(getSizes()).toEqual([300, 300]);
    });

    it('keeps two splitters sharing one layout in step', () => {
      const Shared = () => {
        const [layout, setLayout] = useState<number[] | null>(null);

        return (
          <>
            <Splitter
              data-testid="splitter"
              layout={layout}
              onLayoutChange={setLayout}
            >
              <Splitter.Panel>a</Splitter.Panel>
              <Splitter.Panel>b</Splitter.Panel>
            </Splitter>
            <Splitter
              data-testid="other"
              layout={layout}
              onLayoutChange={setLayout}
            >
              <Splitter.Panel>c</Splitter.Panel>
              <Splitter.Panel>d</Splitter.Panel>
            </Splitter>
          </>
        );
      };

      render(<Shared />);

      pressKey('ArrowRight');

      expect(getSizes()).toEqual([308, 292]);

      expect(screen.getByTestId('other').style.gridTemplateColumns).toBe(
        getSplitter().style.gridTemplateColumns
      );
    });
  });

  describe('accessibility', () => {
    it('marks the separator up as a window splitter', () => {
      renderSplitter();

      const separator = getSeparator();

      expect(separator).toHaveAttribute('tabindex', '0');
      expect(separator).toHaveAttribute('aria-controls', 'first');
      expect(separator).toHaveAttribute('aria-valuenow', '50');
      expect(separator).toHaveAttribute('aria-label', 'Resize panels');
    });

    it('orients the separator across the axis the panels are laid out along', () => {
      const { update } = renderSplitter();

      expect(getSeparator()).toHaveAttribute('aria-orientation', 'vertical');

      update(TWO_PANELS, { orientation: 'vertical' });

      expect(getSeparator()).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('reports the room the panel still has as the value range', () => {
      renderSplitter([
        { id: 'first', minSize: 100, maxSize: 400 },
        { id: 'second', minSize: 200 },
      ]);

      expect(getSeparator()).toHaveAttribute('aria-valuemin', '17');
      expect(getSeparator()).toHaveAttribute('aria-valuemax', '67');
    });

    it('reports the pane it controls, not the boundary, when the delta walks past it', () => {
      renderSplitter([
        { id: 'first' },
        { id: 'second', minSize: 125, maxSize: 200 },
        { id: 'third', minSize: 125 },
      ]);

      const separator = getSeparator(1);

      expect(separator).toHaveAttribute('aria-valuenow', '33');
      expect(separator).toHaveAttribute('aria-valuemax', '33');
      expect(separator).toHaveAttribute('aria-valuemin', '21');
    });

    it('names the separator from the locale', () => {
      render(
        <Provider locale="ru-RU">
          <Splitter>
            <Splitter.Panel>first</Splitter.Panel>
            <Splitter.Panel>second</Splitter.Panel>
          </Splitter>
        </Provider>
      );

      expect(getSeparator()).toHaveAttribute(
        'aria-label',
        'Изменить размер панелей'
      );
    });

    it('takes a name and other props for the separator from slotProps', () => {
      renderSplitter([
        {
          id: 'first',
          slotProps: {
            separator: { 'aria-label': 'Resize sidebar', className: 'grip' },
          },
        },
        { id: 'second' },
      ]);

      expect(getSeparator()).toHaveAttribute('aria-label', 'Resize sidebar');
      expect(getSeparator()).toHaveClass('grip');
    });

    it('takes the separator out of the tab order when the splitter is disabled', () => {
      renderSplitter(TWO_PANELS, { isDisabled: true });

      expect(getSeparator()).toHaveAttribute('tabindex', '-1');
      expect(getSeparator()).toHaveAttribute('aria-disabled', 'true');
    });
  });

  describe('cursor', () => {
    it('advertises the axis the boundary moves along', () => {
      const { update } = renderSplitter();

      expect(getSeparator().style.cursor).toBe('col-resize');

      update(TWO_PANELS, { orientation: 'vertical' });

      expect(getSeparator().style.cursor).toBe('row-resize');
    });

    it('points at the only direction left once a panel sits at a limit', () => {
      renderSplitter([
        { id: 'first', size: 200, maxSize: 200 },
        { id: 'second' },
      ]);

      expect(getSeparator().style.cursor).toBe('w-resize');
    });

    it('still offers both directions when the neighbour is pinned but the boundary can move', () => {
      renderSplitter([
        { id: 'first' },
        { id: 'second', minSize: 125, maxSize: 200 },
        { id: 'third', minSize: 125 },
      ]);

      expect(getSizes()).toEqual([200, 200, 200]);
      expect(getSeparator(1).style.cursor).toBe('col-resize');
    });

    it('falls back to the default cursor when the splitter is disabled', () => {
      renderSplitter(TWO_PANELS, { isDisabled: true });

      expect(getSeparator().style.cursor).toBe('default');
    });

    it('holds the cursor on the document for the whole drag', () => {
      renderSplitter();

      drag([50], { release: false });

      expect(document.body.style.getPropertyValue('cursor')).toBe('col-resize');

      fireEvent.mouseUp(window, { button: 0, clientX: 50 });

      expect(document.body.style.getPropertyValue('cursor')).toBe('');
    });
  });

  describe('dragging', () => {
    it('moves the boundary with the pointer', () => {
      renderSplitter();

      drag([50]);

      expect(getSizes()).toEqual([350, 250]);
    });

    it('moves a horizontal boundary along the block axis when vertical', () => {
      renderSplitter(TWO_PANELS, { orientation: 'vertical' });

      drag([-50], { axis: 'y' });

      expect(getSizes()).toEqual([250, 350]);
    });

    it('stops at the minimum of the panel being shrunk', () => {
      renderSplitter([{ id: 'first' }, { id: 'second', minSize: 150 }]);

      drag([400]);

      expect(getSizes()).toEqual([450, 150]);
    });

    it('mirrors the pointer in RTL, where the leading panel grows towards the west', () => {
      render(
        <Provider locale="ar-AE">
          <Splitter data-testid="splitter">
            <Splitter.Panel>first</Splitter.Panel>
            <Splitter.Panel>second</Splitter.Panel>
          </Splitter>
        </Provider>
      );

      drag([-50]);

      expect(getSizes()).toEqual([350, 250]);
    });

    it('marks the splitter and the separator while dragging', () => {
      renderSplitter();

      drag([50], { release: false });

      expect(getSplitter()).toHaveAttribute('data-resizing', 'true');
      expect(getSeparator()).toHaveAttribute('data-resizing', 'true');

      fireEvent.mouseUp(window, { button: 0, clientX: 50 });

      expect(getSplitter()).not.toHaveAttribute('data-resizing');
    });

    it('leaves a derived layout derived after a press that moved nothing', () => {
      const onLayoutChange = vi.fn();
      const panels = [{ id: 'first', size: 200 }, { id: 'second' }];
      const { update } = renderSplitter(panels, { onLayoutChange });

      drag([]);

      expect(onLayoutChange).not.toHaveBeenCalled();

      update([{ id: 'first', size: 400 }, { id: 'second' }]);

      expect(getSizes()).toEqual([400, 200]);
    });

    it('does not resize while the splitter is disabled', () => {
      renderSplitter(TWO_PANELS, { isDisabled: true });

      drag([50]);

      expect(getSizes()).toEqual([300, 300]);
    });
  });

  describe('snapping', () => {
    const panels: TestPanel[] = [
      { id: 'first', snapSizes: [200, 400] as const },
      { id: 'second' },
    ];

    it('pulls the boundary onto a snap size it is released near', () => {
      renderSplitter(panels);

      drag([80]);

      expect(getSizes()).toEqual([400, 200]);
    });

    it('follows the pointer exactly until the drag is released', () => {
      renderSplitter(panels);

      drag([80], { release: false });

      expect(getSizes()).toEqual([380, 220]);

      fireEvent.mouseUp(window, { button: 0, clientX: 80 });

      expect(getSizes()).toEqual([400, 200]);
    });

    it('leaves a boundary released far from every snap size', () => {
      renderSplitter(panels);

      drag([50]);

      expect(getSizes()).toEqual([350, 250]);
    });

    it('reaches further when the panel widens its tolerance', () => {
      renderSplitter([
        { id: 'first', snapSizes: [400], snapTolerance: 100 },
        { id: 'second' },
      ]);

      drag([40]);

      expect(getSizes()).toEqual([400, 200]);
    });
  });

  describe('collapsing by drag', () => {
    /** First panel collapsible to a 40px strip below its 200px minimum — the midpoint is 100px. */
    const collapsible = (props: Partial<TestPanel> = {}): TestPanel[] => [
      {
        id: 'first',
        minSize: 200,
        isCollapsible: true,
        collapsedSize: 40,
        ...props,
      },
      { id: 'second' },
    ];

    /** Pointer offsets that ask the 300px first panel for these sizes. */
    const toward = (...sizes: number[]) => sizes.map((size) => size - 300);

    it('collapses the panel while the drag is still in progress', () => {
      const onCollapsedChange = vi.fn();

      renderSplitter(collapsible({ onCollapsedChange }));

      drag(toward(90), { release: false });

      expect(onCollapsedChange).toHaveBeenCalledWith(true);
      expect(getSizes()).toEqual([40, 560]);

      expect(screen.getByTestId('first')).toHaveAttribute(
        'data-collapsed',
        'true'
      );

      release();
    });

    it('waits at the minimum until the pointer passes the midpoint', () => {
      renderSplitter(collapsible());

      drag(toward(110), { release: false });

      expect(getSizes()).toEqual([200, 400]);

      release();
    });

    it('reopens the panel when the pointer comes back across the midpoint', () => {
      renderSplitter(collapsible());

      drag(toward(90, 110), { release: false });

      expect(getSizes()).toEqual([200, 400]);
      expect(screen.getByTestId('first')).not.toHaveAttribute('data-collapsed');

      release();
    });

    it('reports the change once per crossing rather than on every move', () => {
      const onCollapsedChange = vi.fn();

      renderSplitter(collapsible({ onCollapsedChange }));

      drag(toward(90, 80, 70, 110, 120));

      expect(onCollapsedChange.mock.calls).toEqual([[true], [false]]);
    });

    it('keeps the state the drag ended on once it is released', () => {
      renderSplitter(collapsible());

      drag(toward(90));

      expect(getSizes()).toEqual([40, 560]);
    });

    it('never collapses a panel that is not collapsible', () => {
      const onCollapsedChange = vi.fn();

      renderSplitter(collapsible({ isCollapsible: false, onCollapsedChange }));

      drag(toward(90));

      expect(onCollapsedChange).not.toHaveBeenCalled();
      expect(getSizes()).toEqual([200, 400]);
    });

    it('gives a drag-collapsed panel its size back when the host expands it', () => {
      const Host = () => {
        const [isCollapsed, setCollapsed] = useState(false);

        return (
          <>
            <button onClick={() => setCollapsed(false)}>expand</button>
            <Splitter data-testid="splitter">
              <Splitter.Panel
                minSize={200}
                isCollapsible
                collapsedSize={40}
                isCollapsed={isCollapsed}
                onCollapsedChange={setCollapsed}
              >
                first
              </Splitter.Panel>
              <Splitter.Panel>second</Splitter.Panel>
            </Splitter>
          </>
        );
      };

      render(<Host />);

      drag(toward(90));

      expect(getSizes()).toEqual([40, 560]);

      fireEvent.click(screen.getByText('expand'));

      expect(getSizes()).toEqual([300, 300]);
    });

    it('gives a drag-collapsed panel its size back when Enter expands it', () => {
      renderSplitter(collapsible());

      drag(toward(90));
      pressKey('Enter');

      expect(getSizes()).toEqual([300, 300]);
    });

    it('leaves the other panels where the drag put them and restores the collapsed one', () => {
      mocks.width = 900;

      renderSplitter([
        {
          id: 'first',
          size: 300,
          minSize: 200,
          isCollapsible: true,
          collapsedSize: 40,
        },
        { id: 'second' },
        { id: 'third' },
      ]);

      drag(toward(90), { release: false });

      const held = getSizes();

      fireEvent.mouseUp(window, { button: 0 });

      expect(getSizes()).toEqual(held);

      pressKey('Enter');

      const [restored = 0, ...others] = getSizes();

      expect(restored).toBe(300);
      expect(others.reduce((sum, size) => sum + size, restored)).toBe(900);
    });
  });

  describe('keyboard', () => {
    it('moves the boundary by one step per arrow press', () => {
      renderSplitter();

      pressKey('ArrowRight');

      expect(getSizes()).toEqual([308, 292]);

      pressKey('ArrowLeft');

      expect(getSizes()).toEqual([300, 300]);
    });

    it('ignores the arrows of the other axis', () => {
      renderSplitter();

      pressKey('ArrowDown');

      expect(getSizes()).toEqual([300, 300]);
    });

    it('moves a vertical splitter with the up and down arrows', () => {
      renderSplitter(TWO_PANELS, { orientation: 'vertical' });

      pressKey('ArrowDown');

      expect(getSizes()).toEqual([308, 292]);
    });

    it('leaves a modified press to the browser', () => {
      renderSplitter();

      pressKey('ArrowRight', 0, { metaKey: true });

      expect(getSizes()).toEqual([300, 300]);
    });

    it('keeps the size a collapsed panel returns to while another boundary moves', () => {
      mocks.width = 900;

      renderSplitter(
        [
          { id: 'first', minSize: 200, isCollapsible: true, collapsedSize: 40 },
          { id: 'second' },
          { id: 'third' },
        ],
        { defaultLayout: [40, 30, 30] }
      );

      pressKey('Enter');
      pressKey('ArrowRight', 1);
      pressKey('Enter');

      expect(getSizes()).toEqual([360, 278, 262]);
    });

    it('takes the panel to its minimum on Home and to its maximum on End', () => {
      renderSplitter([
        { id: 'first', minSize: 100, maxSize: 400 },
        { id: 'second', minSize: 150 },
      ]);

      pressKey('Home');

      expect(getSizes()).toEqual([100, 500]);

      pressKey('End');

      expect(getSizes()).toEqual([400, 200]);
    });

    it('collapses a collapsible panel that Home finds already at its minimum', () => {
      renderSplitter([
        { id: 'first', minSize: 100, isCollapsible: true, collapsedSize: 40 },
        { id: 'second' },
      ]);

      pressKey('Home');

      expect(getSizes()).toEqual([100, 500]);

      pressKey('Home');

      expect(getSizes()).toEqual([40, 560]);
    });

    it('expands a collapsed panel on End before growing it', () => {
      renderSplitter([
        {
          id: 'first',
          minSize: 100,
          maxSize: 400,
          isCollapsible: true,
          collapsedSize: 40,
          defaultCollapsed: true,
        },
        { id: 'second' },
      ]);

      expect(getSizes()).toEqual([40, 560]);

      pressKey('End');

      expect(getSizes()).toEqual([400, 200]);
    });

    it('toggles a collapsible panel on Enter and restores the size it had', () => {
      renderSplitter([
        {
          id: 'first',
          size: 200,
          minSize: 100,
          isCollapsible: true,
          collapsedSize: 40,
        },
        { id: 'second' },
      ]);

      pressKey('Enter');

      expect(getSizes()).toEqual([40, 560]);

      pressKey('Enter');

      expect(getSizes()).toEqual([200, 400]);
    });

    it('leaves a panel that cannot collapse alone on End', () => {
      const onCollapsedChange = vi.fn();

      renderSplitter([
        {
          id: 'first',
          minSize: 100,
          collapsedSize: 40,
          isCollapsed: true,
          onCollapsedChange,
        },
        { id: 'second' },
      ]);

      pressKey('End');

      expect(onCollapsedChange).not.toHaveBeenCalled();
    });

    it('leaves a panel that cannot collapse alone on Enter', () => {
      renderSplitter();

      pressKey('Enter');

      expect(getSizes()).toEqual([300, 300]);
    });

    it('moves focus between panels on F6', () => {
      renderSplitter();

      pressKey('F6');

      expect(screen.getByTestId('second')).toHaveFocus();

      pressKey('F6', 0, { shiftKey: true });

      expect(screen.getByTestId('first')).toHaveFocus();
    });

    it('mirrors the arrows in RTL', () => {
      render(
        <Provider locale="ar-AE">
          <Splitter data-testid="splitter">
            <Splitter.Panel>first</Splitter.Panel>
            <Splitter.Panel>second</Splitter.Panel>
          </Splitter>
        </Provider>
      );

      pressKey('ArrowRight');

      expect(getSizes()).toEqual([292, 308]);
    });

    it('does not resize while the splitter is disabled', () => {
      renderSplitter(TWO_PANELS, { isDisabled: true });

      pressKey('ArrowRight');

      expect(getSizes()).toEqual([300, 300]);
    });
  });

  describe('double click', () => {
    it('resets to the declared sizes and then takes the panel to its minimum', () => {
      renderSplitter([
        { id: 'first', size: 200, minSize: 100 },
        { id: 'second' },
      ]);

      pressKey('ArrowRight');

      expect(getSizes()).toEqual([208, 392]);

      fireEvent.doubleClick(getSeparator());

      expect(getSizes()).toEqual([200, 400]);

      fireEvent.doubleClick(getSeparator());

      expect(getSizes()).toEqual([100, 500]);
    });

    it('reports the reset as a null layout', () => {
      const onLayoutChange = vi.fn();

      renderSplitter(TWO_PANELS, { defaultLayout: [30, 70], onLayoutChange });

      fireEvent.doubleClick(getSeparator());

      expect(onLayoutChange).toHaveBeenCalledWith(null);
    });
  });

  describe('appearance and orientation', () => {
    it.each(['divider', 'transparent', 'handle'] as const)(
      'exposes the %s appearance',
      (appearance) => {
        renderSplitter(TWO_PANELS, { appearance });

        expect(getSplitter()).toHaveAttribute('data-appearance', appearance);
      }
    );

    it('exposes the orientation', () => {
      renderSplitter(TWO_PANELS, { orientation: 'vertical' });

      expect(getSplitter()).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  describe('robustness', () => {
    it('ends the drag when the host unmounts the panel it collapsed', () => {
      const Host = () => {
        const [isHidden, setHidden] = useState(false);

        return (
          <Splitter data-testid="splitter">
            {!isHidden && (
              <Splitter.Panel
                minSize={200}
                isCollapsible
                onCollapsedChange={setHidden}
              >
                first
              </Splitter.Panel>
            )}
            <Splitter.Panel>second</Splitter.Panel>
          </Splitter>
        );
      };

      render(<Host />);

      // The first move already crosses the midpoint, before the drag is rendered.
      drag([-210], { release: false });

      expect(screen.queryByText('first')).not.toBeInTheDocument();
      expect(getSplitter()).not.toHaveAttribute('data-resizing');
      expect(document.body.style.getPropertyValue('cursor')).toBe('');

      release();
    });

    it('drops a drag in progress when the splitter becomes disabled', () => {
      const onLayoutChange = vi.fn();
      const { update } = renderSplitter(TWO_PANELS, { onLayoutChange });

      drag([50], { release: false });
      update(TWO_PANELS, { onLayoutChange, isDisabled: true });

      expect(getSplitter()).not.toHaveAttribute('data-resizing');
      expect(document.body.style.getPropertyValue('cursor')).toBe('');

      onLayoutChange.mockClear();
      fireEvent.mouseMove(window, { button: 0, clientX: 100 });
      release();

      expect(onLayoutChange).not.toHaveBeenCalled();
    });

    it('leaves the layout alone while the splitter has no size', () => {
      mocks.width = 0;

      const onLayoutChange = vi.fn();

      renderSplitter(TWO_PANELS, { onLayoutChange });

      pressKey('ArrowRight');
      pressKey('End');
      fireEvent.doubleClick(getSeparator());

      expect(onLayoutChange).not.toHaveBeenCalled();

      resizeTo(CONTAINER_SIZE);

      expect(getSizes()).toEqual([300, 300]);
    });

    it('computes each key press from the layout on screen when the host declines it', () => {
      const onLayoutChange = vi.fn();

      renderSplitter(TWO_PANELS, { layout: [50, 50], onLayoutChange });

      pressKey('ArrowRight');
      pressKey('ArrowRight');

      expect(onLayoutChange).toHaveBeenCalledTimes(2);

      expect(onLayoutChange.mock.calls[1]).toEqual(
        onLayoutChange.mock.calls[0]
      );
    });

    it('starts a drag from the panels on screen when the host declined a collapse', () => {
      const onLayoutChange = vi.fn();

      renderSplitter(
        [
          {
            id: 'first',
            minSize: 100,
            isCollapsible: true,
            isCollapsed: false,
          },
          { id: 'second' },
        ],
        { onLayoutChange }
      );

      pressKey('Enter');
      drag([60]);

      expect(onLayoutChange).toHaveBeenLastCalledWith([60, 40]);
    });

    it('asks again for a collapsed state the host declined', () => {
      const onCollapsedChange = vi.fn();

      renderSplitter([
        {
          id: 'first',
          minSize: 100,
          isCollapsible: true,
          isCollapsed: false,
          onCollapsedChange,
        },
        { id: 'second' },
      ]);

      pressKey('Enter');
      pressKey('Enter');

      expect(onCollapsedChange.mock.calls).toEqual([[true], [true]]);
    });

    it('reads defaultCollapsed only once', () => {
      const panel = {
        id: 'first',
        minSize: 100,
        isCollapsible: true,
        collapsedSize: 40,
      };

      const { update } = renderSplitter([
        { ...panel, defaultCollapsed: true },
        { id: 'second' },
      ]);

      expect(getSizes()).toEqual([40, 560]);

      update([{ ...panel, defaultCollapsed: false }, { id: 'second' }]);

      expect(getSizes()).toEqual([40, 560]);
    });
  });

  describe('composition', () => {
    it('keeps the separators of a nested splitter to itself', () => {
      render(
        <Splitter data-testid="splitter">
          <Splitter.Panel>outer</Splitter.Panel>
          <Splitter.Panel>
            <Splitter data-testid="inner" orientation="vertical">
              <Splitter.Panel>top</Splitter.Panel>
              <Splitter.Panel>bottom</Splitter.Panel>
            </Splitter>
          </Splitter.Panel>
        </Splitter>
      );

      const [outer, inner] = getSeparators();

      expect(getSeparators()).toHaveLength(2);
      expect(outer).toHaveAttribute('aria-orientation', 'vertical');
      expect(inner).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('gives a panel wrapped in another element no separator', () => {
      render(
        <Splitter data-testid="splitter">
          <Splitter.Panel>first</Splitter.Panel>
          <div>
            <Splitter.Panel>wrapped</Splitter.Panel>
          </div>
        </Splitter>
      );

      expect(screen.queryAllByRole('separator')).toHaveLength(0);
    });

    it('skips conditional panels that are not rendered', () => {
      const show = false;

      render(
        <Splitter data-testid="splitter">
          <Splitter.Panel>first</Splitter.Panel>
          {show && <Splitter.Panel>hidden</Splitter.Panel>}
          <Splitter.Panel>last</Splitter.Panel>
        </Splitter>
      );

      expect(getSeparators()).toHaveLength(1);
      expect(getSizes()).toEqual([300, 300]);
    });
  });
});
