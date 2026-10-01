import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';

import { RULES } from '../../lint/koobiq-core.mjs';

import { PLUGIN_ROOT } from './helpers.mjs';

const ID_RE =
  /\b(?:setup|import|deprecated|token|style|component|props|typescript|a11y|i18n)\/[a-z0-9]+(?:-[a-z0-9]+)*\b/g;

const markdownFiles = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) markdownFiles(full, out);
    else if (entry.name.endsWith('.md')) out.push(full);
  }

  return out;
};

const docs = [
  ...markdownFiles(path.join(PLUGIN_ROOT, 'skills')),
  ...markdownFiles(path.join(PLUGIN_ROOT, 'agents')),
].map((file) => ({ file, text: fs.readFileSync(file, 'utf8') }));

test('every rule id used by skills and agents exists', () => {
  const unknown = [];

  for (const { file, text } of docs) {
    for (const [id] of text.matchAll(ID_RE)) {
      if (!RULES[id])
        unknown.push(`${path.relative(PLUGIN_ROOT, file)}: ${id}`);
    }
  }

  assert.deepEqual(unknown, []);
});

test('every rule the reviewer judges is documented in the references', () => {
  const referenced = new Set(
    docs.flatMap(({ text }) => [...text.matchAll(ID_RE)].map((m) => m[0]))
  );

  const missing = Object.entries(RULES)
    .filter(([, rule]) => rule.detector !== 'script')
    .map(([id]) => id)
    .filter((id) => !referenced.has(id));

  assert.deepEqual(missing, []);
});
