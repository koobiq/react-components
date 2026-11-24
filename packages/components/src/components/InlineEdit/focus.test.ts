import { afterEach, describe, expect, it } from 'vitest';

import { focusAdjacentTabStop, getTabStops } from './focus';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('InlineEdit focus helpers', () => {
  it('skips disabled, hidden and unrelated overlay tab stops', () => {
    document.body.innerHTML = `
      <button id="before">Before</button>
      <div id="host"><button>Inside</button></div>
      <div role="dialog"><button id="overlay">Overlay</button></div>
      <button id="disabled" disabled>Disabled</button>
      <button id="hidden" hidden>Hidden</button>
      <button id="after">After</button>
    `;

    const host = document.getElementById('host')!;

    expect(focusAdjacentTabStop(host, false)?.id).toBe('after');
    expect(focusAdjacentTabStop(host, true)?.id).toBe('before');
  });

  it('returns only real panel tab stops', () => {
    document.body.innerHTML = `
      <div id="panel">
        <input id="first">
        <input id="negative" tabindex="-1">
        <input id="hidden-type" type="hidden">
        <button id="disabled" disabled>Disabled</button>
        <span id="hidden-parent" style="display: none"><button>Hidden</button></span>
        <textarea id="last"></textarea>
      </div>
    `;

    expect(
      getTabStops(document.getElementById('panel')!).map(
        (element) => element.id
      )
    ).toEqual(['first', 'last']);
  });
});
