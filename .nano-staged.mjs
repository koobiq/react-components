export default {
  '**/*.{js,jsx,ts,tsx}': ['eslint --fix', 'vitest related --run'],
  '**/*.{js,jsx,ts,tsx,json,css,md,mdx,svg,html,yml,yaml}': [
    'prettier --write',
  ],
  '**/*.{css}': ['stylelint --fix'],
  '**/*': () => 'pnpm type-check',
};
