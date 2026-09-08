# Contributing

Hi there! We're excited about your interest in contributing to Koobiq React.
Before submitting your contribution, please take a moment to read the following guide:

## Quick start

Follow these steps to start the development mode:

- Clone the repository and navigate to the created directory.
- Run the command `pnpm dev` in the terminal.

Documentation will be available at [http://localhost:6006](http://localhost:6006).
All development is conducted there. For convenience, you can go directly to the page of the component you are working on.

## Prerequisites

- Node.js v20
- pnpm v9

## Tech stack

Our technology stack:

- [React](https://react.dev/)
- [React-Aria](https://react-spectrum.adobe.com/react-aria/index.html)
- [Typescript](https://www.typescriptlang.org/)
- [Lightning CSS](https://lightningcss.dev/)

## Available Scripts

- `pnpm run dev` — will run the Storybook in development mode
- `pnpm run test` — will run unit tests on every change
- `pnpm run lint` — will lint the code once
- `pnpm run type-check` — will check the typing of the code once

## Console output in tests

All package tests fail on unexpected `console.warn` and `console.error` calls via
`vitest-fail-on-console`, configured in `tools/vitest/setupTests.ts`.
Fix the cause of React `act(...)` and accessibility warnings before submitting a change.

When a warning or error is expected, mock that console method only in the relevant
test, assert the message, and restore the mock:

```ts
it('reports invalid input', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

  validateInput('invalid');

  expect(warn).toHaveBeenCalledWith(expect.stringContaining('Invalid input'));

  warn.mockRestore();
});
```

Do not silence warnings globally or add blanket exceptions for React or accessibility messages.

## 🛡 Public API guard

The public API of each component and package is pinned in `tools/public_api_guard/`. Before opening a PR:

```bash
pnpm build
pnpm check-api
```

If the API change is intentional, refresh the snapshots and commit them:

```bash
pnpm approve-api                # refresh all
pnpm approve-api Button         # refresh a single component
pnpm approve-api react-icons    # refresh a single package
```
