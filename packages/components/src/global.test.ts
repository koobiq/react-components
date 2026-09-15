import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const root = dirname(fileURLToPath(import.meta.url));

const read = (path: string) => readFileSync(join(root, path), 'utf8');

const overlays = [
  'components/Modal/Modal.module.css',
  'components/Popover/Popover.module.css',
  'components/SidePanel/SidePanel.module.css',
  'components/Tooltip/Tooltip.module.css',
  'components/FileUpload/components/FileUploadDropTargetOverlay/FileUploadDropTargetOverlay.module.css',
];

// Overlays only share a stacking plane while they all point at the same layer,
// and jsdom resolves neither custom properties nor CSS Modules values — so the
// wiring is guarded by reading the stylesheets.
describe('overlay layer', () => {
  it('should keep every overlay on a single layer', () => {
    const layers = overlays.map(
      (path) => read(path).match(/z-index: var\((--kbq-layer-[a-z]+)\)/)?.[1]
    );

    expect(new Set(layers)).toStrictEqual(new Set(['--kbq-layer-overlay']));
  });

  it('should keep the deprecated alias resolving to that layer', () => {
    expect(read('global.css')).toMatch(
      /--kbq-layer-overlay:\s*var\(--kbq-layer-modal\);/
    );
  });
});
