export default {
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'vitest related --run'],
  '**/*.{css}': ['stylelint --fix'],
  '**/*': () => 'pnpm type-check',
  '**/*.{json,md,mdx,svg,html,yml,yaml}': [
    'prettier --write',
  ],
};
