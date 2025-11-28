import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useCopyToClipboard } from './useCopyToClipboard';

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns initial value as null', () => {
    const { result } = renderHook(() => useCopyToClipboard());

    const [copiedValue] = result.current;
    expect(copiedValue).toBeNull();
  });

  it('copies text successfully', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);

    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: {
        writeText: writeTextMock,
      },
    } as unknown as Navigator);

    const { result } = renderHook(() => useCopyToClipboard());
    const [, copy] = result.current;

    await act(async () => {
      const success = await copy('Hello');
      expect(success).toBe(true);
    });

    const [copiedValue] = result.current;

    expect(writeTextMock).toHaveBeenCalledWith('Hello');
    expect(copiedValue).toBe('Hello');
  });

  it('returns false and resets state on error', async () => {
    const writeTextMock = vi.fn().mockRejectedValue(new Error('fail'));

    const errorMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: {
        writeText: writeTextMock,
      },
    } as unknown as Navigator);

    const { result } = renderHook(() => useCopyToClipboard());
    const [, copy] = result.current;

    await act(async () => {
      const success = await copy('Text');
      expect(success).toBe(false);
    });

    const [copiedValue] = result.current;

    expect(writeTextMock).toHaveBeenCalledWith('Text');
    expect(copiedValue).toBeNull();
    expect(errorMock).toHaveBeenCalled();

    errorMock.mockRestore();
  });

  it('returns false if Clipboard API is not supported', async () => {
    const warnMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: undefined,
    } as unknown as Navigator);

    const { result } = renderHook(() => useCopyToClipboard());
    const [, copy] = result.current;

    await act(async () => {
      const success = await copy('Hello');
      expect(success).toBe(false);
    });

    expect(warnMock).toHaveBeenCalledWith('Clipboard API is not supported.');

    warnMock.mockRestore();
  });
});
