# AGENTS.md — Koobiq React

> Context file for AI agents working in this repository.

## Project Overview

**Koobiq React** is an open-source React component library built on top of [React Aria](https://react-spectrum.adobe.com/react-aria/), used to build user interfaces for information-security products.

- **Package name:** `@koobiq/react-components`
- **Current version:** 0.x (check `packages/components/package.json` for the exact version)
- **License:** MIT
- **Documentation:** https://react.koobiq.io

## Repository Structure

```
├── packages/
│   ├── logger/                        # The utilities for displaying the log on the client side (@koobiq/logger)
│   ├── core/                          # Common hooks, utilities, and types used by Koobiq React packages (@koobiq/react-core)
│   │   └── src/
│   │       ├── hooks/                 # useBoolean, useResizeObserver, …
│   │       ├── utils/                 # polymorphicForwardRef, clsx, mergeProps, …
│   │       ├── types/                 # ExtendableProps, Merge, …
│   │       └── index.ts               # Re-exports React Aria hooks/utilities/types + Koobiq hooks/utilities/types
│   ├── primitives/                    # React Aria primitives integration layer (@koobiq/react-primitives)
│   │   └── src/
│   │       ├── components/            # Koobiq primitives built on React Aria
│   │       ├── behaviors/             # Koobiq behavior hooks built on React Aria
│   │       └── index.ts               # Re-exports unmodified React Aria hooks/state/types + RAC components + Koobiq primitives and behavior hooks
│   ├── components/                    # Koobiq React components (@koobiq/react-components)
│   │   └── src/
│   │       ├── components/            # All component source files
│   │       ├── styles/                # CSS mixins, utility classes
│   │       ├── utils/                 # Component-level helpers
│   │       ├── types.ts
│   │       ├── global.css
│   │       └── index.ts
│   └── icons/                         # A collection of React-icons (@koobiq/react-icons)
├── docs/                              # MDX documentation pages (rendered in Storybook)
├── .storybook/                        # Storybook configuration
├── tools/                             # Internal tooling
├── scripts/                           # Repository automation (release, llms.txt generation)
├── templates/                         # Next.js and Vite starter templates
├── package.json                       # Root monorepo config
├── pnpm-workspace.yaml
├── turbo.json
├── vite.config.mts                    # Shared Vite + Vitest config
└── vitest.workspace.ts
```

## Tech Stack

| Concern                  | Tool                                                                      |
| ------------------------ | ------------------------------------------------------------------------- |
| Package manager          | pnpm 9.12.2                                                               |
| Node version             | >=20.19                                                                   |
| Monorepo orchestration   | Turborepo                                                                 |
| Language                 | TypeScript 6 (strict)                                                     |
| Framework                | React 19 (18 supported)                                                   |
| Bundler                  | Vite 7                                                                    |
| CSS processing           | Lightning CSS                                                             |
| Linting                  | ESLint, Stylelint                                                         |
| Formatting               | Prettier                                                                  |
| Component playground     | Storybook 10                                                              |
| Testing                  | Vitest 4 + React Testing Library                                          |
| Accessibility primitives | React Aria (`react-aria-components`, `@react-aria/*`, `@react-stately/*`) |
| Design tokens            | `@koobiq/design-tokens` (`--kbq-*` CSS custom properties)                 |

React Aria packages are pinned to exact versions and updated together.

## Key Commands

```bash
# Install dependencies
pnpm install

# Start Storybook playground (dev mode)
pnpm dev
# Then visit http://localhost:6006

# Build all packages
pnpm build

# Build Storybook
pnpm build-storybook

# Run tests
pnpm test                          # watch mode
pnpm vitest run                    # one-off run
pnpm vitest run Button.test.tsx    # one test file
pnpm test:coverage

# Type check
pnpm type-check

# Lint and format
pnpm lint
pnpm lint:fix
pnpm format:write
```

## Component Architecture

Components are built on top of [`react-aria-components`](https://react-spectrum.adobe.com/react-aria/) (RAC) via `@koobiq/react-primitives`. When RAC doesn't fit, drop down to lower-level `@react-aria/*` and `@react-stately/*` hooks.

### File Convention

Each component lives in its own directory under `packages/components/src/components/`:

```
packages/components/src/components/Button/
├── Button.tsx            # component implementation
├── Button.mdx            # documentation page (Storybook)
├── types.ts              # prop types (exported as public API)
├── Button.module.css     # CSS Modules styles
├── Button.stories.tsx    # Storybook stories
├── Button.test.tsx       # Vitest + Testing Library unit tests
└── index.ts              # component entry point
```

Some complex components may also contain `components/`, `utils.ts`, `intl.ts` or `intl.json`, and `__tests__/`. Follow nearby component patterns before adding new structure.

### Styling Approach

- CSS Modules. Class names are hashed and not part of the public API — don't target them externally; use `data-*` attributes and public props instead.
- Expose state via `data-*` attributes (`data-loading`, `data-fullwidth`, …). Set them as `data-loading={isLoading || undefined}` so the attribute is absent in the false state.
- Visual values come from `@koobiq/design-tokens` CSS custom properties (`--kbq-*`). Don't hard-code a value that has a token.
- Use logical CSS properties (`inline-size`, `padding-inline`, `inset`). Stylelint warns on physical ones (`stylelint-plugin-logical-css`); `pnpm lint:fix` auto-converts them.
- Only use CSS features supported by the project's [browserslist](package.json) targets.
- Mostly plain CSS. Mixins are used for typography and text ellipsis (`packages/components/src/styles/mixins.css`).

### Prop System

- Props with a fixed set of allowed values are exported as `as const` arrays plus a derived union type:

  ```ts
  export const buttonVariant = ['contrast-filled', 'fade-contrast-filled', ...] as const;
  export type ButtonVariant = (typeof buttonVariant)[number];
  ```

- All boolean props default to `false`. If `true` would be the natural default, invert the name (e.g. `hideArrow` instead of `showArrow={true}`).
- Deprecated props warn via `deprecate()` (from `@koobiq/logger`) guarded by `process.env.NODE_ENV !== 'production'`:

  ```tsx
  if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
    deprecate('Button: "disabled" is deprecated. Use "isDisabled" instead.');
  }
  ```

## Coding Conventions

- Prettier for formatting.
- Type-only imports use `import type`.
- ESLint and Stylelint, configured in the repo.
- Every component `.tsx` starts with `'use client'` (Next.js RSC).
- Keep files focused. When the main file grows, split helpers, hooks, sub-components, and translations into separate files (`utils.ts`, `intl.ts`, nested `components/`) as already done in complex components.
- Public exports go through the component's local `index.ts`, then `packages/components/src/components/index.ts`.

## Git Commit Convention

All commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are validated by commitlint.
Only `feat` and `fix` appear in the changelog. Keep titles short (≤100 chars).

| Type       | When to use                              |
| ---------- | ---------------------------------------- |
| `feat`     | New feature or component                 |
| `fix`      | Bug fix                                  |
| `refactor` | Code change with no behavior change      |
| `chore`    | Maintenance, deps, config                |
| `docs`     | Documentation only                       |
| `perf`     | Performance improvement                  |
| `test`     | Tests only                               |
| `style`    | Code style, formatting (no logic change) |

Examples:

```
feat(Button): add `isLoading` prop
fix(Checkbox): resolve disabled state not applying
chore(deps): bump `typescript` from 5.7.3 to 6.0.3
```

## Important Notes for Agents

- When Storybook runs locally, an MCP server is available at `http://localhost:6006/mcp` (via `@storybook/addon-mcp`) — use it for component introspection.
- Pre-commit runs `nano-staged`: ESLint and related Vitest tests for TS/JS, Stylelint for CSS, `pnpm type-check` on staged changes, Prettier for docs-like files. Before committing, also run `pnpm vitest run <path>` and `pnpm type-check` for the area you touched.
- Component stories (`*.stories.tsx`) use the `Components` group and `tags` such as `status:new`, `status:updated`, `status:deprecated`. For `new`/`updated`, include a `date:YYYY-MM-DD` tag — Storybook uses it to expire temporary badges.
