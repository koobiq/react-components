# Koobiq plugin for Claude Code

Notes for maintainers. The user guide is [docs/13-claude-code-plugin.mdx](../../docs/13-claude-code-plugin.mdx), published at https://react.koobiq.io/?path=/docs/ai-claude-code-plugin--docs.

The plugin reviews **product code** that uses `@koobiq/react-components`; it is not a reviewer for this repository. The marketplace (`koobiq-react`) is [.claude-plugin/marketplace.json](../../.claude-plugin/marketplace.json) at the repository root.

## Layout

| Path                         | What it holds                                                                                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.claude-plugin/plugin.json` | The manifest. It has no `version`, so users track commits                                                                                               |
| `agents/reviewer.md`         | `koobiq:reviewer`, the read-only agent that `/koobiq:review` delegates batches to                                                                       |
| `skills/`                    | `review`, `upgrade`, `setup-lint`, `init` (slash commands) and `guidelines` (model-invoked only) with its `references/`                                 |
| `lint/koobiq-core.mjs`       | Knowledge extraction from the installed `@koobiq/*` packages and every rule decision. The checker and both lint presets use it, and products get a copy |
| `lint/*.koobiq.mjs`          | The ESLint and Stylelint presets that `/koobiq:setup-lint` copies into a product's `.koobiq/`                                                           |
| `scripts/`                   | `koobiq-check` (the deterministic checker), `koobiq-review-prep`, `koobiq-upgrade`, `setup-lint`, `init-agents`, their `lib/` and `tests/`              |

## Conventions

- **One rule registry.** Every finding id lives in `RULES` in `lint/koobiq-core.mjs`, with its category, default severity and detector (`script`, `agent` or `both`). Skills, references, the agent and the presets refer to these ids; `references.test.mjs` fails on an unknown id or an undocumented agent rule.
- **No dependencies.** Scripts are ESM on Node.js 18.17+ with `node:` built-ins only. TypeScript is borrowed from the product when it has one; without it the checker falls back to a regex parser.
- **Read the installed packages, not this repository.** Products run whatever version they installed, so knowledge comes from `node_modules` at run time.
- **Never crash a run.** A failing check lands in `meta.skipped` or `meta.errors` of the report.

## Contract with the design system

These details of the built `@koobiq/react-components` are parsed by the plugin. Changing one of them breaks it, and `real.test.mjs` catches that when `KOOBIQ_DS_DIR` points at a build:

- the `deprecate()` message format: `'<Component>: the "<prop>" prop is deprecated. Use "<replacement>" prop to replace it.'`;
- CSS Module class names `kbq-<file>-<class>-<hash>` in `dist/style.css`, and the global classes `kbq-light`, `kbq-dark`;
- enum props exported as `export declare const <component>Prop<Name>: readonly [...]`;
- field components typed with `label?: FormFieldLabelProps`;
- the d.ts re-export graph starting at `exports['.'].types`, and the `./markdown` and `./code-block` entries;
- Storybook docs ids (`components-<name>--docs` and the guide pages linked from `RULES`).

When the setup guidance in `docs/0-welcome.mdx` changes, update `skills/guidelines/references/setup.md` and `skills/init/agents-block.md`.

## Lint preset versions

Files copied into products start with a header carrying `PRESET_VERSION` and a hash of their content. Bump `PRESET_VERSION` in `lint/koobiq-core.mjs` when products should re-run `/koobiq:setup-lint`: the checker then reports `setup/lint-preset-outdated` for older copies, and `setup/lint-preset-modified` for copies edited by hand.

## Test

```bash
pnpm test:plugin
claude plugin validate .
```

The contract test needs a build:

```bash
pnpm build
KOOBIQ_DS_DIR=packages/components pnpm test:plugin
```

Fixtures in `scripts/tests/fixtures/` are excluded from ESLint, Stylelint and Prettier: their `expect:` annotations pin line numbers.

Try the plugin from a product folder without installing it:

```bash
claude --plugin-dir to this repository < path > /plugins/koobiq
```

After editing the plugin, run `/reload-plugins` in the session.

Commits use the `plugin` scope, for example `fix(plugin): …`.
