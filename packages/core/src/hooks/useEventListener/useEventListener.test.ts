import { renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, afterEach } from 'vitest';

import { useEventListener } from './index';

const windowAddEventListenerSpy = vi.spyOn(window, 'addEventListener');
const windowRemoveEventListenerSpy = vi.spyOn(window, 'removeEventListener');

const ref = { current: document.createElement('div') };
const refAddEventListenerSpy = vi.spyOn(ref.current, 'addEventListener');

const refRemoveEventListenerSpy = vi.spyOn(ref.current, 'removeEventListener');

const docRef = { current: window.document };
const docAddEventListenerSpy = vi.spyOn(docRef.current, 'addEventListener');

const docRemoveEventListenerSpy = vi.spyOn(
  docRef.current,
  'removeEventListener'
);

describe('useEventListener', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should add/remove the event assigned to window when the element is not available', () => {
    const eventName = 'load';
    const handler = vi.fn();
    const options = undefined;

    const { unmount } = renderHook(() =>
      useEventListener({ eventName, handler })
    );

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );

    unmount();

    expect(windowRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );
  });

  it('should add/remove the event assigned to the element', () => {
    const eventName = 'click';
    const handler = vi.fn();
    const options = undefined;

    const { unmount } = renderHook(() =>
      useEventListener({ eventName, handler, element: ref })
    );

    expect(refAddEventListenerSpy).toHaveBeenCalledTimes(1);

    expect(refAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );

    unmount();

    expect(refRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );
  });

  it('should add/remove the event assigned to the document', () => {
    const eventName = 'DOMContentLoaded';
    const handler = vi.fn();
    const options = undefined;

    const { unmount } = renderHook(() =>
      useEventListener({ eventName, handler, element: docRef })
    );

    expect(docAddEventListenerSpy).toHaveBeenCalledTimes(1);

    expect(docAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );

    unmount();

    expect(docRemoveEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );
  });

  it('should pass options to the event listener', () => {
    const eventName = 'click';
    const handler = vi.fn();

    const options = {
      passive: true,
      once: true,
      capture: true,
    };

    renderHook(() => useEventListener({ eventName, handler, options }));

    expect(windowAddEventListenerSpy).toHaveBeenCalledWith(
      eventName,
      expect.any(Function),
      options
    );
  });

  it('should work correctly with the active parameter', async () => {
    const callback = vi.fn();

    const { rerender } = renderHook((active: boolean) =>
      useEventListener({
        eventName: 'keydown',
        handler: callback,
        active,
      })
    );

    await userEvent.keyboard('{esc}');

    expect(callback).toBeCalledTimes(1);

    rerender(false);

    await userEvent.keyboard('{esc}');

    expect(callback).toBeCalledTimes(1);
  });
});
