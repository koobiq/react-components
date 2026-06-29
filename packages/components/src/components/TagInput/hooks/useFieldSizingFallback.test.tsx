import { useRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useFieldSizingFallback } from './useFieldSizingFallback';

type AutosizeInputProps = {
  value?: string;
  placeholder?: string;
  inlineSizeVariable?: `--${string}`;
  fallbackAttribute?: `data-${string}`;
};

function AutosizeInput(props: AutosizeInputProps) {
  const {
    value = '',
    placeholder,
    fallbackAttribute,
    inlineSizeVariable,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  useFieldSizingFallback(inputRef, {
    fallbackAttribute,
    fallbackText: placeholder,
    inlineSizeVariable,
    text: value,
  });

  return (
    <input
      data-testid="input"
      placeholder={placeholder}
      readOnly
      ref={inputRef}
      value={value}
    />
  );
}

const getInput = () => screen.getByTestId('input') as HTMLInputElement;

describe('useFieldSizingFallback', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('enables JS autosize when field-sizing is not supported', async () => {
    vi.stubGlobal('CSS', { supports: vi.fn().mockReturnValue(false) });

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      bottom: 0,
      height: 0,
      left: 0,
      right: 120,
      top: 0,
      width: 120,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    });

    render(<AutosizeInput placeholder="Type and press Enter" />);

    await waitFor(() => {
      expect(getInput()).toHaveAttribute('data-field-sizing-fallback', '');

      expect(
        getInput().style.getPropertyValue('--kbq-autosize-inline-size')
      ).toBe('122px');
    });
  });

  it('allows overriding fallback attribute and inline-size variable names', async () => {
    vi.stubGlobal('CSS', { supports: vi.fn().mockReturnValue(false) });

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      bottom: 0,
      height: 0,
      left: 0,
      right: 80,
      top: 0,
      width: 80,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    });

    render(
      <AutosizeInput
        fallbackAttribute="data-custom-fallback"
        inlineSizeVariable="--custom-inline-size"
        value="react"
      />
    );

    await waitFor(() => {
      expect(getInput()).toHaveAttribute('data-custom-fallback', '');

      expect(getInput().style.getPropertyValue('--custom-inline-size')).toBe(
        '82px'
      );
    });
  });

  it('keeps native autosize when field-sizing is supported', () => {
    vi.stubGlobal('CSS', { supports: vi.fn().mockReturnValue(true) });
    render(<AutosizeInput placeholder="Add tag" value="react" />);

    expect(getInput()).not.toHaveAttribute('data-field-sizing-fallback');

    expect(
      getInput().style.getPropertyValue('--kbq-autosize-inline-size')
    ).toBe('');
  });
});
