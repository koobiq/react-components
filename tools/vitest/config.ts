import type { UserConfig } from 'vitest/config';

/** Shared Vitest options for every package of the workspace. */
export const test: UserConfig['test'] = {
  globals: true,
  environment: 'jsdom',
  // Relative to the project root, i.e. to `packages/*`.
  setupFiles: '../../tools/vitest/setupTests.ts',
};
