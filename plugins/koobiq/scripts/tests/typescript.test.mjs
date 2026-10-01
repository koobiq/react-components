// TypeScript tiers: T2 follows local barrels; T3 (--typecheck) finds
// deprecated Koobiq members the catalog cannot see (wrappers typed with
// Koobiq props).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import {
  REPO_ROOT,
  REPO_TYPESCRIPT,
  actualKeys,
  check,
  makeApp,
} from './helpers.mjs';

const write = (dir, rel, content) => {
  fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
  fs.writeFileSync(path.join(dir, rel), content);
};

describe('TypeScript tiers', () => {
  test('T2: components imported through local barrels', (t) => {
    if (!REPO_TYPESCRIPT) {
      t.skip('typescript is not installed');

      return;
    }

    const app = makeApp('good-app');

    try {
      write(
        app.dir,
        'src/ui/index.ts',
        "export { Button as KoobiqButton, Input } from '@koobiq/react-components';\nexport * from './more';\n"
      );

      write(
        app.dir,
        'src/ui/more.ts',
        "export * from '@koobiq/react-components';\n"
      );

      write(
        app.dir,
        'src/Uses.tsx',
        [
          "import { KoobiqButton, Checkbox } from './ui';",
          '',
          'export const Uses = () => (',
          '  <>',
          '    <KoobiqButton isDisabled>Save</KoobiqButton>',
          '    <KoobiqButton disabled>Save</KoobiqButton>',
          '    <Checkbox checked>Remember</Checkbox>',
          '  </>',
          ');',
          '',
        ].join('\n')
      );

      const report = check(app.dir, { inventory: 'full' });

      assert.deepEqual(actualKeys(report), [
        'src/Uses.tsx:6:deprecated/prop',
        'src/Uses.tsx:7:deprecated/prop',
      ]);

      const viaBarrel = report.inventory.components.find(
        (c) => c.file === 'src/Uses.tsx' && c.name === 'Button'
      );

      assert.equal(viaBarrel.via, 'src/ui/index.ts');
    } finally {
      app.cleanup();
    }
  });

  test('T3: --typecheck follows wrappers typed with Koobiq props', (t) => {
    const types = path.join(REPO_ROOT, 'node_modules', '@types', 'react');
    const csstype = path.join(REPO_ROOT, 'node_modules', 'csstype');

    if (!REPO_TYPESCRIPT || !fs.existsSync(types) || !fs.existsSync(csstype)) {
      t.skip('typescript, @types/react or csstype is not installed');

      return;
    }

    const app = makeApp('good-app');

    try {
      fs.cpSync(types, path.join(app.dir, 'node_modules', '@types', 'react'), {
        recursive: true,
      });

      fs.cpSync(csstype, path.join(app.dir, 'node_modules', 'csstype'), {
        recursive: true,
      });

      write(
        app.dir,
        'tsconfig.json',
        JSON.stringify({
          compilerOptions: {
            jsx: 'react-jsx',
            strict: true,
            module: 'esnext',
            moduleResolution: 'bundler',
            skipLibCheck: true,
          },
          include: ['src'],
        })
      );

      write(
        app.dir,
        'src/Wrapped.tsx',
        [
          "import { Checkbox, type CheckboxProps } from '@koobiq/react-components';",
          '',
          'const MyCheckbox = (props: CheckboxProps) => <Checkbox {...props} />;',
          '',
          'export const Terms = () => (',
          '  <>',
          '    <MyCheckbox isSelected>Accept</MyCheckbox>',
          '    <MyCheckbox checked>Remember</MyCheckbox>',
          '    <MyCheckbox readonly>Locked</MyCheckbox>',
          '    <Checkbox checked>Subscribe</Checkbox>',
          '  </>',
          ');',
          '',
        ].join('\n')
      );

      // The catalog sees only JSX on Koobiq bindings.
      assert.deepEqual(actualKeys(check(app.dir)), [
        'src/Wrapped.tsx:10:deprecated/prop',
      ]);

      const report = check(app.dir, { typecheck: true });

      const at = (line) =>
        report.findings.find(
          (f) => f.file === 'src/Wrapped.tsx' && f.line === line
        );

      assert.equal(report.meta.tsTier, 'languageService');

      // Line 10 is reported once: the catalog finding wins the dedupe.
      // (actualKeys sorts as strings.)
      assert.deepEqual(actualKeys(report), [
        'src/Wrapped.tsx:10:deprecated/prop',
        'src/Wrapped.tsx:8:deprecated/prop',
        'src/Wrapped.tsx:9:deprecated/prop',
      ]);

      assert.equal(at(8).source, 'ts');
      assert.match(at(8).suggestion, /"isSelected"/);
      // The stub JSDoc names "isReadonly"; the real prop is "isReadOnly".
      assert.match(at(9).suggestion, /"isReadOnly"/);
      assert.notEqual(at(10).source, 'ts');
    } finally {
      app.cleanup();
    }
  });
});
