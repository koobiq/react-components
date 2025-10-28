import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

import fg from 'fast-glob';

import { SVG_ICONS_DIR, TEMP_DIR } from '../constants';

async function run() {
  const patterns = ['**/*.svg'];

  const relFiles = await fg(patterns, {
    cwd: SVG_ICONS_DIR,
    dot: false,
  });

  if (relFiles.length === 0) {
    console.warn(`⚠️ No SVG files found in ${SVG_ICONS_DIR}.`);
  } else {
    console.log(`✅ Found ${relFiles.length} SVG files in ${SVG_ICONS_DIR}`);
  }

  // Prepare filesystem: create temp directory
  await rm(TEMP_DIR, { recursive: true, force: true });
  await mkdir(TEMP_DIR, { recursive: true });

  let copied = 0;

  const results = await Promise.allSettled(
    relFiles.map(async (rel) => {
      const srcAbs = path.join(SVG_ICONS_DIR, rel);

      const outAbs = path.join(TEMP_DIR, path.basename(rel));

      await mkdir(path.dirname(outAbs), { recursive: true });
      const buf = await readFile(srcAbs);
      await writeFile(outAbs, buf);

      return rel; // For summary report
    })
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.length - succeeded;
  copied += succeeded;

  // Log failed copies
  if (failed > 0) {
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        const rel = relFiles[i];

        const msg =
          r.reason instanceof Error ? r.reason.message : String(r.reason);

        console.warn(`❌ Failed to copy: ${rel}\n  ↳ ${msg}`);
      }
    });

    throw new Error(
      `❌ Copy completed with errors: ${failed}/${results.length} files`
    );
  }

  console.log(`✅ Copied ${copied} SVG files → ${TEMP_DIR}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
