---
name: upgrade
description: Plan and carry out an upgrade of @koobiq/react-components (and its design-tokens / react-icons peers) in a product — changelog range, public API changes of the components the app uses, new deprecations, lifecycle risks, peer bumps — as a file-by-file migration checklist, then apply it after confirmation.
when_to_use: The user asks to update Koobiq or asks what breaks or changes between Koobiq versions ("обнови koobiq до 0.38", "what changes if we upgrade to 0.37?", "migrate off deprecated Koobiq APIs").
argument-hint: '[target version|latest] [--apply]'
allowed-tools: Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-upgrade.mjs" *) Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-upgrade.mjs *) Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-check.mjs" *) Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-check.mjs *) Bash(npm view *) Bash(git rev-parse *) WebFetch(domain:react.koobiq.io) WebFetch(domain:raw.githubusercontent.com)
---

# Koobiq upgrade

Arguments: `$ARGUMENTS`

Never edit `package.json` or lockfiles and never run an install without an
explicit confirmation from the user.

1. **Versions.** Read the installed `@koobiq/react-components`,
   `@koobiq/design-tokens`, `@koobiq/react-icons` and React versions
   (`node_modules/<pkg>/package.json`), the declared ranges in
   `package.json`, and the package manager (lockfile).
2. **Gather.**

   ```text
   node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-upgrade.mjs" --root <root> --to <version|latest> --cache-dir "${CLAUDE_PLUGIN_DATA}/upgrade-cache"
   ```

   It returns JSON: `from`, `to`, `versions` in between, `components` the
   app uses, `peerDependencies.changed`, `changelog` (per version: entries
   with `type` feat / fix / breaking, `scopes`, `relevant` for components in
   use), `apiDiffs` (removed / added lines of the public API reports, from
   0.34.0 on) and `status` per component. Without network it uses the cache
   (`--offline`) and lists what it could not fetch in `errors`. If `status`
   is empty, fetch `https://react.koobiq.io/llms/components-<name>.txt` and
   read `<Status variant>`.

3. **Usages.** Run the checker on the whole app for the current
   deprecations and the component inventory:

   ```text
   node "${CLAUDE_PLUGIN_ROOT}/scripts/koobiq-check.mjs" --root <root> --inventory full --out <tmp>/before.json
   ```

4. **Checklist.** Write it with `migration-checklist.md`: breaking changes
   and removed or renamed props and exports mapped to `file:line` usages,
   deprecations to clear now, peer bumps, experimental components in use,
   behavior fixes to retest, tokens that disappear. Read `apiDiffs` the way
   `public-api-and-upgrades.md` (guidelines references) explains: a removed
   member of a non-exported helper type does not show up, so read the
   changelog too.
5. **Ask** what to do: plan only, bump the versions, or bump and migrate
   the code. Show the exact install command for the detected package manager
   (e.g. `pnpm add @koobiq/react-components@0.37.0 @koobiq/design-tokens@^3.17.2`).
6. **After the bump** (only with confirmation): verify the installed
   version, run the project's type-check (TypeScript reports removed or
   renamed props), its linters, and the checker again. Update the checklist
   with what remains; offer the safe fixes from the review fix playbook.
   Do not commit.
