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

export const TEMP_DIR = path.resolve('temp');
export const OUTPUT_DIR = path.resolve('src');

export const SVG_ICONS_DIR = path.join(KOOBIQ_ICONS_DIR, 'svg');
export const ICONS_INFO_DIR = path.join(KOOBIQ_ICONS_DIR, 'info');
export const ICONS_INFO_FILE = path.join(ICONS_INFO_DIR, 'kbq-icons-info.json');

export const SIZES = ['16', '24', '32', '48', '64'] as const;
