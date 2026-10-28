import { createRequire } from 'node:module';
import path from 'node:path';

const MIN_MAJOR = 4;
const MIN_MINOR = 5;

const usable = (ts) => {
  if (!ts || typeof ts.createSourceFile !== 'function' || !ts.version)
    return false;

  const [major, minor] = ts.version.split('.').map(Number);

  return major > MIN_MAJOR || (major === MIN_MAJOR && minor >= MIN_MINOR);
};

/**
 * Loads TypeScript from the product (never bundled with the plugin):
 * an explicit path first, then the project root, then extra directories.
 */
export function loadTypeScript(root, { explicit, extraDirs = [] } = {}) {
  const attempts = [];

  if (explicit) {
    attempts.push(() =>
      createRequire(path.join(path.resolve(explicit), 'package.json'))(
        path.resolve(explicit)
      )
    );
  }

  for (const dir of [root, ...extraDirs]) {
    attempts.push(() =>
      createRequire(path.join(path.resolve(dir), 'package.json'))('typescript')
    );
  }

  for (const attempt of attempts) {
    try {
      const ts = attempt();

      if (usable(ts)) return ts;
    } catch {
      // try the next location
    }
  }

  return null;
}
