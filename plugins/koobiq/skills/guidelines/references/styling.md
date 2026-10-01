# Styling with Koobiq tokens

Theme-aware values come from `@koobiq/design-tokens` (`web/new`). Before you
suggest a token, grep it in
`node_modules/@koobiq/design-tokens/web/new/css-tokens*.css`; color tokens
must exist under both `.kbq-light` and `.kbq-dark`.

| Group            | Tokens                                                                                                                                                                                                                                                                            |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color            | `--kbq-background-*`, `--kbq-foreground-*`, `--kbq-line-*`, `--kbq-icon-*`, interaction states `--kbq-states-{background,foreground,line,icon}-*`                                                                                                                                 |
| size             | `--kbq-size-3xs` 2px, `xxs` 4, `xs` 6, `s` 8, `m` 12, `l` 16, `xl` 20, `xxl` 24, `3xl` 32 … `7xl` 64; `--kbq-size-border-radius` 8px; `--kbq-size-border-width` 1px                                                                                                               |
| typography       | `--kbq-typography-<style>-{font-family,font-size,line-height,font-weight,letter-spacing,…}`; styles `text-{compact,normal,big}[-medium,-strong]`, `headline`, `title`, `subheading`, `display-*`, `caps-*`, `mono-*`, `tabular-*`, `italic-*` — prefer `<Typography variant="…">` |
| elevation        | `--kbq-shadow-{card,popup,overlay,outline,key,ambient}`, `--kbq-shadow-overflow-*`                                                                                                                                                                                                |
| other            | `--kbq-opacity-disabled`, `--kbq-opacity-overlay`                                                                                                                                                                                                                                 |
| from `style.css` | z-index `--kbq-layer-{default,absolute,topbar,modal,overlay,toast}` (950 / 1000 / 1100 for the top three), `--kbq-transition-{default,slow}`                                                                                                                                      |

Customization hooks, in this order: component props (`variant`,
`fullWidth`…), `className` on the component (layout only), `slotProps`,
`data-*` attributes in selectors (`[data-slot]`, `[data-variant]`, state
attributes), and documented override variables `--kbq-<component>-*` read by
the installed `dist/style.css` (grep `var(--kbq-<name>,`; e.g.
`--kbq-flag-size`, `--kbq-tag-color`, `--kbq-top-bar-*`, `--kbq-sidebar-*`).

## Rules

**token/unknown** — every `var(--kbq-…)` exists in the installed token set or
DS `style.css` · error (warning with a fallback) · script · fix the typo or
pick a real token · FP: product-defined variables in the same project.

**token/deprecated** — no tokens marked `/* DEPRECATED: … */`; the comment
names the replacement · warning · script.

**token/legacy-only** — names that exist only in the legacy set
(`--kbq-palette-*`, `--kbq-<color>-default`) · warning · script · migrate
before switching to `web/new`.

**token/raw-palette** — `--kbq-plt-*` and `--kbq-semantic-*` live on `:root`
and do not switch themes; UI uses semantic tokens · warning (error for
text/background) · agent · FP: data visualization.

**style/hardcoded-color** — literal colors in color, background, border,
outline, fill, stroke, shadows · warning when a token matches exactly,
otherwise info · both · suggest a semantic token from the property's family
present in both themes · FP: `transparent`, `currentColor`, `inherit`,
theme-split blocks (`:global(.kbq-dark) .x { … }`), brand assets, charts.

**token/raw-size** — spacing/radius values equal to `--kbq-size-*` · info ·
agent (script rule `style/hardcoded-spacing` is off by default) · FP: widths,
heights, grid tracks, `0`.

**token/raw-typography** — hand-written font properties; use
`<Typography variant>` or `--kbq-typography-<style>-*` · warning · agent ·
FP: third-party content.

**token/raw-shadow**, **token/raw-transition** — literal shadows and
transitions where `--kbq-shadow-*` / `--kbq-transition-*` exist · info ·
agent · FP: focus rings.

**token/scss-static-variable** — `$light-*` / `$dark-*` SCSS variables are
static values that never switch theme; use `var(--kbq-…)` · warning · script.

**token/defines-unknown-public-var** — the product defines `--kbq-*`
variables that are neither tokens nor override points; product variables use
their own prefix · warning · script.

**token/overrides-token** — redefining a design token re-themes the whole app;
prefer component override variables · info · script.

**style/hashed-class** — selectors or strings target hashed CSS-module
classes (`kbq-<file>-<class>-<hash>`) or `[class*="kbq-"]`; they change on
every release · error · script · FP: theme classes `kbq-light` / `kbq-dark`.

**style/ds-global-class** — internal global classes (`kbq-Tree*`) are not
public API · info · script.

**style/dom-structure** — selectors that depend on a Koobiq component's
internal DOM (`.card > div > span`) · warning · agent.

**style/private-var** — overriding private `--<component>-*` variables
(`--button-bg`) is not a stable contract · info · agent.

**style/important-on-ds** — `!important` against Koobiq styles · warning ·
script · use override variables or `slotProps`.

**style/hardcoded-z-index** — z-index ≥ 950 or equal to a layer value
competes with overlays; use `var(--kbq-layer-*)` · info · script · FP:
local stacking below 950.

**style/tailwind-raw** — Tailwind palette/arbitrary colors (`bg-white`,
`text-[#333]`) instead of tokens · warning · agent · FP: a Tailwind config
whose colors map to `var(--kbq-*)`.
