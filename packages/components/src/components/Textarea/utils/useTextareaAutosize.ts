import { type MutableRefObject, useEffect } from 'react';

export function useTextareaAutosize(
  ref: MutableRefObject<HTMLTextAreaElement | null>,
  value: string | readonly string[] | number | undefined,
  active?: boolean
) {
  useEffect(() => {
    if (!active) return;

    if (ref.current) {
      const textareaEl = ref.current;
      textareaEl.style.blockSize = '0px';
      const { scrollHeight, offsetHeight, clientHeight } = textareaEl;
      textareaEl.style.blockSize = `${scrollHeight + (offsetHeight - clientHeight)}px`;
    }
  }, [value]);
}
