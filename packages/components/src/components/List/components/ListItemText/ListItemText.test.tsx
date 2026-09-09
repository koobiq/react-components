import { createRef } from 'react';

import {
  act,
  fireEvent,
  screen,
  render,
  waitFor,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

import { ListItemText, type ListItemTextProps } from './index';

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

  describe('overflow tooltips', () => {
    const longText = 'A long security incident description';
    const longCaption = 'Additional details about this incident';
    const user = userEvent.setup();
    let notifyResize: () => void;

    const hover = async (element: HTMLElement) => {
      fireEvent.pointerMove(element, { pointerType: 'mouse' });
      fireEvent.mouseMove(element);
      await user.hover(element);
    };

    beforeEach(() => {
      const resizeCallbacks: Array<() => void> = [];
      notifyResize = () => resizeCallbacks.forEach((callback) => callback());

      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(
        100
      );

      vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(
        function (this: HTMLElement) {
          return (this.textContent?.length ?? 0) * 10;
        }
      );

      class ResizeObserverMock {
        constructor(callback: ResizeObserverCallback) {
          resizeCallbacks.push(() =>
            callback(
              [
                {
                  contentRect: { width: 100, height: 20 },
                } as ResizeObserverEntry,
              ],
              this
            )
          );
        }

        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
      }

      vi.stubGlobal('ResizeObserver', ResizeObserverMock);
    });

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    it.each(['Short', '1234567890'])(
      'does not show a tooltip for fitting text: %s',
      async (text) => {
        render(<ListItemText>{text}</ListItemText>);
        await hover(screen.getByText(text));
        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      }
    );

    it('shows only the text of the hovered line, including formatted content', async () => {
      render(
        <ListItemText
          caption={longCaption}
          slotProps={{ caption: { ellipsis: true } }}
        >
          <strong>{longText}</strong>
        </ListItemText>
      );

      const text = screen.getByText(longText).parentElement!;
      const caption = screen.getByText(longCaption);

      await hover(text);
      const tooltip = await screen.findByRole('tooltip');
      expect(tooltip).toHaveTextContent(longText);
      expect(tooltip).not.toHaveTextContent(longCaption);
      expect(tooltip.querySelector('strong')).toBeNull();
      expect(tooltip).not.toHaveAttribute('data-arrow');
      expect(tooltip).toHaveStyle({ pointerEvents: 'none' });

      await user.unhover(text);

      await waitFor(() =>
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      );

      await hover(caption);
      expect(await screen.findByRole('tooltip')).toHaveTextContent(longCaption);
      expect(screen.getAllByRole('tooltip')).toHaveLength(1);
    });

    it.each(['text', 'caption'] as const)(
      'detects %s overflow independently',
      async (line) => {
        render(
          <ListItemText caption={line === 'caption' ? longCaption : 'Short'}>
            {line === 'text' ? longText : 'Short'}
          </ListItemText>
        );

        await hover(screen.getByText('Short'));
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

        const content = line === 'text' ? longText : longCaption;
        await hover(screen.getByText(content));
        expect(await screen.findByRole('tooltip')).toHaveTextContent(content);
      }
    );

    it('disables both tooltips and closes an open tooltip when hideTooltip changes', async () => {
      const { rerender } = render(
        <ListItemText caption={longCaption}>{longText}</ListItemText>
      );

      await hover(screen.getByText(longText));
      expect(await screen.findByRole('tooltip')).toBeInTheDocument();

      rerender(
        <ListItemText caption={longCaption} hideTooltip>
          {longText}
        </ListItemText>
      );

      await waitFor(() =>
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      );

      await hover(screen.getByText(longCaption));
      await new Promise((resolve) => setTimeout(resolve, 200));
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('updates the displayed text and closes when replacement text fits', async () => {
      const { rerender } = render(<ListItemText>{longText}</ListItemText>);
      const text = screen.getByText(longText);
      await hover(text);
      expect(await screen.findByRole('tooltip')).toHaveTextContent(longText);

      rerender(<ListItemText>{longCaption}</ListItemText>);
      expect(screen.getByRole('tooltip')).toHaveTextContent(longCaption);

      rerender(<ListItemText>Short</ListItemText>);

      await waitFor(() =>
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      );

      rerender(<ListItemText>{longText}</ListItemText>);
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
      await user.unhover(text);
      await hover(text);
      expect(await screen.findByRole('tooltip')).toHaveTextContent(longText);
    });

    it('closes when a resize makes the text fit', async () => {
      render(<ListItemText>{longText}</ListItemText>);
      await hover(screen.getByText(longText));
      expect(await screen.findByRole('tooltip')).toBeInTheDocument();

      vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(
        1000
      );

      act(() => notifyResize());

      await waitFor(() =>
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
      );
    });

    it('does not show a tooltip for vertical overflow or wrapped text', async () => {
      vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(
        100
      );

      vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(
        20
      );

      vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(
        40
      );

      render(
        <ListItemText slotProps={{ text: { ellipsis: false } }}>
          {longText}
        </ListItemText>
      );

      await hover(screen.getByText(longText));
      await new Promise((resolve) => setTimeout(resolve, 200));

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('preserves slot refs, handlers and props without adding a tab stop', async () => {
      const textRef = createRef<HTMLParagraphElement>();
      const captionRef = createRef<HTMLParagraphElement>();
      const onMouseEnter = vi.fn();

      render(
        <ListItemText
          caption={longCaption}
          slotProps={{
            text: {
              as: 'p',
              ref: textRef,
              onMouseEnter,
              className: 'custom-text',
              style: { color: 'red' },
            },
            caption: { ref: captionRef },
          }}
        >
          {longText}
        </ListItemText>
      );

      expect(textRef.current).toBe(screen.getByText(longText));
      expect(textRef.current?.tagName).toBe('P');
      expect(captionRef.current).toBe(screen.getByText(longCaption));
      expect(textRef.current).toHaveClass('custom-text');
      expect(textRef.current).toHaveStyle({ color: 'rgb(255, 0, 0)' });
      expect(textRef.current).not.toHaveAttribute('tabindex');

      await hover(textRef.current!);
      expect(onMouseEnter).toHaveBeenCalledOnce();
      expect(await screen.findByRole('tooltip')).toHaveTextContent(longText);
    });
  });
});
