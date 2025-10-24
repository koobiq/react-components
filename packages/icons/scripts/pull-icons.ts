import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

import fg from 'fast-glob';

const require = createRequire(import.meta.url);

// Icons package (override with ICONS_PKG)
const PKG_NAME = process.env.ICONS_PKG ?? '@koobiq/icons';
// Output dir for copied SVGs (default: "temp")
const DEST_DIR = process.env.DEST_DIR ?? 'temp';
// Optional icons subdirectory (e.g. "svg", "assets/svg")
const ICONS_SUBDIRECTORY = process.env.ICONS_SUBDIR ?? 'svg';
// Preserve source folder structure
const PRESERVE_STRUCTURE = process.env.PRESERVE_STRUCTURE === '1';

function resolvePackageRoot(pkgName: string) {
  // Find where the package is installed by resolving its package.json path
  const pkgJsonPath = require.resolve(`${pkgName}/package.json`, {
    paths: [process.cwd()],
  });

  return path.dirname(pkgJsonPath);
}

async function main() {
  let pkgRoot: string;

  try {
    pkgRoot = resolvePackageRoot(PKG_NAME);
  } catch {
    console.error(
      `✖ Failed to resolve ${PKG_NAME}. Make sure the package is installed (as a devDependency or in the workspace).`
    );

    process.exit(1);
  }

  const srcRoot = ICONS_SUBDIRECTORY
    ? path.join(pkgRoot, ICONS_SUBDIRECTORY)
    : pkgRoot;

  const patterns = ['**/*.svg'];
  const ignore = ['**/node_modules/**', '**/dist/**', '**/build/**'];

  const relFiles = await fg(patterns, { cwd: srcRoot, dot: false, ignore });

  if (relFiles.length === 0) {
    console.warn(
      `⚠ No SVG files found in ${srcRoot}. Check ICONS_SUBDIRECTORY (current value: "${ICONS_SUBDIRECTORY}").`
    );
  } else {
    console.log(`✓ Found ${relFiles.length} SVG files in ${srcRoot}`);
  }

  await rm(DEST_DIR, { recursive: true, force: true });
  await mkdir(DEST_DIR, { recursive: true });

  let copied = 0;

  const results = await Promise.allSettled(
    relFiles.map(async (rel) => {
      const srcAbs = path.join(srcRoot, rel);

      const outAbs = PRESERVE_STRUCTURE
        ? path.join(DEST_DIR, rel)
        : path.join(DEST_DIR, path.basename(rel));

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

        console.warn(`Failed to copy: ${rel}\n  ↳ ${msg}`);
      }
    });

    if (process.env.FAIL_ON_ERROR === '1') {
      throw new Error(
        `Copy completed with errors: ${failed}/${results.length} files`
      );
    }
  }

  console.log(`✓ Copied ${copied} SVG files → ${DEST_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
