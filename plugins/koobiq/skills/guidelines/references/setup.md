# Setup

How an app installs and wires up Koobiq React. Most setup rules are
project-level: report them once, on the entry file or `package.json`.

Rule format: **id** — rule · severity · detector (script / agent / both)
· how to verify · fix · false positives.

## Reference setup

```tsx
// app entry, in this order
import '@koobiq/design-tokens/web/new/css-tokens.css'; // all themes
import '@koobiq/design-tokens/web/new/css-tokens-light.css'; // .kbq-light
import '@koobiq/design-tokens/web/new/css-tokens-dark.css'; // .kbq-dark
import '@koobiq/react-components/style.css'; // component styles

import { Provider, ToastProvider } from '@koobiq/react-components';

<Provider locale={locale} router={{ navigate, useHref }}>
  <ToastProvider />
  <App />
</Provider>;
```

```html
<html lang="en" class="kbq-light">
  <!-- or kbq-dark; next-themes: attribute="class" themes={['kbq-light','kbq-dark']} -->
</html>
```

Packages: `@koobiq/react-components`, its peers `@koobiq/design-tokens` and
`@koobiq/react-icons`, React 18 or 19. `@koobiq/react-components/markdown`
also needs `react-markdown` and `remark-gfm`; `/code-block` needs
`highlight.js`. Fonts: Inter (400, 500, 600, 700, italic 400/500) and
JetBrains Mono (400, 700) via `@fontsource/*` or Google Fonts.

## Rules

**setup/legacy-token-set** — tokens come from `@koobiq/design-tokens/web/new/*`,
not the legacy `web/css-tokens*.css` · warning · script · grep token imports
in entry files, global CSS (`@import`) and `index.html` · switch the three
imports to `web/new/…` (there is no `web/new` font file; typography lives in
the base file). Before switching, run the checker: legacy-only names
(`--kbq-palette-*`, `--kbq-<color>-default`) used by product CSS must move to
web/new tokens first (`token/legacy-only`).

**setup/mixed-token-sets** — only one token set is imported · error · script ·
keep `web/new` only.

**setup/missing-tokens** — the base token file and the theme files of every
theme the app uses are imported · error · script · add the missing import ·
FP: tokens provided by a host app or shell (`setup.tokensProvidedExternally`
in `.koobiq/check.json`).

**setup/style-css-order** — `style.css` comes after the token imports in the
same file · warning · script · move the token imports up. Product overrides
of `--kbq-*` variables must load after `style.css`.

**setup/missing-style-css** — `@koobiq/react-components/style.css` is imported
once · error · script · import it in the app entry. Never import
`…/dist/style.css` (`import/deep`).

**setup/no-provider** — the app root renders `<Provider>` · warning · both ·
without it, responsive props resolve to `undefined`, locale falls back to
the browser and links ignore the router · wrap the root once (in Next.js
inside a client component used by `app/layout`).

**setup/provider-without-router** — with a client-side router, `<Provider
router={{ navigate, useHref }}>` makes Koobiq `Link`/`href` navigate without
reloads · info · both · FP: external links only.

**setup/ssr-breakpoints-fallback** — SSR apps that use responsive values pass
`breakpointsFallback` (e.g. `[true, true, true, true]`) · info · agent ·
FP: client-only apps.

**setup/no-theme-class** — some element gets `kbq-light` or `kbq-dark`;
theme tokens are defined only under those classes · warning · script.

**setup/theme-class-scope** — the theme class sits on `<html>` or `<body>`.
Modal, Popover, Tooltip, Menu and toasts portal into `document.body`; a theme
class on a wrapper `<div>` leaves them without theme tokens · warning (error
when overlays are used) · agent · verify where the class is set and whether
overlays are rendered · FP: overlays given a `portalContainer` inside the
themed element.

**setup/no-toast-provider** — `toast.add()` needs a mounted `<ToastProvider />`
· warning · script.

**setup/missing-fonts** — Inter / JetBrains Mono are loaded · info · script ·
FP: fonts provided by a host app.

**setup/missing-peer-dependency** — apps declare `@koobiq/design-tokens` and
`@koobiq/react-icons` within the DS peer ranges · warning · script · FP:
declared at the workspace root.

**setup/missing-optional-peer** — `/markdown` with `react-markdown` +
`remark-gfm`, `/code-block` with `highlight.js` · error · script.

**setup/ds-version-skew** — an app that pins `@koobiq/react-core` /
`@koobiq/react-primitives` keeps them on the versions the DS pins · warning ·
script · `npm ls @koobiq/react-core` / `pnpm why`.

**setup/duplicate-ds-packages** — one copy of each `@koobiq/*` package;
two copies mean two React contexts (Provider, router, locale) · warning ·
script · dedupe the lockfile.

**setup/library-peer** — a shared UI package lists `@koobiq/react-components`
in `peerDependencies` (dev dependency for its own tests), not in
`dependencies` · warning · agent · FP: apps.

**setup/vendored-tokens** — products import the token stylesheets instead of
copying hundreds of `--kbq-*` definitions · warning · script.

**setup/lint-preset-outdated**, **setup/lint-preset-modified** — the copied
`.koobiq/*.mjs` preset matches the plugin · info · script · re-run
`/koobiq:setup-lint`.
