// bump.config.ts
import { defineConfig } from 'bumpp';

export default defineConfig({
  noVerify: true,
  push: false,
  all: true,
  tag: '%s',
  recursive: true,
  commit: 'build: publish %s',
  execute: 'commit-and-tag-version',
});
