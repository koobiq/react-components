import path from 'path';

import react from '@vitejs/plugin-react';
import browserslist from 'browserslist';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import preserveDirectives from 'rollup-preserve-directives';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

import { browserslist as browsers } from '../../package.json';

const isExternal = (id: string) => !id.startsWith('.') && !path.isAbsolute(id);

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
  // tsconfigPaths: support aliases for tests
  plugins: [react(), tsconfigPaths(), preserveDirectives()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: (_, entryName: string) => `${entryName}.js`,
      formats: ['es'],
    },
    minify: false,
    target: browserslistToEsbuild(browserslist(browsers)),
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      external: isExternal,
    },
  },
});
