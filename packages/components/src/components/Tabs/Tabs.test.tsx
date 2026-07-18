import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tabs, Tab, type TabsProps } from './index';
import s from './Tabs.module.css';

const TAB__TEST_ID = 'TAB';

const renderComponent = ({
  selectedKey,
  onSelectionChange,
  ...restProps
}: Omit<TabsProps<object>, 'children'>) => (
  <Tabs
    aria-label="tabs"
    onSelectionChange={onSelectionChange}
    selectedKey={selectedKey}
    {...restProps}
  >
    <Tab key={1}>tab-1</Tab>
    <Tab key={2} data-testid={TAB__TEST_ID}>
      tab-2
    </Tab>
    <Tab key={3}>tab-3</Tab>
    <Tab key={4}>tab-4</Tab>
  </Tabs>
);

describe('Tabs', () => {
  it('should set a dataTestId', () => {
    const dataTestId = 'data-test-id';

    const { getByTestId } = render(
      renderComponent({
        'data-testid': dataTestId,
      })
    );

    expect(getByTestId(dataTestId)).toBeInTheDocument();
  });

  it('should set a className', () => {
    const className = 'foo';

    const { container } = render(
      renderComponent({
        className,
      })
    );

    expect(container.firstElementChild).toHaveClass(className);
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    const { container } = render(
      renderComponent({
        style,
      })
    );

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle({ padding: '20px' });
  });

  it('should onChange get correct id', async () => {
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        onSelectionChange,
        selectedKey: 1,
      })
    );

    await userEvent.click(screen.getByTestId(TAB__TEST_ID));

    expect(onSelectionChange).toBeCalledWith('2');
  });

  it('should render the tab title separately from the panel content', () => {
    render(
      <Tabs aria-label="tabs">
        <Tab key="overview" title="Overview">
          Overview content
        </Tab>
      </Tabs>
    );

    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Overview content')).toBeInTheDocument();
  });

  it('should render startAddon and endAddon', () => {
    render(
      <Tabs aria-label="tabs">
        <Tab
          key="overview"
          startAddon={<span>start-addon</span>}
          endAddon={<span>end-addon</span>}
        >
          Overview
        </Tab>
      </Tabs>
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('start-addon')).toBeInTheDocument();
    expect(screen.getByText('end-addon')).toBeInTheDocument();
  });

  it('should render an icon-only tab with panel content', () => {
    render(
      <Tabs aria-label="tabs">
        <Tab
          key="indicator"
          aria-label="Threat indicator"
          onlyIcon
          startAddon={<span>icon</span>}
        >
          Indicator panel content
        </Tab>
      </Tabs>
    );

    const tab = screen.getByRole('tab', { name: 'Threat indicator' });

    expect(tab).toBeInTheDocument();
    expect(tab).not.toHaveTextContent('Indicator panel content');

    expect(screen.getByText('icon')).toBeInTheDocument();
    expect(screen.getByText('Indicator panel content')).toBeInTheDocument();
  });

  it('should fallback orientation to horizontal and warn when isUnderlined + vertical', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const MSG =
      '[koobiq] Tabs: the tabs with isUnderlined do not support vertical orientation.';

    const { container } = render(
      renderComponent({
        isUnderlined: true,
        orientation: 'vertical',
      })
    );

    const root = container.querySelector('div');
    expect(root).toHaveAttribute('data-orientation', 'horizontal');

    expect(warnSpy).toHaveBeenCalledWith(MSG);
    expect(warnSpy).toHaveBeenCalledTimes(1);

    warnSpy.mockRestore();
  });

  describe('scrolling', () => {
    const ariaLabelPrevBtn = 'Previous tabs';
    const ariaLabelNextBtn = 'Next tabs';

    const findScrollButton = (container: HTMLElement, labelText: string) =>
      container.querySelector(`button[aria-label="${labelText}"]`);

    const hasPrevScrollButton = (container: HTMLElement) =>
      !!findScrollButton(container, ariaLabelPrevBtn);

    const hasNextScrollButton = (container: HTMLElement) =>
      !!findScrollButton(container, ariaLabelNextBtn);

    const firePointerEvent = (
      element: Element,
      type: string,
      {
        pointerId,
        pointerType,
        ...eventInit
      }: MouseEventInit & { pointerId: number; pointerType: string }
    ) => {
      const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        ...eventInit,
      });

      Object.defineProperties(event, {
        pointerId: { value: pointerId },
        pointerType: { value: pointerType },
      });

      fireEvent(element, event);
    };

    // Mock scrollTo method (jsdom doesn't support scrolling)
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      value(options?: ScrollToOptions | number, y?: number) {
        if (typeof options === 'object' && options !== null) {
          if (typeof options.left === 'number') {
            this.scrollLeft = options.left;
          }

          if (typeof options.top === 'number') {
            this.scrollTop = options.top;
          }
        } else if (typeof options === 'number') {
          this.scrollLeft = options;
          if (typeof y === 'number') this.scrollTop = y;
        }
      },
      writable: true,
    });

    it('should render the next button when tab-list > scroll-box', () => {
      const { container } = render(renderComponent({}));

      const scrollBox = container.querySelector(`.${s.scrollBox}`);

      Object.defineProperty(scrollBox, 'clientWidth', { value: 200 });
      Object.defineProperty(scrollBox, 'scrollWidth', { value: 300 });

      if (scrollBox) fireEvent.scroll(scrollBox);

      expect(hasNextScrollButton(container)).toBe(true);
    });

    it('should NOT render the next button when tab-list <= scroll-box', () => {
      const { container } = render(renderComponent({}));

      const scrollBox = container.querySelector(`.${s.scrollBox}`);

      Object.defineProperty(scrollBox, 'clientWidth', {
        value: 200,
        configurable: true,
      });

      Object.defineProperty(scrollBox, 'scrollWidth', {
        value: 200,
        configurable: true,
      });

      if (scrollBox) fireEvent.scroll(scrollBox);

      expect(hasNextScrollButton(container)).toBe(false);

      Object.defineProperty(scrollBox, 'scrollWidth', { value: 199 });

      if (scrollBox) fireEvent.scroll(scrollBox);

      expect(hasNextScrollButton(container)).toBe(false);
    });

    it('should render next/prev buttons when content overflows and already scrolled', () => {
      const { container } = render(renderComponent({}));

      const scrollBox = container.querySelector(`.${s.scrollBox}`);

      Object.defineProperty(scrollBox, 'clientWidth', { value: 200 });
      Object.defineProperty(scrollBox, 'scrollWidth', { value: 300 });

      Object.defineProperty(scrollBox, 'scrollLeft', {
        value: 10,
        configurable: true,
        writable: true,
      });

      if (scrollBox) fireEvent.scroll(scrollBox);

      expect(hasPrevScrollButton(container)).toBe(true);
      expect(hasNextScrollButton(container)).toBe(true);
    });

    it('should keep overflow attributes in sync when orientation changes', () => {
      const { container, rerender } = render(renderComponent({}));

      let root = container.firstElementChild;
      let scrollBox = container.querySelector(`.${s.scrollBox}`);

      Object.defineProperty(scrollBox, 'clientWidth', {
        value: 200,
        configurable: true,
      });

      Object.defineProperty(scrollBox, 'scrollWidth', {
        value: 300,
        configurable: true,
      });

      if (scrollBox) fireEvent.scroll(scrollBox);

      expect(root).toHaveAttribute('data-horizontal-scrollable', 'true');
      expect(root).not.toHaveAttribute('data-vertical-scrollable');
      expect(scrollBox).toHaveAttribute('data-overflow-inline-end', 'true');
      expect(scrollBox).not.toHaveAttribute('data-overflow-block-end');

      rerender(renderComponent({ orientation: 'vertical' }));

      root = container.firstElementChild;
      scrollBox = container.querySelector(`.${s.scrollBox}`);

      expect(root).not.toHaveAttribute('data-horizontal-scrollable');
      expect(scrollBox).not.toHaveAttribute('data-overflow-inline-end');

      Object.defineProperty(scrollBox, 'clientHeight', {
        value: 200,
        configurable: true,
      });

      Object.defineProperty(scrollBox, 'scrollHeight', {
        value: 300,
        configurable: true,
      });

      if (scrollBox) fireEvent.scroll(scrollBox);

      expect(root).toHaveAttribute('data-vertical-scrollable', 'true');
      expect(root).not.toHaveAttribute('data-horizontal-scrollable');
      expect(scrollBox).toHaveAttribute('data-overflow-block-end', 'true');
      expect(scrollBox).not.toHaveAttribute('data-overflow-inline-end');

      rerender(renderComponent({}));

      root = container.firstElementChild;
      scrollBox = container.querySelector(`.${s.scrollBox}`);

      expect(root).not.toHaveAttribute('data-vertical-scrollable');
      expect(scrollBox).not.toHaveAttribute('data-overflow-block-end');
    });

    it('should scroll vertically when selected tab is out of view', async () => {
      vi.useFakeTimers();

      try {
        const { container, rerender } = render(
          renderComponent({
            orientation: 'vertical',
            selectedKey: '1',
          })
        );

        const scrollBox = container.querySelector(
          `.${s.scrollBox}`
        ) as HTMLElement;

        Object.defineProperty(scrollBox, 'scrollTop', {
          value: 0,
          configurable: true,
          writable: true,
        });

        Object.defineProperty(scrollBox, 'clientHeight', {
          value: 100,
          configurable: true,
        });

        Object.defineProperty(scrollBox, 'scrollHeight', {
          value: 200,
          configurable: true,
        });

        vi.spyOn(scrollBox, 'getBoundingClientRect').mockReturnValue({
          top: 0,
          bottom: 100,
          left: 0,
          right: 200,
        } as DOMRect);

        fireEvent.scroll(scrollBox);

        rerender(
          renderComponent({
            orientation: 'vertical',
            selectedKey: '4',
          })
        );

        const selectedTab = screen.getByRole('tab', { selected: true });

        vi.spyOn(selectedTab, 'getBoundingClientRect').mockReturnValue({
          top: 120,
          bottom: 160,
          left: 0,
          right: 200,
        } as DOMRect);

        await act(async () => {
          await vi.advanceTimersByTimeAsync(100);
        });

        expect(scrollBox.scrollTop).toBe(60);
      } finally {
        vi.useRealTimers();
      }
    });

    it('should not correct scroll when there is no overflow', async () => {
      vi.useFakeTimers();

      try {
        const { container, rerender } = render(
          renderComponent({
            orientation: 'vertical',
            selectedKey: '1',
          })
        );

        const scrollBox = container.querySelector(
          `.${s.scrollBox}`
        ) as HTMLElement;

        Object.defineProperty(scrollBox, 'scrollTop', {
          value: 0,
          configurable: true,
          writable: true,
        });

        Object.defineProperty(scrollBox, 'clientHeight', {
          value: 100,
          configurable: true,
        });

        Object.defineProperty(scrollBox, 'scrollHeight', {
          value: 100,
          configurable: true,
        });

        vi.spyOn(scrollBox, 'getBoundingClientRect').mockReturnValue({
          top: 0,
          bottom: 100,
          left: 0,
          right: 200,
        } as DOMRect);

        rerender(
          renderComponent({
            orientation: 'vertical',
            selectedKey: '4',
          })
        );

        const selectedTab = screen.getByRole('tab', { selected: true });

        vi.spyOn(selectedTab, 'getBoundingClientRect').mockReturnValue({
          top: 120,
          bottom: 160,
          left: 0,
          right: 200,
        } as DOMRect);

        await act(async () => {
          await vi.advanceTimersByTimeAsync(100);
        });

        expect(scrollBox.scrollTop).toBe(0);
      } finally {
        vi.useRealTimers();
      }
    });

    describe('scroll buttons behavior', () => {
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        const id = window.setTimeout(() => cb(performance.now()), 0);

        return id;
      });

      vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
        window.clearTimeout(id);
      });

      vi.spyOn(global.Math, 'min').mockReturnValue(1);

      it('should scroll to right when clicking the next button', () => {
        const { container } = render(renderComponent({}));

        const scrollBox = container.querySelector(`.${s.scrollBox}`);

        Object.defineProperty(scrollBox, 'clientWidth', { value: 200 });
        Object.defineProperty(scrollBox, 'scrollWidth', { value: 300 });

        Object.defineProperty(scrollBox, 'scrollLeft', {
          value: 0,
          configurable: true,
          writable: true,
        });

        if (scrollBox) fireEvent.scroll(scrollBox);

        const nextScrollButton = findScrollButton(container, ariaLabelNextBtn);

        if (nextScrollButton) fireEvent.click(nextScrollButton);

        expect(Number(scrollBox?.scrollLeft) > 0).toBeTruthy();
      });
    });

    it('should scroll to left when clicking the prev button', () => {
      const { container } = render(renderComponent({}));

      const scrollBox = container.querySelector(`.${s.scrollBox}`);

      Object.defineProperty(scrollBox, 'clientWidth', { value: 200 });
      Object.defineProperty(scrollBox, 'scrollWidth', { value: 300 });

      Object.defineProperty(scrollBox, 'scrollLeft', {
        value: 100,
        configurable: true,
        writable: true,
      });

      if (scrollBox) fireEvent.scroll(scrollBox);

      const prevScrollButton = findScrollButton(container, ariaLabelPrevBtn);

      if (prevScrollButton) fireEvent.click(prevScrollButton);

      expect(Number(scrollBox?.scrollLeft) < 100).toBeTruthy();
    });

    it('should drag horizontal tabs with the primary mouse button', () => {
      const { container } = render(renderComponent({}));

      const scrollBox = container.querySelector(
        `.${s.scrollBox}`
      ) as HTMLElement;

      Object.defineProperty(scrollBox, 'scrollLeft', {
        value: 100,
        configurable: true,
        writable: true,
      });

      Object.defineProperty(scrollBox, 'clientWidth', { value: 100 });
      Object.defineProperty(scrollBox, 'scrollWidth', { value: 300 });
      fireEvent.scroll(scrollBox);

      firePointerEvent(scrollBox, 'pointerdown', {
        pointerId: 1,
        pointerType: 'mouse',
        button: 0,
        clientX: 100,
      });

      firePointerEvent(scrollBox, 'pointermove', {
        pointerId: 1,
        pointerType: 'mouse',
        clientX: 60,
      });

      expect(scrollBox.scrollLeft).toBe(140);
      expect(scrollBox).toHaveAttribute('data-dragging', 'true');

      firePointerEvent(scrollBox, 'pointercancel', {
        pointerId: 1,
        pointerType: 'mouse',
      });

      expect(scrollBox).not.toHaveAttribute('data-dragging');
    });

    it('should not drag non-overflowing, vertical, or touch tabs', () => {
      const { container, rerender } = render(
        renderComponent({ orientation: 'vertical' })
      );

      let scrollBox = container.querySelector(`.${s.scrollBox}`) as HTMLElement;

      Object.defineProperty(scrollBox, 'scrollLeft', {
        value: 100,
        configurable: true,
        writable: true,
      });

      firePointerEvent(scrollBox, 'pointerdown', {
        pointerId: 1,
        pointerType: 'mouse',
        button: 0,
        clientX: 100,
      });

      firePointerEvent(scrollBox, 'pointermove', {
        pointerId: 1,
        pointerType: 'mouse',
        clientX: 60,
      });

      expect(scrollBox.scrollLeft).toBe(100);

      scrollBox.scrollLeft = 0;
      rerender(renderComponent({}));

      scrollBox = container.querySelector(`.${s.scrollBox}`) as HTMLElement;

      firePointerEvent(scrollBox, 'pointerdown', {
        pointerId: 2,
        pointerType: 'mouse',
        button: 0,
        clientX: 100,
      });

      firePointerEvent(scrollBox, 'pointermove', {
        pointerId: 2,
        pointerType: 'mouse',
        clientX: 60,
      });

      expect(scrollBox.scrollLeft).toBe(0);

      Object.defineProperty(scrollBox, 'clientWidth', { value: 100 });
      Object.defineProperty(scrollBox, 'scrollWidth', { value: 300 });
      scrollBox.scrollLeft = 100;
      fireEvent.scroll(scrollBox);

      firePointerEvent(scrollBox, 'pointerdown', {
        pointerId: 3,
        pointerType: 'touch',
        button: 0,
        clientX: 100,
      });

      firePointerEvent(scrollBox, 'pointermove', {
        pointerId: 3,
        pointerType: 'touch',
        clientX: 60,
      });

      expect(scrollBox.scrollLeft).toBe(100);
    });

    it('should not select a tab when its pointer interaction becomes a drag', () => {
      const onSelectionChange = vi.fn();

      const { container } = render(
        renderComponent({ selectedKey: 1, onSelectionChange })
      );

      const scrollBox = container.querySelector(
        `.${s.scrollBox}`
      ) as HTMLElement;

      const tab = screen.getByTestId(TAB__TEST_ID);

      Object.defineProperty(scrollBox, 'clientWidth', { value: 100 });
      Object.defineProperty(scrollBox, 'scrollWidth', { value: 300 });
      fireEvent.scroll(scrollBox);

      firePointerEvent(tab, 'pointerdown', {
        pointerId: 1,
        pointerType: 'mouse',
        button: 0,
        clientX: 100,
      });

      // React Aria uses mouse events as a PointerEvent fallback in JSDOM.
      fireEvent.mouseDown(tab, { button: 0, clientX: 100 });

      expect(onSelectionChange).not.toHaveBeenCalled();

      firePointerEvent(scrollBox, 'pointermove', {
        pointerId: 1,
        pointerType: 'mouse',
        clientX: 60,
      });

      firePointerEvent(scrollBox, 'pointerup', {
        pointerId: 1,
        pointerType: 'mouse',
        button: 0,
        clientX: 60,
      });

      fireEvent.mouseUp(scrollBox, { button: 0, clientX: 60 });
      fireEvent.click(tab);

      expect(onSelectionChange).not.toHaveBeenCalled();
    });

    it('should select an overflowed tab when a mouse press is released without dragging', () => {
      const onSelectionChange = vi.fn();

      const { container } = render(
        renderComponent({ selectedKey: 1, onSelectionChange })
      );

      const scrollBox = container.querySelector(
        `.${s.scrollBox}`
      ) as HTMLElement;

      const tab = screen.getByTestId(TAB__TEST_ID);

      Object.defineProperty(scrollBox, 'clientWidth', { value: 100 });
      Object.defineProperty(scrollBox, 'scrollWidth', { value: 300 });
      fireEvent.scroll(scrollBox);

      fireEvent.mouseDown(tab, { button: 0 });

      expect(onSelectionChange).not.toHaveBeenCalled();

      fireEvent.mouseUp(tab, { button: 0 });
      fireEvent.click(tab);

      expect(onSelectionChange).toHaveBeenCalledOnce();
      expect(onSelectionChange).toHaveBeenCalledWith('2');
    });

    it('should keep scrolling with inertia after mouse release', () => {
      let frameCallback: FrameRequestCallback | undefined;

      const requestAnimationFrameSpy = vi
        .spyOn(window, 'requestAnimationFrame')
        .mockImplementation((callback) => {
          frameCallback = callback;

          return 1;
        });

      const { container } = render(renderComponent({}));

      const scrollBox = container.querySelector(
        `.${s.scrollBox}`
      ) as HTMLElement;

      Object.defineProperty(scrollBox, 'scrollLeft', {
        value: 100,
        configurable: true,
        writable: true,
      });

      Object.defineProperty(scrollBox, 'clientWidth', { value: 100 });
      Object.defineProperty(scrollBox, 'scrollWidth', { value: 300 });
      fireEvent.scroll(scrollBox);

      firePointerEvent(scrollBox, 'pointerdown', {
        pointerId: 1,
        pointerType: 'mouse',
        button: 0,
        clientX: 100,
      });

      firePointerEvent(scrollBox, 'pointermove', {
        pointerId: 1,
        pointerType: 'mouse',
        clientX: 60,
      });

      firePointerEvent(scrollBox, 'pointerup', {
        pointerId: 1,
        pointerType: 'mouse',
        button: 0,
        clientX: 60,
      });

      const scrollLeftAfterDrag = scrollBox.scrollLeft;

      act(() => frameCallback?.(16));

      expect(scrollBox.scrollLeft).toBeGreaterThan(scrollLeftAfterDrag);

      requestAnimationFrameSpy.mockRestore();
    });
  });
});

describe('Tabs editable', () => {
  const removeLabel = 'Remove tab';
  const addLabel = 'Add tab';

  it('does not render close buttons without onRemove', () => {
    render(renderComponent({}));

    expect(
      screen.queryByRole('button', { name: removeLabel })
    ).not.toBeInTheDocument();
  });

  it('renders a close button on every tab when onRemove is provided', () => {
    render(renderComponent({ onRemove: vi.fn() }));

    expect(screen.getAllByRole('button', { name: removeLabel })).toHaveLength(
      4
    );
  });

  it('calls onRemove with the tab key when its close button is pressed', async () => {
    const onRemove = vi.fn();

    render(renderComponent({ onRemove }));

    const tab = screen.getByTestId(TAB__TEST_ID);
    const closeButton = within(tab).getByRole('button', { name: removeLabel });

    await userEvent.click(closeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);

    const keys = onRemove.mock.calls[0][0];

    expect(keys).toBeInstanceOf(Set);
    expect([...keys]).toEqual(['2']);
  });

  it('does not change selection when a close button is pressed', async () => {
    const onSelectionChange = vi.fn();
    const onRemove = vi.fn();

    render(renderComponent({ onRemove, onSelectionChange, selectedKey: 1 }));

    const tab = screen.getByTestId(TAB__TEST_ID);
    const closeButton = within(tab).getByRole('button', { name: removeLabel });

    await userEvent.click(closeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
    // pressing × must not activate the tab it belongs to
    expect(onSelectionChange).not.toHaveBeenCalledWith('2');
  });

  it('removes the focused tab on Delete', async () => {
    const onRemove = vi.fn();

    render(renderComponent({ onRemove }));

    act(() => screen.getByRole('tab', { name: 'tab-2' }).focus());
    await userEvent.keyboard('{Delete}');

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect([...onRemove.mock.calls[0][0]]).toEqual(['2']);
  });

  it('does not render the add button without onAdd', () => {
    render(renderComponent({}));

    expect(
      screen.queryByRole('button', { name: addLabel })
    ).not.toBeInTheDocument();
  });

  it('calls onAdd when the add button is pressed', async () => {
    const onAdd = vi.fn();

    render(renderComponent({ onAdd }));

    await userEvent.click(screen.getByRole('button', { name: addLabel }));

    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('does not call onAdd when tabs are disabled', async () => {
    const onAdd = vi.fn();

    render(renderComponent({ isDisabled: true, onAdd }));

    const addButton = screen.getByRole('button', { name: addLabel });

    expect(addButton).toBeDisabled();

    await userEvent.click(addButton);

    expect(onAdd).not.toHaveBeenCalled();
  });
});
