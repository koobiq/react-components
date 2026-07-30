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
│   └── components/                    # Koobiq React components (@koobiq/react-components)
│       └── src/
│           ├── components/            # All component source files
│           ├── styles/                # CSS mixins, utility classes
│           ├── utils/                 # Component-level helpers
│           ├── types.ts
│           ├── global.css
│           └── index.ts
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

### Storybook Stories

- Keep each story self-contained: build any data or helper logic it needs inline inside that story's own `render`, not in shared module-level constants. The docs "Source" panel only extracts a single `export const StoryName` block, so anything defined outside it never appears there.
- Don't pass a prop that has no effect in that story's context (e.g. `userInfo` alongside `children`, since `children` short-circuits it) and don't pass a value equal to the prop's documented `@default` (e.g. `isCompact={false}`) — both are just noise in Source.
- Don't hand-write `argTypes` for props that already have an `as const` union type — Storybook infers the `select` control and its options automatically.
- If a story's `render` needs hooks (`useState`, …), write it as a named function expression, `render: function Render(args) { ... }`, instead of an arrow function, so `react-hooks/rules-of-hooks` recognizes it as a component without an eslint-disable comment.
- For compound components, add a `subcomponents` field to `meta` (see [Compound Components](#compound-components)) so the Props table documents every slot.
- Avoid `import * as NS` for large third-party packages in stories (icon sets, etc.) — use named imports so the Storybook bundle and startup stay fast.

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
- Prefer passing through real ARIA attributes (`role`, `aria-label`, `aria-labelledby`, `aria-hidden`) over inventing custom semantic props like `label`/`decorative` — it matches patterns consumers already know, and avoids clashing with props that mean something else elsewhere in the library (e.g. `label` usually means visible text).
- Don't add a prop for state that's already derivable from other props (e.g. an `isEmpty` prop when emptiness is derivable from `children` and can be styled via the CSS `:empty` pseudo-class).
- Document every optional prop's default with an explicit `@default` JSDoc tag, even when the default is `false`/`undefined`.
- Deprecated props warn via `deprecate()` (from `@koobiq/logger`) guarded by `process.env.NODE_ENV !== 'production'`:

  ```tsx
  if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
    deprecate('Button: "disabled" is deprecated. Use "isDisabled" instead.');
  }
  ```

### Compound Components

For components with slots (`Tabs.Tab`, `Tree.Item`, `TreeSelect.Item`, …), attach the sub-parts to the root component instead of exporting them standalone:

```tsx
export const Component = ComponentImpl as CompoundedComponent;
Component.Slot = ComponentSlot;
```

- Export the sub-parts' **prop types** from the component's `index.ts`, but not the components themselves — consumers reach them via `Component.Slot`, not a separate `ComponentSlot` import. This keeps one source of truth for the public API.
- A prop type that gets spread (`{...other}`) onto a real DOM node must extend that element's native props (`ComponentPropsWithRef<'span'>`, etc.), not a hand-rolled subset — otherwise `aria-*`/`data-*`/event props are unusable in TypeScript even though they work at runtime.
- Register slots under `subcomponents` in the story's `meta`, keyed by dot-path, so the docs Props table documents each slot's API:

  ```ts
  subcomponents: {
    'Component.Slot': Component.Slot,
  },
  ```

- Reference the dot-path form (`Component.Slot`) in MDX prose and import examples — never the internal component name.

## Public API (api-extractor)

The public surface of every component is locked by [API Extractor](https://api-extractor.com/) reports in `tools/public_api_guard/components/*.api.md`, checked in CI via `pnpm check-api`.

When adding a **new component** to the public API:

1. Add its name to the `components` array in `tools/api-extractor/config.json`.
2. Run `pnpm build && pnpm approve-api` to regenerate its `.api.md` report.
3. Commit the updated `config.json` and `.api.md` files alongside the component.

Any change to an existing component's exported types/signatures needs the same `pnpm build && pnpm approve-api` step — otherwise `pnpm check-api` fails in CI.

## Coding Conventions

- Prettier for formatting.
- Type-only imports use `import type`.
- ESLint and Stylelint, configured in the repo.
- Every component `.tsx` starts with `'use client'` (Next.js RSC).
- Keep files focused. When the main file grows, split helpers, hooks, sub-components, and translations into separate files (`utils.ts`, `intl.ts`, nested `components/`) as already done in complex components.
- Public exports go through the component's local `index.ts`, then `packages/components/src/components/index.ts`.
- When a render has many conditional branches, compute the values to render first (e.g. `primary`, `secondary`, `hint`), then render them once in unified markup — keep branch/selection logic separate from JSX.
- Every exported utility needs its intended usage scenario documented in the component's MDX — a signature alone doesn't explain why or when to reach for it, especially if the component itself doesn't call it internally.

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
