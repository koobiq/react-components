import { describe, expect, it } from 'vitest';

import { addLineNumbers } from './lineNumbers';

function parse(html: string): HTMLElement {
  const container = document.createElement('div');

  container.innerHTML = html;

  return container;
}

describe('addLineNumbers', () => {
  it('adds a numbered row for each line and honors startFrom', () => {
    const result = parse(
      addLineNumbers('const first = 1;\n\nconst third = 3;', { startFrom: 7 })
    );

    const numberCells = result.querySelectorAll('.hljs-ln-numbers');
    const codeCells = result.querySelectorAll('.hljs-ln-code');

    expect(numberCells).toHaveLength(3);

    expect(
      Array.from(numberCells).map((cell) =>
        cell.getAttribute('data-line-number')
      )
    ).toEqual(['7', '8', '9']);

    expect(Array.from(codeCells).map((cell) => cell.textContent)).toEqual([
      'const first = 1;',
      ' ',
      'const third = 3;',
    ]);
  });

  it('leaves single-line markup unchanged unless singleLine is enabled', () => {
    const html = '<span class="hljs-keyword">const</span> value = 1;';

    expect(addLineNumbers(html)).toBe(html);

    expect(parse(addLineNumbers(html, { singleLine: true }))).toHaveTextContent(
      'const value = 1;'
    );

    expect(
      parse(addLineNumbers(html, { singleLine: true })).querySelectorAll('tr')
    ).toHaveLength(1);
  });

  it('duplicates multiline highlight spans into the corresponding rows', () => {
    const result = parse(
      addLineNumbers('<span class="hljs-string">first\nsecond</span>')
    );

    const codeCells = result.querySelectorAll('.hljs-ln-code');

    expect(codeCells).toHaveLength(2);

    expect(Array.from(codeCells).map((cell) => cell.textContent)).toEqual([
      'first',
      'second',
    ]);

    expect(codeCells[0]?.querySelector('.hljs-string')).not.toBeNull();
    expect(codeCells[1]?.querySelector('.hljs-string')).not.toBeNull();
  });

  it('handles empty content and ignores a trailing blank line', () => {
    expect(addLineNumbers('')).toBe('');

    const result = parse(addLineNumbers('first\nsecond\n'));

    expect(result.querySelectorAll('tr')).toHaveLength(2);
  });
});
