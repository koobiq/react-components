import { useCallback, useState } from 'react';

type CopiedValue = string | null;

/** Function to copy text to the clipboard. */
type CopyFn = (text: string) => Promise<boolean>;

/**
 * A simple hook for copying text to the clipboard.
 * Returns `[copiedValue, copy]`.
 * @example
 * const [copied, copy] = useCopyToClipboard();
 * <button onClick={() => copy('Hello')}>Copy</button>
 */
export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedValue, setCopiedValue] = useState<CopiedValue>(null);

  const copy: CopyFn = useCallback(async (text) => {
    // SSR guard
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      console.warn('Clipboard API is not supported.');

      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedValue(text);

      return true;
    } catch (error) {
      console.warn('Failed to copy text:', error);
      setCopiedValue(null);

      return false;
    }
  }, []);

  return [copiedValue, copy];
}
