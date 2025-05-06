# Changelog

## [0.0.1-beta.14](https://github.com/koobiq/react-components/compare/0.0.1-beta.13...0.0.1-beta.14) (2025-05-06)

### 🚀 Features

- **components/Dialog:** import components via `Dialog.Header`, `Dialog.Body`, `Dialog.Footer` ([91fb292](https://github.com/koobiq/react-components/commit/91fb29263c444c145440f2e57ef65690e878b2f9))
- **components:** add the `Divider` component ([a84dfb5](https://github.com/koobiq/react-components/commit/a84dfb5c9c191ece144daa020aa96fa2bb061b6e))
- **primitives:** export common utilities ([ca659d9](https://github.com/koobiq/react-components/commit/ca659d9f2691f88dbafe188f0fe03065208a1177))

### 🐞 Bug Fixes

- **components/Typography:** deprecate `TypographyDisplayVariant` ([1f29252](https://github.com/koobiq/react-components/commit/1f292520c26d08159212d4aa5488911a57a5f159))

## [0.0.1-beta.13](https://github.com/koobiq/react-components/compare/0.0.1-beta.12...0.0.1-beta.13) (2025-04-28)

### 🚀 Features

- **components/Button:** migrate to react-aria `onPress` event ([96c8ed3](https://github.com/koobiq/react-components/commit/96c8ed3a746041dd8723c1f02d442e41603e7681))
- **components/Grid:** import subcomponents via Grid.Item ([501474c](https://github.com/koobiq/react-components/commit/501474c7019ec0a50426dd42e54de12be53eac61))
- **components/Link:** migrate to react-aria `onPress` event ([40885c7](https://github.com/koobiq/react-components/commit/40885c7073e553f514cf26c5ab54a1ca2f2b65e6))
- **components/List:** import components via `List.Item`, `List.Section`, `List.ItemText` ([f66baed](https://github.com/koobiq/react-components/commit/f66baed6c53308f605970847acbe02589a46ec81))
- **components/Modal:** import components via `Modal.Header`, `Modal.Body`, `Modal.Footer` ([6474c9f](https://github.com/koobiq/react-components/commit/6474c9ff8cfe78bd1aa9e5638b1bc92f1fa346db))
- **components/Popover:** import components via `Popover.Header`, `Popover.Body`, `Popover.Footer` ([f1c0d82](https://github.com/koobiq/react-components/commit/f1c0d822bf9c9a468cbd4e6eac172b0f37180a80))
- **components/Select:** import components via `Select.Item`, `Select.Section`, `Select.ItemText` ([092e6d2](https://github.com/koobiq/react-components/commit/092e6d265045d315d5b7d756af6d0d184f797dd1))
- **components/SidePanel:** import components via `SidePanel.Header`, `SidePanel.Body`, `SidePanel.Footer` ([6a00b0e](https://github.com/koobiq/react-components/commit/6a00b0e849419b9001b8c31c2328a0e62939df7a))
- **core:** add useDebounceCallback hook ([b84af37](https://github.com/koobiq/react-components/commit/b84af3705af5d0399c3cacdf67edddc558a4028b))

### 🐞 Bug Fixes

- **components/ListItem:** add common props (className, style, data-testid) ([7b9376c](https://github.com/koobiq/react-components/commit/7b9376c1978d33ecfba3df8deee860151e229988))

## [0.0.1-beta.12](https://github.com/koobiq/react-components/compare/0.0.1-beta.11...0.0.1-beta.12) (2025-04-18)

### 🚀 Features

- **components/Alert:** mark the component as stable ([f2f7316](https://github.com/koobiq/react-components/commit/f2f7316fc165464f8ccbd4323a92ed7c094e77a0))
- **components/Badge:** mark the component as stable ([56c3d89](https://github.com/koobiq/react-components/commit/56c3d8956d1e0ab1743e6fb0db77766751e1ce7f))
- **components/Container:** mark the component as stable ([6585478](https://github.com/koobiq/react-components/commit/65854788983495ca714023973175bd58b548b376))
- **components/FlexBox:** mark the component as stable ([599ddba](https://github.com/koobiq/react-components/commit/599ddbaf8cda56adc1635c2a2555b8ce915f01af))
- **components/Grid:** mark the component as stable ([3b521ee](https://github.com/koobiq/react-components/commit/3b521ee0fd9dee818f74a604f36f8c570eb6146c))

### 🐞 Bug Fixes

- **components/Popover:** resolve React warnings related to DOM attributes ([7dde183](https://github.com/koobiq/react-components/commit/7dde1832b35dd1f0aa276a73609b10c8f5eb1914))

## [0.0.1-beta.11](https://github.com/koobiq/react-components/compare/0.0.1-beta.10...0.0.1-beta.11) (2025-04-15)

### 🐞 Bug Fixes

- **components/Select:** improve CSS layout ([2a08e6a](https://github.com/koobiq/react-components/commit/2a08e6a983c4cde511d88decdef36453d8bbea66))

## [0.0.1-beta.10](https://github.com/koobiq/react-components/compare/0.0.1-beta.9...0.0.1-beta.10) (2025-04-15)

### 🚀 Features

- **components:** add experimental Select component ([ae4c746](https://github.com/koobiq/react-components/commit/ae4c746daf7622bcdb7c4acadae0f8bf58d2e4d1))
- **primitives/Button:** add data attributes for hovered, pressed, focused, disabled, and focus-visible ([5f0bad6](https://github.com/koobiq/react-components/commit/5f0bad6fc95be7b950608db4940a13d0ce3e6983))
- **primitives:** add useSelect hook ([9eb45c5](https://github.com/koobiq/react-components/commit/9eb45c58857c1fc6836e782472fb10b5acf3e23b))
- **templates/nextjs:** improve the template ([8be665b](https://github.com/koobiq/react-components/commit/8be665bfbaf21160799b64574662e03974727c24))
- **templates/vite:** improve the template ([2126e08](https://github.com/koobiq/react-components/commit/2126e08c2813421aed6971d6dfff8156da494ca3))

### 🐞 Bug Fixes

- **components/Button:** prevent hover and active styles when in progress ([42190b5](https://github.com/koobiq/react-components/commit/42190b5d5c0edda2446265c80f6ea47905972ed1))
- **components/Popover:** fix animation bug caused by key placement ([e0f6ea0](https://github.com/koobiq/react-components/commit/e0f6ea03f8e37f35af7e6d957c0ac81cb6d7840c))
- **components/Tooltip:** fix animation bug caused by key placement ([a913cac](https://github.com/koobiq/react-components/commit/a913cac368233d0b67011f48c36d1e3b6dfa12f0))

## [0.0.1-beta.9](https://github.com/koobiq/react-components/compare/0.0.1-beta.8...0.0.1-beta.9) (2025-04-10)

### 🚀 Features

- **components/FieldInputGroup:** add `start` and `end` support to slotProps ([a3569a5](https://github.com/koobiq/react-components/commit/a3569a58d6e2267f27bdbceda6adeca0805bd36d))
- **components/List:** support `autoFocus` prop for initial focus management ([528d261](https://github.com/koobiq/react-components/commit/528d26168fa9e2024763d5474180fca8239c2158))
- **components/Radio:** add animation for circle icon ([834f7be](https://github.com/koobiq/react-components/commit/834f7beb5d9193abcbd7e4062d70e03ef93b7d86))
- **primitives/Link:** support custom tabIndex ([25ce74b](https://github.com/koobiq/react-components/commit/25ce74ba6cf05040907b592b874f9875072030ad))

### 🐞 Bug Fixes

- **components/Input:** show not-allowed cursor when disabled ([448d1dd](https://github.com/koobiq/react-components/commit/448d1dd034a54bcbb872a96a3f6d309a739dea8c))
- **components/Link:** add outline for focus-visible state ([d8d6007](https://github.com/koobiq/react-components/commit/d8d60075253764fcfaf788636fd92624af7dfd4b))
- **components/Link:** prevent focus when disabled ([4f6e485](https://github.com/koobiq/react-components/commit/4f6e485161c3d6c2f029dc8d40a85653cfa7a706))
- **components/Popover:** ensure correct autofocus by positioning popover before animation starts ([d966ada](https://github.com/koobiq/react-components/commit/d966adac148b4c5fc778331425ac92ac85e0f120))

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
