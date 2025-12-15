import { fireEvent, render, screen } from '@testing-library/react';
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
