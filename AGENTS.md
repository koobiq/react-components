# AGENTS.md — Koobiq React

> Context file for AI agents working in this repository.

## Project Overview

**Koobiq React** is an open-source React component library built on top of [React Aria](https://react-spectrum.adobe.com/react-aria/), focused on designing products related to cybersecurity.

- **Package:** `@koobiq/react-components`
- **License:** MIT
- **Documentation:** https://react.koobiq.io

## Tech Stack

| Technology              | Version | Purpose                                                                                                                       |
| ----------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Node.js                 | >=20.19 | Runtime                                                                                                                       |
| pnpm                    | 9.12.2  | Package manager                                                                                                               |
| React                   | 19.x    | UI framework                                                                                                                  |
| TypeScript              | 6.x     | Type safety                                                                                                                   |
| Turborepo               | 2.x     | Build orchestration                                                                                                           |
| Vite                    | 7.x     | Bundler                                                                                                                       |
| Storybook               | 10.x    | Component development                                                                                                         |
| Vitest                  | 4.x     | Testing                                                                                                                       |
| React Aria              | pinned  | Hooks, state, behavior, accessibility, and unstyled primitives (`react-aria-components`, `@react-aria/*`, `@react-stately/*`) |
| Lightning CSS           | 1.x     | CSS processing                                                                                                                |
| `@koobiq/design-tokens` | 3.x     | Design tokens (`--kbq-*` CSS custom properties)                                                                               |

## Monorepo Structure

```
├── packages/
│   ├── logger/                        # @koobiq/logger — deprecation/warning logger
│   ├── core/                          # @koobiq/react-core — shared hooks, utilities, types, providers
│   │   └── src/
│   │       ├── hooks/                 # useBoolean, useResizeObserver, …
│   │       ├── utils/                 # polymorphicForwardRef, clsx, mergeProps, …
│   │       └── types/                 # ExtendableProps, Merge, …
│   ├── primitives/                    # @koobiq/react-primitives — React Aria integration layer with Koobiq React behavior abstractions
│   │   └── src/
│   │       ├── components/            # Koobiq React primitives built on React Aria
│   │       └── behaviors/             # Koobiq React hooks built on lower-level React Aria behavior
│   ├── components/                    # @koobiq/react-components — depends on primitives (primary deliverable)
│   │   └── src/
│   │       ├── components/            # one folder per component
│   │       └── styles/                # shared PostCSS mixins, utility classes
│   └── icons/                         # @koobiq/react-icons — standalone SVGR icon library
├── docs/                              # MDX documentation pages (rendered in Storybook)
├── .storybook/                        # Storybook configuration
├── tools/                             # internal tooling
├── scripts/                           # repository automation scripts
└── templates/                         # Next.js and Vite starter templates
```

## Commands

| Action                      | Command                           |
| --------------------------- | --------------------------------- |
| Install dependencies        | `pnpm install`                    |
| Install and start Storybook | `pnpm dev`                        |
| Start Storybook             | `pnpm storybook`                  |
| Build all packages          | `pnpm build`                      |
| Test in watch mode          | `pnpm test`                       |
| Run all tests once          | `pnpm vitest run`                 |
| Test with coverage          | `pnpm test:coverage`              |
| Test a specific file        | `pnpm vitest run Button.test.tsx` |
| Lint JS + CSS               | `pnpm lint`                       |
| Auto-fix lint               | `pnpm lint:fix`                   |
| Format files                | `pnpm format:write`               |
| Type check                  | `pnpm type-check`                 |
| Build Storybook             | `pnpm build-storybook`            |

### Verification

Run the narrowest check that covers the change, then add broader checks if needed.

- Component-only change: run the affected test file with `pnpm vitest run <path>`.
- Type or public export change: run `pnpm type-check`.
- CSS or lint-sensitive change: run `pnpm lint`.
- Package boundary, build config, or broad shared behavior change: run `pnpm build`.

Pre-commit uses `nano-staged`: TS/JS files run ESLint and related Vitest tests, CSS runs Stylelint, staged changes run `pnpm type-check`, and docs-like files are formatted with Prettier.

## Git Commit Convention

All commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are validated by commitlint.

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

Only `feat` and `fix` appear in the changelog. Branch naming: `type/description` or `type/DS-XXXX/description` (ticket optional).

```
feat(Button): add isLoading prop
fix(Checkbox): resolve disabled state not applying
chore(deps): bump typescript to 6.x
```

## Component Architecture

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

### Layering

Build through the package layers instead of jumping straight to local component code. The intended dependency path is `core` → `primitives` → `components`:

1. **Core** (`@koobiq/react-core`) — shared hooks, utilities, DOM helpers, providers, and types used by the rest of the workspace.
2. **Primitives** (`@koobiq/react-primitives`) — unstyled components and behavior hooks built on React Aria and React Stately plus core utilities. This is where reusable accessibility, keyboard, focus, collection, and state behavior should live.
3. **Components** (`@koobiq/react-components`) — styled Koobiq React components that compose primitives, apply CSS Modules and design tokens, and expose the public design-system API.

When adding behavior, look for an existing primitive or core helper first. If the behavior is reusable, add or extend it in primitives or core before wiring it into a styled component. Drop down to lower-level React Aria hooks inside `@koobiq/react-components` only when the primitives layer cannot represent the use case — see the [React Aria advanced guide](https://react-spectrum.adobe.com/react-aria/advanced.html#hooks).

Supporting packages:

- **`@koobiq/react-icons`** — icon components, used as `startIcon`/`endIcon` props or inline.
- **`@koobiq/logger`** — `deprecate()` for deprecated prop warnings in development.

### File conventions

- Every component file must start with `'use client'` — required for Next.js RSC compatibility.
- Always use `import type` for type-only imports.
- Keep public exports explicit through the component `index.ts`, then through `packages/components/src/components/index.ts`.

### Props

Define props in `types.ts`, export via `index.ts`. Define variants as `as const` arrays:

```ts
export const buttonVariant = ['contrast-filled', 'fade-contrast-filled', ...] as const;
export type ButtonVariant = (typeof buttonVariant)[number];
```

**Naming:**

- State props: `is` prefix — `isDisabled`, `isLoading`, `isRequired`, `isReadOnly`, `isInvalid`, `isOpen`, `isSelected`. Never use HTML equivalents.
- Visual/layout modifiers: no prefix, default `false` — `fullWidth`, `onlyIcon`, `hideArrow`, `hiddenLabel`.

**Deprecated props:** warn via `deprecate()` guarded by `process.env.NODE_ENV !== 'production'`:

```tsx
if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
  deprecate('Button: "disabled" is deprecated. Use "isDisabled" instead.');
}
```

**Compound components:** sub-components that only make sense in context (e.g. `Select.Item`) are attached as static properties on the parent and cannot be used standalone.

**Form context:** form-aware components (inputs, selects, etc.) must consume `useForm()` from `../Form` to inherit applicable parent `<Form>` state such as `isDisabled` and, when supported by the component, `isReadOnly`.

### CSS

- CSS Modules only. Class names scoped as `kbq-{component}-{class}-{hash}` — unreachable from outside.
- Expose interactive state via `data-*` attributes (`data-loading`, `data-fullwidth`, …) so consumers can style by state.
- All visual values via `@koobiq/design-tokens` CSS custom properties (`--kbq-*`). Never hard-code a value that has a token.
- Use logical CSS properties (`inline-size`, `block-size`, `padding-inline`, `inset`) over physical ones.
- Prefer modern CSS over mixins within [`browserslist`](package.json) targets. Use mixins only when no native equivalent exists — `@mixin typography <token-name>` for typography, `@mixin ellipsis` for text overflow (`packages/components/src/styles/mixins.css`).

### Testing

Use this as a baseline checklist for component tests. When adding or changing a component, cover the items that are part of that component's public contract:

- `ref` forwarding
- `className` and `style` forwarding to the root element
- polymorphic `as` rendering the correct element, if supported
- `isDisabled`: unfocusable, non-clickable, expected ARIA/data state
- `isLoading`: action blocked, expected focus behavior, `aria-busy` and `aria-disabled`
- main interaction callbacks: `onPress`, `onChange`, `onSelectionChange`, etc.
- form-aware behavior inherited from `<Form>`
- deprecated props warn in development only

### Stories

Storybook is the primary dev workflow — `pnpm dev` (port 6006). When running locally, an MCP server is available at `http://localhost:6006/mcp` via `@storybook/addon-mcp`.

New or touched component stories use the `Components` group and include `tags`:

```tsx
export default {
  title: 'Components/Button',
  component: Button,
  tags: ['status:updated', 'date:2026-03-04'],
};
```

Valid status tags: `status:new`, `status:updated`, `status:deprecated`.

For `status:new` and `status:updated`, include a `date:YYYY-MM-DD` tag. Storybook uses this date to expire temporary badges. `status:deprecated` does not require a date.

### Adding a New Component

Start by finding the closest existing component by behavior and shape: field, overlay, collection, layout, polymorphic primitive, etc. Mirror that structure before introducing a new pattern.

1. Create `packages/components/src/components/ComponentName/` with `ComponentName.tsx`, `types.ts`, `index.ts`, `ComponentName.module.css`, `ComponentName.stories.tsx`, `ComponentName.mdx`, and a focused test file. Use `__tests__/` when nearby complex components already do.
2. Implement the public API in `types.ts` and the local `index.ts`; then export it from `packages/components/src/components/index.ts`.
3. Follow the Layering, Props, CSS, Testing, and Stories sections above instead of introducing component-local conventions.
4. Add MDX docs, stories, and focused tests together with the component implementation.
5. Verify according to the Verification section.
