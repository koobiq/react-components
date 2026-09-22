export default {
  '**/*.{js,cjs,mjs,jsx,ts,cts,mts,tsx}': [
    'eslint --fix',
    'vitest related --run',
  ],
  '**/*.{css}': ['stylelint --fix'],
  '**/*': () => 'pnpm type-check',
  '*': ['prettier --write --ignore-unknown'],
};
