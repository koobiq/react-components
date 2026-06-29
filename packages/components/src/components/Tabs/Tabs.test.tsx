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
      const { container, rerender } = render(renderComponent({}));

      const tabsList = container.querySelector(`.${s.tabList}`);
      const scrollBox = container.querySelector(`.${s.scrollBox}`);

      Object.defineProperty(tabsList, 'clientWidth', { value: 300 });
      Object.defineProperty(scrollBox, 'clientWidth', { value: 200 });

      rerender(renderComponent({}));

      expect(hasNextScrollButton(container)).toBe(true);
    });

    it('should NOT render the next button when tab-list <= scroll-box', () => {
      const { container, rerender } = render(renderComponent({}));

      const tabsList = container.querySelector(`.${s.tabList}`);
      const scrollBox = container.querySelector(`.${s.scrollBox}`);

      Object.defineProperty(tabsList, 'clientWidth', {
        value: 200,
        configurable: true,
      });

      Object.defineProperty(scrollBox, 'clientWidth', {
        value: 200,
        configurable: true,
      });

      rerender(renderComponent({}));
      expect(hasNextScrollButton(container)).toBe(false);

      Object.defineProperty(tabsList, 'clientWidth', { value: 199 });
      Object.defineProperty(scrollBox, 'clientWidth', { value: 200 });

      rerender(renderComponent({}));
      expect(hasNextScrollButton(container)).toBe(false);
    });

    it('should render next/prev buttons when content overflows and already scrolled', () => {
      const { container, rerender } = render(renderComponent({}));

      const tabsList = container.querySelector(`.${s.tabList}`);
      const scrollBox = container.querySelector(`.${s.scrollBox}`);

      Object.defineProperty(tabsList, 'clientWidth', { value: 300 });
      Object.defineProperty(scrollBox, 'clientWidth', { value: 200 });
      Object.defineProperty(scrollBox, 'scrollLeft', { value: 10 });

      rerender(renderComponent({}));

      expect(hasPrevScrollButton(container)).toBe(true);
      expect(hasNextScrollButton(container)).toBe(true);
    });

    it('should scroll vertically when selected tab is out of view', async () => {
      vi.useFakeTimers();

      try {
        const { container } = render(
          renderComponent({
            orientation: 'vertical',
            selectedKey: '4',
          })
        );

        const scrollBox = container.querySelector(
          `.${s.scrollBox}`
        ) as HTMLElement;

        const selectedTab = screen.getByRole('tab', { selected: true });

        Object.defineProperty(scrollBox, 'scrollTop', {
          value: 0,
          configurable: true,
          writable: true,
        });

        vi.spyOn(scrollBox, 'getBoundingClientRect').mockReturnValue({
          top: 0,
          bottom: 100,
          left: 0,
          right: 200,
        } as DOMRect);

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

    describe('scroll buttons behavior', () => {
      vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
        cb(0);

        return 0;
      });

      vi.spyOn(global.Math, 'min').mockReturnValue(1);

      it('should scroll to right when clicking the next button', () => {
        const { container, rerender } = render(renderComponent({}));

        const tabsList = container.querySelector(`.${s.tabList}`);
        const scrollBox = container.querySelector(`.${s.scrollBox}`);

        Object.defineProperty(tabsList, 'clientWidth', { value: 300 });
        Object.defineProperty(scrollBox, 'clientWidth', { value: 200 });

        Object.defineProperty(scrollBox, 'scrollLeft', {
          value: 0,
          configurable: true,
          writable: true,
        });

        rerender(renderComponent({}));

        const nextScrollButton = findScrollButton(container, ariaLabelNextBtn);

        if (nextScrollButton) fireEvent.click(nextScrollButton);

        expect(Number(scrollBox?.scrollLeft) > 0).toBeTruthy();
      });
    });

    it('should scroll to left when clicking the prev button', () => {
      const { container, rerender } = render(renderComponent({}));

      const tabsList = container.querySelector(`.${s.tabList}`);
      const scrollBox = container.querySelector(`.${s.scrollBox}`);

      Object.defineProperty(tabsList, 'clientWidth', { value: 300 });
      Object.defineProperty(scrollBox, 'clientWidth', { value: 200 });

      Object.defineProperty(scrollBox, 'scrollLeft', {
        value: 100,
        configurable: true,
        writable: true,
      });

      rerender(renderComponent({}));

      const prevScrollButton = findScrollButton(container, ariaLabelPrevBtn);

      if (prevScrollButton) fireEvent.click(prevScrollButton);

      expect(Number(scrollBox?.scrollLeft) < 100).toBeTruthy();
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
});
