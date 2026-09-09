# AGENTS.md — Koobiq React

> Context file for AI agents working in this repository. `CLAUDE.md` includes this file, so all agent guidance lives here.

## Project Overview

**Koobiq React** is an open-source React component library built on top of [React Aria](https://react-spectrum.adobe.com/react-aria/), used to build user interfaces for information-security products.

- **Package name:** `@koobiq/react-components`
- **Current version:** 0.x (check `packages/components/package.json` for the exact version)
- **License:** MIT
- **Documentation:** https://react.koobiq.io

## Repository Structure

Selected paths. The root also holds the lint, format, commit, and deploy configs not shown here.

```
├── packages/
│   ├── logger/                        # Client-side logging utilities (@koobiq/logger)
│   ├── core/                          # Common hooks, utilities, and types (@koobiq/react-core)
│   │   └── src/
│   │       ├── hooks/                 # useBoolean, useResizeObserver, useDOMRef, …
│   │       ├── utils/                 # polymorphicForwardRef, mergeProps, …
│   │       ├── styles/                # clsx
│   │       ├── types/                 # ExtendableProps, Merge, …
│   │       └── index.ts               # Re-exports selected React Aria utils/hooks/types + Koobiq hooks/utils/types
│   ├── primitives/                    # React Aria integration layer (@koobiq/react-primitives)
│   │   └── src/
│   │       ├── components/            # Unstyled Koobiq primitives built on React Aria (Button, TextField, Checkbox, …)
│   │       ├── behaviors/             # Koobiq behavior hooks (useButton, useTagList, useTreeSelect, …)
│   │       ├── intl/                  # Translations used by primitives
│   │       └── index.ts               # Re-exports React Aria hooks/state/types + RAC + Koobiq primitives and behaviors
│   └── components/                    # Styled Koobiq components (@koobiq/react-components)
│       └── src/
│           ├── components/            # All component directories + index.ts (public exports)
│           ├── hooks/                 # Component-level hooks
│           ├── styles/                # mixins.css, utility classes
│           ├── utils/                 # getResponsiveValue, …
│           ├── global.css             # --kbq-layer-* / --kbq-transition-* variables, .kbq-light / .kbq-dark
│           ├── types.ts               # Public type re-exports (PressEvent)
│           ├── index.ts               # Main entry (imports global.css)
│           ├── markdown.ts            # `@koobiq/react-components/markdown` entry
│           └── code-block.ts          # `@koobiq/react-components/code-block` entry
├── docs/                              # Guide MDX pages rendered in Storybook (numeric prefix sets the order)
├── .storybook/                        # Storybook config, MDX doc blocks (Meta, Story, Props, Status, Alert), decorators
├── tools/
│   ├── api-extractor/                 # Public API guard runner + config.json (guarded components/packages)
│   └── public_api_guard/              # Generated *.api.md reports — never edit by hand
├── scripts/                           # Release helpers, llms.txt generation
├── templates/                         # Next.js and Vite starter apps (excluded from lint and type-check)
├── package.json                       # Root monorepo config; `browserslist` lives here
├── pnpm-workspace.yaml
├── turbo.json
├── vite.config.mts                    # Shared CSS Modules/PostCSS config + Vitest projects and coverage
└── tsconfig.json                      # Root TS config; `paths` map @koobiq/react-* to packages/*/src
```

## Tech Stack

| Concern                  | Tool                                                                      |
| ------------------------ | ------------------------------------------------------------------------- |
| Package manager          | pnpm 9.12.2                                                               |
| Node version             | 24 (`.nvmrc`; `engines` requires `^24`)                                   |
| Monorepo orchestration   | Turborepo                                                                 |
| Language                 | TypeScript 6 (strict)                                                     |
| Framework                | React 19 (18 supported)                                                   |
| Bundler                  | Vite 7                                                                    |
| CSS processing           | Lightning CSS + postcss-mixins                                            |
| Linting                  | ESLint, Stylelint                                                         |
| Formatting               | Prettier                                                                  |
| Component playground     | Storybook 10                                                              |
| Testing                  | Vitest 4 + React Testing Library                                          |
| Accessibility primitives | React Aria (`react-aria-components`, `@react-aria/*`, `@react-stately/*`) |
| Design tokens            | `@koobiq/design-tokens` (`--kbq-*` CSS custom properties)                 |

React Aria packages are pinned to exact versions and updated together.

## Package Layering

Dependency order is `logger → core → primitives → components`; each package depends on the previous ones via `workspace:*`.

- `@koobiq/react-core` re-exports selected React Aria utilities (`@react-aria/utils`, `i18n`, `focus`, `interactions`, `@react-stately/utils`, `@react-types/*`) plus Koobiq hooks, utils (`clsx`, `polymorphicForwardRef`, `useDOMRef`, …) and types (`ExtendableProps`, `Merge`, …).
- `@koobiq/react-primitives` re-exports the remaining `@react-aria/*` / `@react-stately/*` hooks and `react-aria-components` (RAC), and adds unstyled Koobiq primitives and behavior hooks.
- `@koobiq/react-components` reaches React Aria **only through** `@koobiq/react-core` and `@koobiq/react-primitives`. Don't import `react-aria-components`, `@react-aria/*`, or `clsx` directly there; if something is missing, re-export it from core/primitives first.
- In dev, tests, and Storybook, `@koobiq/react-*` imports resolve to `packages/*/src` (root `tsconfig.json` `paths` + `vite-tsconfig-paths`, Storybook `resolve.alias`), so cross-package work needs no build. API Extractor is the exception: it reads `packages/*/dist/*.d.ts`, so run `pnpm build` before `check-api` / `approve-api`.

## Entry Points and Build Output

- `@koobiq/react-components` exposes three entries: `.` (`src/index.ts`), `./markdown`, and `./code-block`. `Markdown` and `CodeBlock` are kept out of the main entry because they need optional peer dependencies (`react-markdown`, `remark-gfm`, `highlight.js`). Follow the same pattern for any new component with a heavy optional dependency: its own `src/<name>.ts` entry, Vite `build.lib.entry`, `exports` in `package.json`, and an optional `peerDependencies` entry.
- Build = `vite build` (lib mode, ESM only, `preserveModules`, unminified, every dependency external) + `tsc -p tsconfig.build.json` for declarations. Component CSS is emitted as `dist/style.css` (`@koobiq/react-components/style.css`). Design-token CSS is imported by consumers (and Storybook), not bundled.
- Browser targets come from the root `package.json` `browserslist` and drive both esbuild and Lightning CSS.

## Key Commands

```bash
pnpm install
pnpm dev                           # pnpm install + Storybook at http://localhost:6006
pnpm build                         # turbo: build all packages
pnpm build-storybook               # also regenerates llms.txt

pnpm test                          # vitest watch mode (all packages)
pnpm vitest run                    # one-off run
pnpm vitest run Button.test.tsx    # one test file (works from the repo root)
pnpm test:coverage

pnpm type-check
pnpm lint                          # eslint + stylelint
pnpm lint:fix
pnpm format:write                  # prettier for json/md/mdx/html/yml/yaml/svg
pnpm format:check

pnpm check-api                     # needs a fresh `pnpm build`
pnpm approve-api                   # refresh all API reports
pnpm approve-api Button            # refresh one component
pnpm approve-api react-core        # refresh one package (react-primitives | react-core | logger)
```

CI (`.github/workflows`) runs `type-check`, `format:check`, `lint:css --max-warnings=0`, `lint:js --max-warnings=0`, `vitest --run`, and `build && check-api`. Because of `--max-warnings=0`, Stylelint/ESLint **warnings fail CI**.

## Component Architecture

Components are built on top of RAC via `@koobiq/react-primitives`. When RAC doesn't fit, drop down to lower-level `@react-aria/*` and `@react-stately/*` hooks (still through the core/primitives re-exports).

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

### Component Anatomy

`Button` (`packages/components/src/components/Button`) is the reference implementation:

- `'use client'` is the first line.
- Polymorphic components use `polymorphicForwardRef<'button', XBaseProps>` and export `type XProps<As extends ElementType = 'button'> = ComponentPropsWithRef<typeof X<As>>`; non-polymorphic ones use `forwardRef`.
- Prop types are composed with `ExtendableProps<OwnProps, PrimitiveProps>`; every prop has a JSDoc description (`@default` where relevant) — Storybook's Props table is generated from those comments.
- Always set `X.displayName`.
- Class names come from the CSS Module via `clsx(s.base, …)`; primitives accept a RAC-style `className` render-prop function that maps interaction state (`isHovered`, `isPressed`, `isFocusVisible`, `isDisabled`, `isLoading`) to classes.
- Expose `data-variant`, `data-slot="<name>"`, and boolean `data-*` state attributes; accept a `data-testid` prop.
- Parent context wins: e.g. `Button` reads `useButtonGroupContext()` and lets the group's `variant` / `isDisabled` / `isLoading` override its own props.

### Localization

User-facing strings live next to the component in `intl.json` (or `intl.ts` when a message is a function), keyed by locale with **both** `en-US` and `ru-RU`, and are read with `useLocalizedStringFormatter(intlMessages)` from `@koobiq/react-core`. The active locale comes from `Provider` (`I18nProvider`).

### Provider and Responsive Props

`Provider` supplies locale, router, and breakpoints (`xs 0`, `s 480`, `m 768`, `l 1024`, `xl 1280`, `xxl 1536`). Props typed as `T | ResponsiveValue<T>` accept a per-breakpoint object (`{ xs: 'column', m: 'row' }`); resolve them with `getResponsiveValue` from `src/utils`.

### Storybook Stories

- `title: 'Components/<Name>'`, `component`, `tags`, and `satisfies Meta<typeof X>`.
- Define story data and helpers inside `render` so they appear in the Source panel (the docs page shows the raw text of the story export).
- Don't add `argTypes` for props inferred from component types.
- If `render` uses hooks, use a named function: `render: function Render(args) { ... }`.
- Add every slot of a compound component to `meta.subcomponents`.
- The global decorator wraps every story in `Provider` (locale from the toolbar) and, in story view, `ToastProvider`; set `parameters.preventToastProvider` to opt out.

### MDX Docs Page

`X.mdx` imports `Meta, Story, Props, Status` (and `Alert` when needed) from `.storybook/components` and follows this shape: `<Meta of={Stories} />`, `# X`, `<Status variant="stable|experimental|deprecated|draft" />`, a one-line description, `## Import`, `## Usage`, `## Props`, then one section per feature with `<Story of={Stories.Feature} />`.

### Styling Approach

- CSS Modules. Generated class names are `kbq-<file>-<class>-<hash>`; `.base` is the root class of every module (its name is omitted from the generated class). Class names are hashed and not part of the public API — don't target them externally; use `data-*` attributes and public props instead.
- Expose state via `data-*` attributes (`data-loading`, `data-fullwidth`, …). Set them as `data-loading={isLoading || undefined}` so the attribute is absent in the false state.
- Visual values come from `@koobiq/design-tokens` CSS custom properties (`--kbq-*`). Don't hard-code a value that has a token.
- Use logical CSS properties (`inline-size`, `padding-inline`, `inset`). `stylelint-plugin-logical-css` reports physical ones as warnings, which fail CI; `pnpm lint:fix` auto-converts them.
- Stylelint also enforces: custom properties → declarations → nested rules order; the nesting selector `&` must start a compound selector; custom property names in kebab-case.
- Only use CSS features supported by the project's [browserslist](package.json) targets.
- Mostly plain CSS. Mixins (`postcss-mixins`) are used for typography and text ellipsis: `@import url('../../styles/mixins.css');` then `@mixin typography text-normal-medium;` / `@mixin ellipsis;`.
- Theme classes `kbq-light` / `kbq-dark` (from `global.css`) set `color-scheme`; z-index layers are the `--kbq-layer-*` variables from `global.css`.

### Component CSS Variables

Private `--<component>-*` variables define defaults.
Public `--kbq-<component>-*` variables are override points.

```css
/* Flag.module.css */
.base {
  --flag-border-radius: 0;

  border-radius: var(--kbq-flag-border-radius, var(--flag-border-radius));
}
```

- Never define public variables in component CSS.
- Public variables inherit, allowing parents to style nested components.

### Prop System

- Prefer standard ARIA attributes and existing prop names to keep component APIs consistent and familiar.
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

### Deprecation

- A replacement component gets the `Next` suffix (`Select` → `SelectNext`) and coexists with the deprecated one until the next major release (see `docs/9-deprecation-strategy.mdx`).
- Deprecated components and props carry a `@deprecated` JSDoc tag; the MDX page shows `<Status variant="deprecated" />` plus an `<Alert status="error">` linking to the replacement.

### Compound Components

Group related components under one public API. Consumers import the root component and access its slots as properties, for example `Component.Slot`.

```tsx
export type ComponentProps = ComponentPropsWithRef<'div'>;
export type ComponentSlotProps = ComponentPropsWithRef<'span'>;

const ComponentRoot = forwardRef<HTMLDivElement, ComponentProps>(
  (props, ref) => <div ref={ref} {...props} />
);

const ComponentSlot = forwardRef<HTMLSpanElement, ComponentSlotProps>(
  (props, ref) => <span ref={ref} {...props} />
);

export const Component = Object.assign(ComponentRoot, {
  Slot: ComponentSlot,
});
```

`Object.assign` builds the value first, so the compound type is inferred structurally — no local intersection type, and no cast claiming slots the value does not have yet. Derive the props type from the compounded component (`ComponentPropsWithRef<typeof Component>`), not from the private root, so API Extractor doesn't report the root as a forgotten export.

Export the root component and all prop types publicly. Expose slot components only through the root component.

## Public API (api-extractor)

The public surface of every component is locked by [API Extractor](https://api-extractor.com/) reports in `tools/public_api_guard/components/*.api.md` (plus one report per package: `react-primitives`, `react-core`, `logger`), checked in CI via `pnpm check-api`. The reports are generated from `dist/` and are excluded from ESLint/Prettier — never edit them by hand.

When adding a **new component** to the public API:

1. Add its name to the `components` array in `tools/api-extractor/config.json`.
2. Run `pnpm build && pnpm approve-api <Name>` to generate its `.api.md` report.
3. Commit the updated `config.json` and `.api.md` files alongside the component.

Any change to an existing component's exported types/signatures needs the same `pnpm build && pnpm approve-api <Name>` step — otherwise `pnpm check-api` fails in CI.

## Coding Conventions

- Prettier for formatting (single quotes, `trailingComma: es5`, 80-column ruler).
- Type-only imports use a separate `import type { … }` statement (ESLint `consistent-type-imports` with `separate-type-imports`; the components package also has `verbatimModuleSyntax`).
- Import order is enforced: builtin → external → internal → parent, alphabetized, blank line between groups, `react` first.
- Blank lines are required around multiline declarations/blocks and before `return` (`@stylistic/padding-line-between-statements`); `arrow-body-style: as-needed`; `no-plusplus` outside for-loop updates. `pnpm lint:fix` fixes most of these.
- TypeScript is strict with `noUncheckedIndexedAccess` (indexing yields `T | undefined`) and `noImplicitAny: false`.
- Every component `.tsx` starts with `'use client'` (Next.js RSC).
- Keep files focused. When the main file grows, split helpers, hooks, sub-components, and translations into separate files (`utils.ts`, `intl.ts`, nested `components/`) as already done in complex components.
- Public exports go through the component's local `index.ts`, then `packages/components/src/components/index.ts`.

## Testing

- Vitest projects are discovered from `packages/**/vite.config.ts`; the environment is jsdom with `globals: true`, jest-dom matchers, and `window.matchMedia` mocked in `packages/*/setupTests.ts`.
- Tests are colocated as `X.test.tsx` (larger components use `__tests__/`); use `@testing-library/user-event` for interactions and the `data-testid` prop that components accept.
- Coverage is measured for `packages/components` only, excluding stories and `index.*` files.

## Git Commit Convention

All commits follow [Conventional Commits](https://www.conventionalcommits.org/) and are validated by commitlint — the `commit-msg` hook locally and the **PR title** in CI. `main` history is one squash commit per PR, so the PR title becomes the commit message. Only `feat` and `fix` appear in the changelog. Keep titles short (≤100 chars).

Format in practice: `type(scope): subject (DS-NNNN)` — scope is the component name (`fix(Button): …`; several: `fix(Flag, Sidebar): …`) or `components` when adding a new component; `DS-NNNN` is the tracker ticket, when there is one.

| Type       | When to use                              |
| ---------- | ---------------------------------------- |
| `feat`     | New feature or component                 |
| `fix`      | Bug fix                                  |
| `refactor` | Code change with no behavior change      |
| `chore`    | Maintenance, config                      |
| `build`    | Dependency bumps, publishing             |
| `docs`     | Documentation only                       |
| `perf`     | Performance improvement                  |
| `test`     | Tests only                               |
| `style`    | Code style, formatting (no logic change) |

Examples:

```
feat(components): add `TimeRange` component (DS-5239)
feat(Button): add `isLoading` prop
fix(Checkbox): resolve disabled state not applying (DS-5384)
chore(deps): bump `typescript` from 5.7.3 to 6.0.3
```

`CHANGELOG.md` is generated at release time (`pnpm release`) — don't edit it by hand.

## Important Notes for Agents

- When Storybook runs locally, an MCP server is available at `http://localhost:6006/mcp` (via `@storybook/addon-mcp`) — use it for component introspection.
- Pre-commit runs `nano-staged`: ESLint `--fix` and `vitest related --run` for TS/JS, Stylelint `--fix` for CSS, `pnpm type-check` on any staged change, Prettier for docs-like files. Before committing, also run `pnpm vitest run <path>` and `pnpm type-check` for the area you touched.
- Component stories (`*.stories.tsx`) use the `Components` group and `tags` such as `status:new`, `status:updated`, `status:deprecated`. For `new`/`updated`, include a `date:YYYY-MM-DD` tag — Storybook uses it to expire temporary badges.
