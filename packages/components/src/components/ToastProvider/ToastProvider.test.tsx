import { createRef } from 'react';

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';

import { toast, ToastProvider } from '../index';

const title = 'Testing Title';
const caption = 'Testing Caption';

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    // HACK: Temporary workaround for a bug in @testing-library/react when
    // using  @testing-library/user-event with fake timers.
    // https://github.com/testing-library/react-testing-library/issues/1197
    const originalJest = globalThis.jest;

    globalThis.jest = {
      ...globalThis.jest,
      advanceTimersByTime: vi.advanceTimersByTime.bind(vi),
    };

    return () => {
      globalThis.jest = originalJest;
    };
  });

  afterEach(() => {
    act(() => {
      vi.runAllTimers();
    });

    vi.useRealTimers();
  });

  const user = userEvent.setup({ delay: null });

  describe('ToastRegion', () => {
    it('should merge a custom class name with the default ones', async () => {
      const className = 'foo';

      const wrapper = render(
        <>
          <ToastProvider className="foo" />
          <button
            data-testid="button"
            onClick={() => {
              toast.add({
                title: 'toast title',
                caption: 'toast description',
              });
            }}
          >
            Show Toast
          </button>
        </>
      );

      const button = screen.getByTestId('button');

      await user.click(button);

      const component = wrapper.getAllByRole('region')[0]! as HTMLElement;

      expect(component?.className).toContain(className);
    });

    it('should set a custom style', async () => {
      const style = { padding: 20 };

      const wrapper = render(
        <>
          <ToastProvider style={style} />
          <button
            data-testid="button"
            onClick={() => {
              toast.add({
                title: 'toast title',
                caption: 'toast description',
              });
            }}
          >
            Show Toast
          </button>
        </>
      );

      const button = wrapper.getByTestId('button');

      await user.click(button);

      const component = wrapper.getAllByRole('region')[0]! as HTMLElement;
      expect(component).toHaveStyle({ padding: '20px' });
    });
  });

  it('should render correctly', () => {
    const wrapper = render(
      <>
        <ToastProvider />
        <button
          onClick={() => {
            toast.add({
              title: 'toast title',
              caption: 'toast description',
            });
          }}
        >
          Show Toast
        </button>
      </>
    );

    expect(() => wrapper.unmount()).not.toThrow();
  });

  it('ref should be forwarded', async () => {
    const ref = createRef<HTMLDivElement>();

    const wrapper = render(
      <>
        <ToastProvider />
        <button
          data-testid="button"
          onClick={() => {
            toast.add({
              title: 'toast title',
              caption: 'toast description',
              ref,
            });
          }}
        >
          Show Toast
        </button>
      </>
    );

    const button = wrapper.getByTestId('button');

    await user.click(button);
    expect(ref.current).not.toBeNull();
  });

  it('should merge a custom class name with the default ones', async () => {
    const className = 'foo';

    const wrapper = render(
      <>
        <ToastProvider />
        <button
          data-testid="button"
          onClick={() => {
            toast.add({
              title: 'toast title',
              caption: 'toast description',
              props: {
                className,
              },
            });
          }}
        >
          Show Toast
        </button>
      </>
    );

    const button = wrapper.getByTestId('button');

    await user.click(button);

    const component = wrapper.getAllByRole('alertdialog')[0]! as HTMLElement;

    expect(component?.className).toContain(className);
  });

  it('should set a custom style', async () => {
    const style = { padding: 20 };

    const wrapper = render(
      <>
        <ToastProvider />
        <button
          data-testid="button"
          onClick={() => {
            toast.add({
              title: 'toast title',
              caption: 'toast description',
              props: {
                style,
              },
            });
          }}
        >
          Show Toast
        </button>
      </>
    );

    const button = wrapper.getByTestId('button');

    await user.click(button);

    const component = wrapper.getAllByRole('alertdialog')[0]! as HTMLElement;
    expect(component).toHaveStyle({ padding: '20px' });
  });

  it('should display title and caption when component is rendered', async () => {
    const wrapper = render(
      <>
        <ToastProvider />
        <button
          data-testid="button"
          onClick={() => {
            toast.add({
              title,
              caption,
            });
          }}
        >
          Show Toast
        </button>
      </>
    );

    const button = wrapper.getByTestId('button');

    await user.click(button);

    const region = screen.getByRole('region');

    expect(region).toContainHTML(title);
    expect(region).toContainHTML(caption);

    await user.click(wrapper.getAllByRole('button')[0]);
  });

  it('should work with placement', async () => {
    const wrapper = render(
      <>
        <ToastProvider placement="bottom-start" />
        <button
          data-testid="button"
          onClick={() => {
            toast.add({
              title,
              caption,
            });
          }}
        >
          Show Toast
        </button>
      </>
    );

    const button = wrapper.getByTestId('button');

    await user.click(button);

    const region = screen.getByRole('region');

    expect(region).toHaveAttribute('data-placement', 'bottom-start');
  });

  it('should call onClose when toast times out', async () => {
    const onCloseMock = vi.fn();
    const timeout = 5000;

    const wrapper = render(
      <>
        <ToastProvider />
        <button
          data-testid="button"
          onClick={() => {
            toast.add({
              title,
              caption,
              timeout,
              onClose: onCloseMock,
            });
          }}
        >
          Show Toast
        </button>
      </>
    );

    const button = wrapper.getByTestId('button');

    await user.click(button);

    act(() => {
      vi.advanceTimersByTime(timeout);
    });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close button is clicked', async () => {
    const onCloseMock = vi.fn();

    const wrapper = render(
      <>
        <ToastProvider />
        <button
          data-testid="button"
          onClick={() => {
            toast.add({
              title,
              caption,
              onClose: onCloseMock,
            });
          }}
        >
          Show Toast
        </button>
      </>
    );

    const button = wrapper.getByTestId('button');

    await user.click(button);

    const buttons = wrapper.getAllByRole('button');

    const closeButton = buttons[1];

    await user.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should close', async () => {
    const wrapper = render(
      <>
        <ToastProvider />
        <button
          data-testid="button"
          onClick={() => {
            toast.add({
              title,
              caption,
            });
          }}
        >
          Show Toast
        </button>
      </>
    );

    const button = wrapper.getByTestId('button');

    await user.click(button);

    const buttons = wrapper.getAllByRole('button');

    const closeButton = buttons[1];

    await user.click(closeButton);

    const component = wrapper.getAllByRole('alertdialog')[0]! as HTMLElement;

    expect(component).toHaveAttribute('data-transition', 'exiting');
  });
});
