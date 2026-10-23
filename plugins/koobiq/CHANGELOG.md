# Changelog

Releases of the `koobiq` Claude Code plugin. The plugin is versioned on its own, apart from `@koobiq/react-components`: users receive a change only when `version` in `.claude-plugin/plugin.json` changes.

A pull request that changes what users get (skills, the agent, scripts, the lint preset) bumps `version` and adds a section here; CI checks both. Tests, fixtures, the README and this file don't need a bump.

- **Patch**: fixes, fewer false positives, wording.
- **Minor**: new checks, options or references.
- **Major**: removed or renamed commands, options or rule ids, and incompatible changes to the report schema or the lint preset.

## 1.0.0

First release.

- `/koobiq:review`: reviews product code against the design system with the `koobiq-check` checker and `koobiq:reviewer` agents; `--fix`, `--deep`, `--all`, `--base`, `--offline`.
- `/koobiq:upgrade`: migration checklist for an upgrade of `@koobiq/react-components`.
- `/koobiq:setup-lint`: the ESLint and Stylelint preset (preset version 1).
- `/koobiq:init`: Koobiq rules in the product's `AGENTS.md` or `CLAUDE.md`; `--share` registers the marketplace for the team.
- `koobiq:guidelines`: the rules Claude follows when it writes UI with Koobiq.
- The `koobiq-check` report follows `scripts/koobiq-check.schema.json` (schema version 1).
