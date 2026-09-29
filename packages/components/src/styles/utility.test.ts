import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const root = dirname(fileURLToPath(import.meta.url));

const css = readFileSync(join(root, 'utility.module.css'), 'utf8');

/** Selectors the scrollbar is applied to, i.e. the rule's prelude. */
const selectors = css
  .slice(0, css.indexOf('--native-scrollbar-thumb-min-size'))
  .split('*/')
  .at(-1)
  ?.split('{')
  .at(0);

// The scrollbar lives entirely in CSS, and jsdom resolves neither the custom
// properties nor `composes` - so the wiring is guarded by reading the stylesheet.
describe('native scrollbar', () => {
  it('should cover the element, its descendants and nested lists', () => {
    expect(selectors).toContain('.native-scrollbar');
    expect(selectors).toContain('.native-scrollbar-descendants');
    expect(selectors).toContain('.native-scrollbar-descendants *');
    expect(selectors).toContain('.list ul');
  });

  it('should give the list utility the same scrollbar', () => {
    expect(css).toMatch(/\.list \{\s*composes: native-scrollbar;\s*\}/);
  });

  it('should reset an inherited `scrollbar-color`', () => {
    // Since Chrome 121 a non-`auto` value disables `::-webkit-scrollbar*`.
    expect(css).toContain('scrollbar-color: auto;');
  });

  it('should take the dark thumb colors from the nearest `.kbq-dark`', () => {
    expect(css).toMatch(
      /:where\(:global\(\.kbq-dark\)\) &\s*\{[^}]*--kbq-semantic-dark-contrast-a9/
    );
  });

  it('should draw the scrollbar through the WebKit pseudo-elements', () => {
    [
      '&::-webkit-scrollbar {',
      '&::-webkit-scrollbar-thumb {',
      '&::-webkit-scrollbar-button {',
    ].forEach((selector) => expect(css).toContain(selector));
  });
});
