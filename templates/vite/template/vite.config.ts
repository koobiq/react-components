/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { analyzer } from 'vite-bundle-analyzer';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'analyze' &&
      analyzer({
        analyzerMode: 'static',
        fileName: 'stats',
        openAnalyzer: false,
        reportTitle: 'Vite Bundle Analyzer',
      }),
  ],
  esbuild: {
    jsx: 'automatic',
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: './setupTests.ts',
  },
}));
