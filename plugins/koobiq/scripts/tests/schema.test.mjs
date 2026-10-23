// Reports from every fixture match koobiq-check.schema.json, so the schema
// documents what the checker really emits (and fails when they drift).
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, test } from 'node:test';

import { PLUGIN_ROOT, check, makeApp } from './helpers.mjs';

const SCHEMA = JSON.parse(
  fs.readFileSync(
    path.join(PLUGIN_ROOT, 'scripts', 'koobiq-check.schema.json'),
    'utf8'
  )
);

const typeOf = (value) => {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (Number.isInteger(value)) return 'integer';

  return typeof value;
};

/** The JSON Schema keywords the report schema uses, and nothing more. */
function validate(schema, value, at = '$', errors = []) {
  if (schema.$ref) {
    const target = schema.$ref
      .replace(/^#\//, '')
      .split('/')
      .reduce((node, key) => node[key], SCHEMA);

    return validate(target, value, at, errors);
  }

  if ('const' in schema && value !== schema.const)
    errors.push(`${at}: expected ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value))
    errors.push(`${at}: ${JSON.stringify(value)} is not in the enum`);

  if (schema.type) {
    const types = [].concat(schema.type);
    const actual = typeOf(value);

    if (
      !types.some(
        (t) => t === actual || (t === 'number' && actual === 'integer')
      )
    ) {
      errors.push(`${at}: expected ${types.join('|')}, got ${actual}`);

      return errors;
    }
  }

  if (typeof value === 'string') {
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value))
      errors.push(`${at}: ${JSON.stringify(value)} does not match the pattern`);
    if (schema.maxLength != null && [...value].length > schema.maxLength)
      errors.push(`${at}: longer than ${schema.maxLength}`);
  }

  if (
    typeof value === 'number' &&
    schema.minimum != null &&
    value < schema.minimum
  )
    errors.push(`${at}: below ${schema.minimum}`);

  if (Array.isArray(value)) {
    if (schema.minItems != null && value.length < schema.minItems)
      errors.push(`${at}: fewer than ${schema.minItems} items`);
    if (schema.maxItems != null && value.length > schema.maxItems)
      errors.push(`${at}: more than ${schema.maxItems} items`);
    if (schema.items)
      value.forEach((item, i) =>
        validate(schema.items, item, `${at}[${i}]`, errors)
      );
  }

  if (typeOf(value) === 'object') {
    for (const key of schema.required || []) {
      if (!(key in value)) errors.push(`${at}: missing "${key}"`);
    }

    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key])
        validate(schema.properties[key], item, `${at}.${key}`, errors);
      else if (schema.additionalProperties === false)
        errors.push(`${at}: unexpected "${key}"`);
      else if (typeof schema.additionalProperties === 'object')
        validate(schema.additionalProperties, item, `${at}.${key}`, errors);
    }
  }

  return errors;
}

const assertValid = (report) => {
  // JSON round trip: the schema describes the serialized report.
  const errors = validate(SCHEMA, JSON.parse(JSON.stringify(report)));

  assert.deepEqual(errors.slice(0, 10), []);
};

describe('report schema', () => {
  test('bad-app with the full inventory and truncation', () => {
    const app = makeApp('bad-app');

    try {
      const report = check(app.dir, { inventory: 'full', maxPerFile: 3 });

      assert.ok(report.findings.length > 0);
      assert.ok(report.meta.truncated.length > 0);
      assertValid(report);
    } finally {
      app.cleanup();
    }
  });

  test('good-app through a local barrel, summary inventory', () => {
    const app = makeApp('good-app');

    try {
      fs.mkdirSync(path.join(app.dir, 'src', 'ui'));

      fs.writeFileSync(
        path.join(app.dir, 'src', 'ui', 'index.ts'),
        "export { Button as UiButton } from '@koobiq/react-components';\n"
      );

      fs.writeFileSync(
        path.join(app.dir, 'src', 'Page.tsx'),
        "import { UiButton } from './ui';\n\nexport const Page = () => <UiButton disabled>Go</UiButton>;\n"
      );

      const full = check(app.dir, { inventory: 'full' });

      assert.ok(full.inventory.components.some((c) => c.via));
      assertValid(full);
      assertValid(check(app.dir));
    } finally {
      app.cleanup();
    }
  });

  test('js-app on the regex tier, no inventory', () => {
    const app = makeApp('js-app');

    try {
      const report = check(app.dir, {
        typescript: undefined,
        inventory: 'none',
      });

      assert.ok(report.findings.some((f) => f.source === 'regex'));
      assertValid(report);
    } finally {
      app.cleanup();
    }
  });

  test('monorepo', () => {
    const app = makeApp('monorepo');

    try {
      assertValid(check(app.dir));
    } finally {
      app.cleanup();
    }
  });

  test('changed mode', (t) => {
    const git = (args, cwd) =>
      spawnSync('git', args, { cwd, encoding: 'utf8', windowsHide: true });

    if (git(['--version']).status !== 0) {
      t.skip('git is not available');

      return;
    }

    const app = makeApp('good-app');

    try {
      const env = ['-c', 'user.name=t', '-c', 'user.email=t@t'];

      fs.writeFileSync(path.join(app.dir, '.gitignore'), 'node_modules\n');
      git(['init', '-q'], app.dir);
      git([...env, 'add', '-A'], app.dir);
      git([...env, 'commit', '-q', '-m', 'init'], app.dir);

      fs.writeFileSync(
        path.join(app.dir, 'src', 'New.tsx'),
        "import { IconButton } from '@koobiq/react-components';\n\nexport const New = () => <IconButton />;\n"
      );

      const report = check(app.dir, { changed: true, base: 'HEAD' });

      assert.equal(report.meta.mode, 'changed');
      assert.ok(report.findings.some((f) => f.inDiff === true));
      assertValid(report);
    } finally {
      app.cleanup();
    }
  });

  test('the validator rejects drift', () => {
    const app = makeApp('good-app');

    try {
      const report = JSON.parse(JSON.stringify(check(app.dir)));

      report.meta.extra = true;
      report.findings.push({ id: 'Bad Id' });

      const errors = validate(SCHEMA, report);

      assert.ok(errors.some((e) => e.includes('unexpected "extra"')));
      assert.ok(errors.some((e) => e.includes('does not match the pattern')));
      assert.ok(errors.some((e) => e.includes('missing "severity"')));
    } finally {
      app.cleanup();
    }
  });
});
