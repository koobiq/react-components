const TABLE_NAME = 'hljs-ln';
const LINE_NAME = 'hljs-ln-line';
const CODE_BLOCK_NAME = 'hljs-ln-code';
const NUMBERS_BLOCK_NAME = 'hljs-ln-numbers';
const NUMBER_LINE_NAME = 'hljs-ln-n';
const DATA_ATTR_NAME = 'data-line-number';
const BREAK_LINE_REGEXP = /\r\n|\r|\n/g;

export type AddLineNumbersOptions = {
  /** The starting line number. */
  startFrom?: number;
  /** Whether to display line numbers for single line code. */
  singleLine?: boolean;
};

function getLines(text: string): string[] {
  if (text.length === 0) return [];

  return text.split(BREAK_LINE_REGEXP);
}

function getLinesCount(text: string): number {
  return (text.trim().match(BREAK_LINE_REGEXP) || []).length;
}

/** Splits a multiline `hljs-*` span into one span per line, so each line can be wrapped in its own table row. */
function duplicateMultilineNode(element: Element): void {
  const { className } = element;

  if (!/hljs-/.test(className)) return;

  const lines = getLines(element.innerHTML);

  element.innerHTML = lines
    .map(
      (line) =>
        `<span class="${className}">${line.length > 0 ? line : ' '}</span>`
    )
    .join('\n')
    .trim();
}

/** Recursively fixes multi-line token spans produced by `highlight.js`. */
function duplicateMultilineNodes(element: Element): void {
  element.childNodes.forEach((node) => {
    if (getLinesCount(node.textContent ?? '') === 0) return;

    if (node.childNodes.length > 0) {
      duplicateMultilineNodes(node as Element);
    } else if (node.parentElement) {
      duplicateMultilineNode(node.parentElement);
    }
  });
}

function addLineNumbersBlockFor(
  inputHtml: string,
  options: Required<AddLineNumbersOptions>
): string {
  const lines = getLines(inputHtml);

  // If the last line contains only a line break, remove it.
  if (lines[lines.length - 1]?.trim() === '') {
    lines.pop();
  }

  if (lines.length <= 1 && !options.singleLine) return inputHtml;

  const rows = lines
    .map((line, index) => {
      const lineNumber = index + options.startFrom;
      const codeLine = line.length > 0 ? line : ' ';

      return (
        `<tr>` +
        `<td class="${LINE_NAME} ${NUMBERS_BLOCK_NAME}" ${DATA_ATTR_NAME}="${lineNumber}">` +
        `<div class="${NUMBER_LINE_NAME}" ${DATA_ATTR_NAME}="${lineNumber}"></div>` +
        `</td>` +
        `<td class="${LINE_NAME} ${CODE_BLOCK_NAME}" ${DATA_ATTR_NAME}="${lineNumber}">${codeLine}</td>` +
        `</tr>`
      );
    })
    .join('');

  return `<table class="${TABLE_NAME}">${rows}</table>`;
}

/**
 * Wraps highlighted `highlight.js` HTML output into a line-numbered `<table>`.
 *
 * Ported from {@link https://github.com/wcoder/highlightjs-line-numbers.js} (v2.9.0), trimmed of the
 * legacy Microsoft Edge copy/paste workaround — not needed for this package's browserslist targets.
 */
export function addLineNumbers(
  html: string,
  options: AddLineNumbersOptions = {}
): string {
  const { startFrom = 1, singleLine = false } = options;

  const container = document.createElement('code');

  container.innerHTML = html;

  duplicateMultilineNodes(container);

  return addLineNumbersBlockFor(container.innerHTML, { startFrom, singleLine });
}
