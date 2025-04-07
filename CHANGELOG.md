# Changelog

## [0.0.1-beta.8](https://github.com/koobiq/react-components/compare/0.0.1-beta.7...0.0.1-beta.8) (2025-04-07)

### 🚀 Features

- **components/Checkbox:** add animation for check icon ([216ed46](https://github.com/koobiq/react-components/commit/216ed46dd60167442503f6031a4892798d3f37d9))
- **components/Input:** add `group` support to slotProps ([241607f](https://github.com/koobiq/react-components/commit/241607f4bb71b580d9e01a5993c7e5dfda31cc06))
- **components:** add experimental AnimatedIcon component ([0ce8ee6](https://github.com/koobiq/react-components/commit/0ce8ee66ffb40b6159a17315743fb4ffe675ae52))
- **core:** add experimental `useRefs` hook ([2a4a654](https://github.com/koobiq/react-components/commit/2a4a654a447306825493f9f32851dd5f35ff9f35))
- **icons:** add IconDesktopMultipleO16, IconDesktopO16, IconDesktopPlusO16, IconCloudBadgeGlobe24 ([7ae21e9](https://github.com/koobiq/react-components/commit/7ae21e9ae374f73498213ca0ca58328e1c24c302))
- **icons:** improve existing icons ([6d869cc](https://github.com/koobiq/react-components/commit/6d869cc584c22846cc49ad52ea11b3ebece00ecd))

### 🐞 Bug Fixes

- **components/List:** improve styles ([758ddad](https://github.com/koobiq/react-components/commit/758ddad788a8aacbccf752f133dd00f42fb1f312))

## [0.0.1-beta.7](https://github.com/koobiq/react-components/compare/0.0.1-beta.6...0.0.1-beta.7) (2025-04-02)

### 🚀 Features

- **components/Modal:** add `shouldCloseOnInteractOutside` to ignore specific elements on outside click ([675f463](https://github.com/koobiq/react-components/commit/675f46302f9aa746db7214143ecbba701d0d5c9f))
- **components/Popover:** add `shouldCloseOnInteractOutside` prop to ignore specific elements on outside click ([5b28198](https://github.com/koobiq/react-components/commit/5b28198bf3fb4d2ca5a69237a026261984b23b7d))
- **components/SidePanel:** add `shouldCloseOnInteractOutside` prop to ignore specific elements on outside click ([b50828e](https://github.com/koobiq/react-components/commit/b50828e56f69ddf4cd9bdb4101dc8ec2254cfc7c))

## [0.0.1-beta.6](https://github.com/koobiq/react-components/compare/0.0.1-beta.5...0.0.1-beta.6) (2025-04-01)

### 🚀 Features

- **components/List:** add support for slotProps ([e109b6a](https://github.com/koobiq/react-components/commit/e109b6ac40d8d3ad78374aba7649dcf364463731))
- **components/Popover:** add `backdrop` support to slotProps ([66ff5a5](https://github.com/koobiq/react-components/commit/66ff5a53295ac0faf1e758c3a0242e71b052b9f4))
- **components/Popover:** support `containerPadding` between the popover and its container ([5510693](https://github.com/koobiq/react-components/commit/5510693205a991c903253a4d5ee1cbef0a8025c6))
- **components/Provider:** add `breakpointsFallback` to support SSR fallback for breakpoints ([0ee51ee](https://github.com/koobiq/react-components/commit/0ee51ee4504361c9a4d1dc69de116f0ac93ed88a))

### 🐞 Bug Fixes

- **components/Popover:** adapt `anchorRef` typing for React 19 ([7a85e8a](https://github.com/koobiq/react-components/commit/7a85e8a6400c48e4363610ad1150cdd1fcc6d822))
- **components/Tooltip:** adapt `anchorRef` typing for React 19 ([24bef72](https://github.com/koobiq/react-components/commit/24bef72b709e81df739d2d9e85f7debbeb5c2721))

## [0.0.1-beta.5](https://github.com/koobiq/react-components/compare/0.0.1-beta.4...0.0.1-beta.5) (2025-03-27)

### 🚀 Features

- **components/flex:** extend `flex` with the `colGap` and `rowGap` props ([21b31e8](https://github.com/koobiq/react-components/commit/21b31e82f5b8a399331f4a5af073868c7d7d4b82))
- **components/Typography:** add 'inherit' value to color prop ([d093483](https://github.com/koobiq/react-components/commit/d0934830b3394ee8905b99c8ef8643167943d376))
- **components:** add experimental FlexBox component ([9e9608a](https://github.com/koobiq/react-components/commit/9e9608a56750d6cf5e67fb466b3861c2786969e6))

### 🐞 Bug Fixes

- **primitives/core/components:** add 'use client' to relevant components and hooks ([e5bb7e5](https://github.com/koobiq/react-components/commit/e5bb7e562b06859b1919c0bb0ff8c8eef0f4747b))

## [0.0.1-beta.4](https://github.com/koobiq/react-components/compare/0.0.1-beta.3...0.0.1-beta.4) (2025-03-26)

### 🐞 Bug Fixes

- **components:** restore lost style.css during migration to Vite 6 ([45c25d2](https://github.com/koobiq/react-components/commit/45c25d2b90d4af4e54353741b5a85cc002cdc2fd))

## [0.0.1-beta.3](https://github.com/koobiq/react-components/compare/0.0.1-beta.2...0.0.1-beta.3) (2025-03-25)

### 🚀 Features

- **components/Tooltip:** add support for `portalContainer` ([e09d622](https://github.com/koobiq/react-components/commit/e09d622c659aa5315ba1eed1c8fd79ce9bdb3178))
- **components:** bump @koobiq/design-tokens from 3.11.2 to 3.12.1 ([e65e8fe](https://github.com/koobiq/react-components/commit/e65e8fea5262d04b2b59848aa45018c93705222b))
- **icons:** improve `IconMagnifyingGlassBadgeSparkles16` icon ([d69bec3](https://github.com/koobiq/react-components/commit/d69bec301c0e5ab2203f8f5da4ab9497b59f138d))

### 🐞 Bug Fixes

- **components/Tooltip:** extend and generalize types for the `control` prop ([128f826](https://github.com/koobiq/react-components/commit/128f8262c40bb755475e764c769cf51793c4cdce))

## [0.0.1-beta.2](https://github.com/koobiq/react-components/compare/0.0.1-beta.1...0.0.1-beta.2) (2025-03-24)

### 🚀 Features

- **components:** add experimental List component ([f72b5cf](https://github.com/koobiq/react-components/commit/f72b5cfae5428406e0ac0a5b22286a4de4577503))

## 0.0.1-beta.1 (2025-03-21)

- 🎉 first release!
