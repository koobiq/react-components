import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

function resolvePackageRoot(pkgName: string) {
  try {
    const pkgJsonPath = require.resolve(`${pkgName}/package.json`, {
      paths: [process.cwd()],
    });

    return path.dirname(pkgJsonPath);
  } catch {
    throw new Error(
      `❌ Failed to resolve ${pkgName}. Make sure the package is installed (as a devDependency or in the workspace).`
    );
  }
}

export const KOOBIQ_ICONS_DIR = resolvePackageRoot('@koobiq/icons');

// Metadata
export const MANIFEST_FILE = path.join(
  KOOBIQ_ICONS_DIR,
  'info',
  'kbq-icons-info.json'
);

// Directory containing the source SVG files
export const INPUT_DIR = path.join(KOOBIQ_ICONS_DIR, 'svg');
// Directory where generated TSX icons will be written
export const OUTPUT_DIR = path.resolve('src');

// Supported icon sizes
export const SIZES = ['16', '24', '32', '48', '64'] as const;
