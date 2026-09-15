import { createRef, useRef } from 'react';

import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ListItemText, type ListItemTextProps } from './index';
import { ListItemContext } from './ListItemContext';

describe('ListItemText', () => {
  const baseProps: ListItemTextProps = {
    children: 'content',
    caption: 'caption',
    'data-testid': 'root',
  };

  const getRoot = (): HTMLElement => screen.getByTestId('root');

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ListItemText {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const props = {
      ...baseProps,
      className: 'foo',
    };

    render(<ListItemText {...props} />);

    expect(getRoot()).toHaveClass('foo');
  });

  describe('overflow tooltip', () => {
    // With the mocks below, a string longer than 10 characters is cut off.
    const longText = 'A long security incident description';
    const longCaption = 'Additional details about this incident';
    const shortText = 'Short';

    const queryTooltip = () => screen.queryByRole('tooltip');

    type ItemProps = ListItemTextProps & {
      isHovered?: boolean;
      hasSubmenu?: boolean;
    };

    function Item({ isHovered = false, hasSubmenu, ...props }: ItemProps) {
      const ref = useRef<HTMLDivElement>(null);

      return (
        <div ref={ref}>
          <ListItemContext.Provider value={{ ref, isHovered, hasSubmenu }}>
            <ListItemText showOverflowTooltip {...props} />
          </ListItemContext.Provider>
        </div>
      );
    }

    // The text is measured when the item gets hovered, so render it first.
    const renderHovered = (props: ItemProps) => {
      const result = render(<Item {...props} />);
      result.rerender(<Item {...props} isHovered />);

      return result;
    };

    beforeEach(() => {
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(
        100
      );

      vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(
        function (this: HTMLElement) {
          return (this.textContent?.length ?? 0) * 10;
        }
      );
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('does not show a tooltip unless showOverflowTooltip is set', () => {
      renderHovered({ children: longText, showOverflowTooltip: false });

      expect(queryTooltip()).not.toBeInTheDocument();
    });

    it('does not show a tooltip outside a list item', () => {
      const { rerender } = render(
        <ListItemText showOverflowTooltip>{longText}</ListItemText>
      );

      rerender(<ListItemText showOverflowTooltip>{longText}</ListItemText>);

      expect(queryTooltip()).not.toBeInTheDocument();
    });

    it('does not show a tooltip while the item is not hovered', () => {
      const { rerender } = render(<Item>{longText}</Item>);

      rerender(<Item>{longText}</Item>);

      expect(queryTooltip()).not.toBeInTheDocument();
    });

    it.each([
      { cutOff: 'the text', children: longText, caption: shortText },
      { cutOff: 'the caption', children: shortText, caption: longCaption },
    ])(
      'shows only $cutOff when only it is cut off',
      ({ children, caption }) => {
        renderHovered({ children, caption });

        expect(screen.getByRole('tooltip').textContent).toBe(
          children === longText ? longText : longCaption
        );
      }
    );

    it('shows the text and the caption on separate lines when both are cut off', () => {
      renderHovered({ children: longText, caption: longCaption });

      const tooltip = screen.getByRole('tooltip');

      expect(tooltip.textContent).toBe(`${longText}\n${longCaption}`);
      expect(tooltip).toHaveStyle({ whiteSpace: 'pre-line' });
    });

    it('does not show a tooltip when nothing is cut off', () => {
      renderHovered({ children: shortText, caption: shortText });

      expect(queryTooltip()).not.toBeInTheDocument();
    });

    it('places the tooltip to the right of the item and ignores the pointer', () => {
      renderHovered({ children: longText });

      const tooltip = screen.getByRole('tooltip');

      expect(tooltip).toHaveAttribute('data-placement', 'right');
      expect(tooltip).toHaveStyle({ pointerEvents: 'none' });
    });

    it('places the tooltip above an item that opens a submenu', () => {
      renderHovered({ children: longText, hasSubmenu: true });

      expect(screen.getByRole('tooltip')).toHaveAttribute(
        'data-placement',
        'top'
      );
    });

    it('closes at once when the item is no longer hovered', () => {
      const { rerender } = renderHovered({ children: longText });

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      rerender(<Item>{longText}</Item>);

      expect(queryTooltip()).not.toBeInTheDocument();
    });

    it('measures the current text when the item gets hovered', () => {
      const { rerender } = renderHovered({ children: shortText });

      expect(queryTooltip()).not.toBeInTheDocument();

      rerender(<Item>{longText}</Item>);
      rerender(<Item isHovered>{longText}</Item>);

      expect(screen.getByRole('tooltip')).toHaveTextContent(longText);
    });

    it('measures the current width when the item gets hovered', () => {
      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(
        1000
      );

      renderHovered({ children: longText });

      expect(queryTooltip()).not.toBeInTheDocument();
    });
  });
});
