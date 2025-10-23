# Changelog

## [0.15.0](https://github.com/koobiq/react-components/compare/0.14.1...0.15.0) (2025-10-23)

### 🚀 Features

- **Select:** support async loading with progress indicator and infinite scroll (`isLoading`, `onLoadMore`) (DS-4273) ([d1d5397](https://github.com/koobiq/react-components/commit/d1d5397edd220175db85748762ddf82b0de1811a))

### 🐞 Bug Fixes

- **Select:** include 'use client' directive ([cac96ce](https://github.com/koobiq/react-components/commit/cac96ce6a93c751919c47c14364e9f28a04df3f8))

## [0.14.1](https://github.com/koobiq/react-components/compare/0.14.0...0.14.1) (2025-10-17)

### 🐞 Bug Fixes

- **Button:** correct `--button-boder-width` to `--button-border-width` ([554aaf2](https://github.com/koobiq/react-components/commit/554aaf246e9b605777405ff36bc81b10cfa54389))
- **Select:** limit dropdown height and set minimum width ([77236bc](https://github.com/koobiq/react-components/commit/77236bc11bfcdae94d35974c3a2fcdf131ae6d88))

## [0.14.0](https://github.com/koobiq/react-components/compare/0.13.1...0.14.0) (2025-10-14)

### 🚀 Features

- **Table:** support resizable columns (DS-4229) ([360471e](https://github.com/koobiq/react-components/commit/360471e99f9cbaa92e5ba8190db299afa4c77fd7))

### 🐞 Bug Fixes

- **List.Item:** forward `data-testid` prop to root element ([b884cd2](https://github.com/koobiq/react-components/commit/b884cd227f6c2915d4ab5cbb0d34fe393ad62a98))
- **Table,List:** fix client-side routing via Provider ([f5a38cb](https://github.com/koobiq/react-components/commit/f5a38cbfcc3be2ee11fc2c86ffd7d63cbe538cc4))
- **Table.Cell:** forward `data-testid` prop to root element ([63c89fa](https://github.com/koobiq/react-components/commit/63c89faee7d684d0148710c48d4bf64577e57183))
- **Table.Row:** forward `data-testid` prop to root element ([c34f03e](https://github.com/koobiq/react-components/commit/c34f03e9c3746f29398ae42023806fac7efa646b))

## [0.13.1](https://github.com/koobiq/react-components/compare/0.13.0...0.13.1) (2025-10-09)

### 🐞 Bug Fixes

- **Table:** fix broken horizontal align prop for `Table.Cell` (DS-4256) ([815cca4](https://github.com/koobiq/react-components/commit/815cca40a338c1b3c63390f9a170a8f32b2d908e))

## [0.13.0](https://github.com/koobiq/react-components/compare/0.12.0...0.13.0) (2025-10-08)

### 🚀 Features

- **components:** export `useAsyncList` hook from library ([de16cdd](https://github.com/koobiq/react-components/commit/de16cdd46f2eef1a1a420ec47592e0c5aac42c3a))
- **icons:** update icon set ([4fda3df](https://github.com/koobiq/react-components/commit/4fda3dff549d64ccdfbd3785daf9d80b88d34486))
- **Table:** add row sorting support (DS-4228) ([9bf69d6](https://github.com/koobiq/react-components/commit/9bf69d61f8655388a193b0784be578c226ae9422))
- **Table:** enable slotProps on `Table.Header` and `Table.Body` (DS-4252) ([353e76e](https://github.com/koobiq/react-components/commit/353e76e7011c5f53413a4400ec76f239e852141f))

## [0.12.0](https://github.com/koobiq/react-components/compare/0.11.1...0.12.0) (2025-10-02)

### 🚀 Features

- **Container:** add `placement`, deprecate `position` ([d71360f](https://github.com/koobiq/react-components/commit/d71360f1788f018f4a560be67c4287a53170de68))
- **Form:** add visual layout options and subcomponents (DS-4213) ([f5f3e87](https://github.com/koobiq/react-components/commit/f5f3e87634a81d0eaae100064e321488eae4d5e9))
- **FormField:** remove manual padding calc for addons in Input, Textarea, Select, etc. (DS-4215) ([7abd63d](https://github.com/koobiq/react-components/commit/7abd63d3900ac86970d34872b671dbf33925d110))

### 🐞 Bug Fixes

- **Button:** prevent [object Object] in `data-onlyicon` attribute ([b617237](https://github.com/koobiq/react-components/commit/b617237820344964d9c323afdcd0bb37658f03a4))
- **core/useResizeObserver:** calculate width/height using borderBoxSize (includes padding and border) ([5f07c0a](https://github.com/koobiq/react-components/commit/5f07c0ad8c338baea9f8a71959ad07be11c18858))
- **core/useResizeObserverRefs:** add environment guard for ResizeObserver ([8b64277](https://github.com/koobiq/react-components/commit/8b6427736841a860d53eea46e35925f9b6544b19))
- **FormField:** set correct `data-slot` value ([cf137e6](https://github.com/koobiq/react-components/commit/cf137e63dd30968f27b77b8e85f4c9605b91bf77))
- **primitives/RadioGroup:** correct `data-readonly` attribute handling ([eccf3fd](https://github.com/koobiq/react-components/commit/eccf3fd787ffb055e6345b42319767256e1e7e16))
- **TimePicker,DateInput,DatePicker:** use text cursor for value input fields ([b7df733](https://github.com/koobiq/react-components/commit/b7df7331dd40c9214b7b324fb3772c46985c939b))

## [0.11.1](https://github.com/koobiq/react-components/compare/0.11.0...0.11.1) (2025-09-19)

### 🐞 Bug Fixes

- **FormControl:** do not pass `labelAlign/labelPlacement` to DOM ([acefbbd](https://github.com/koobiq/react-components/commit/acefbbde16d6c369f674e8cc570259f3988ee2d2))
- **Select:** prevent deselecting value in single mode (DS-4177) ([6baf0a6](https://github.com/koobiq/react-components/commit/6baf0a6e9bdd30da1ff5958c560c3fcc98a5b1b3))

## [0.11.0](https://github.com/koobiq/react-components/compare/0.10.0...0.11.0) (2025-09-18)

### 🚀 Features

- **components:** add `Form` component (DS-4142) ([e943bbc](https://github.com/koobiq/react-components/commit/e943bbc60cc857f6837b8adc405b7f311b90c7c1))

### 🐞 Bug Fixes

- **DateInput, TimePicker:** use system HighlightText for segment selection color ([39e9d56](https://github.com/koobiq/react-components/commit/39e9d567c605679b6f4ddac3b613db3a2da93ed5))

## [0.10.0](https://github.com/koobiq/react-components/compare/0.9.0...0.10.0) (2025-09-16)

### 🚀 Features

- **Menu, Select:** expand item clickable area on sides (DS-4197) ([aef4af0](https://github.com/koobiq/react-components/commit/aef4af0e5b655366f65ac8137c4049bc61f2891b))
- **Select:** add `noItemsText` prop to display content when no options are available (DS-4172) ([101e207](https://github.com/koobiq/react-components/commit/101e207306983a49f3b06f88f1455810e7c3d108))

### 🐞 Bug Fixes

- **Select:** do not fail when items change with a selected item (DS-4176) ([bb673b5](https://github.com/koobiq/react-components/commit/bb673b56adee36bd78155b73100f9fb674b7aaf3))

## [0.9.0](https://github.com/koobiq/react-components/compare/0.8.0...0.9.0) (2025-09-12)

### 🚀 Features

- **components:** support `validationBehavior` and `validate` props in form controls (DS-4170) ([3d11061](https://github.com/koobiq/react-components/commit/3d11061c1406692410777224b2f9733f9f5e4124))

### 🐞 Bug Fixes

- **components:** omit data-\* boolean attributes when value is false (DS-4185) ([b9df77d](https://github.com/koobiq/react-components/commit/b9df77d1d19da0e439584825d3dab9ace76c2266))

## [0.8.0](https://github.com/koobiq/react-components/compare/0.7.1...0.8.0) (2025-08-27)

### 🚀 Features

- **components:** support `labelPlacement` and `labelAlign` in fields (Input, Select, Textarea, etc.) (DS-4140) ([bf86f32](https://github.com/koobiq/react-components/commit/bf86f32c003c451bb75bf1adb4983799137b43a9))
- **FormControlLabel:** make component polymorphic ([bcdb005](https://github.com/koobiq/react-components/commit/bcdb00579fafc7e42d4e406f0ccc886d819173ce))
- **RadioGroup:** support `labelPlacement`/`labelAlign` and other field props (DS-4141) ([d12778e](https://github.com/koobiq/react-components/commit/d12778e04c6a7c83a356c478e05d8afbbd5e2d05))

## [0.7.1](https://github.com/koobiq/react-components/compare/0.7.0...0.7.1) (2025-08-26)

### 🐞 Bug Fixes

- **components:** correct label color for field ([7963b67](https://github.com/koobiq/react-components/commit/7963b675dbffbc53800ed072463157cb5b11b659))
- **components:** skip &nbsp; in label when field is not required ([0865a66](https://github.com/koobiq/react-components/commit/0865a661ced1d47b615abc9b0406e89461fe105f))
- **Textarea:** add `style` prop type declaration ([2247500](https://github.com/koobiq/react-components/commit/2247500e519326111fb321b92515e6e9d6cb8b8d))

## [0.7.0](https://github.com/koobiq/react-components/compare/0.6.0...0.7.0) (2025-08-25)

### 🚀 Features

- **Calendar:** add days view animation ([95ad99d](https://github.com/koobiq/react-components/commit/95ad99d4b2b3729220abc6217f9ce4e8c78a275a))

### 🐞 Bug Fixes

- **DatePicker:** refine popover styling and animation ([b332daa](https://github.com/koobiq/react-components/commit/b332daad3e699dc7ccec0880d45ff9f7c8b55d82))

## [0.6.0](https://github.com/koobiq/react-components/compare/0.5.1...0.6.0) (2025-08-22)

### ⚠ BREAKING CHANGES

- **Table:** extracted the table container into a new `TableContainer` component.

### 🚀 Features

- **Table:** add `TableContainer` component (DS-4133) ([c2cb730](https://github.com/koobiq/react-components/commit/c2cb73091155c239e90b43e9588d0dfaf39d503f))

## [0.5.1](https://github.com/koobiq/react-components/compare/0.5.0...0.5.1) (2025-08-21)

### 🐞 Bug Fixes

- **components:** adjust spacing for label, caption, and error in fields (DS-4108) ([381a2bf](https://github.com/koobiq/react-components/commit/381a2bf067b7f03daefbe21f9087cbf734ccc6d2))

## [0.5.0](https://github.com/koobiq/react-components/compare/0.4.0...0.5.0) (2025-08-20)

### 🚀 Features

- **components:** add `SearchInput` component (DS-4046) ([8a930e3](https://github.com/koobiq/react-components/commit/8a930e3673e0f323bc4f856162ce12dcc35fedbc))

## [0.4.0](https://github.com/koobiq/react-components/compare/0.3.1...0.4.0) (2025-08-19)

### ⚠ BREAKING CHANGES

- **Select:** the Select API has been updated to support multiple selection. This affects several props (`defaultSelectedKey`, `selectedKey`, `renderValue`, `onSelectionChange`) and may require changes in existing code.

### 🚀 Features

- **List:** add `List.Divider` component (DS-4117) ([1619b11](https://github.com/koobiq/react-components/commit/1619b11d8974385de0d4d71c54c3e068e4ac9214))
- **Select:** add multi-select support and update API ([f6bd7f0](https://github.com/koobiq/react-components/commit/f6bd7f011860ab526d59c0753d38d430c1b53249))

### 🐞 Bug Fixes

- **List:** correct background color for List.Item in multi-select state (DS-4120) ([1cd6d23](https://github.com/koobiq/react-components/commit/1cd6d234767ea8e5cf5d3a0bbd00d956657efdbd))
- **Table:** correct background color for Table.Row in multi-select state (DS-4121) ([46ec62b](https://github.com/koobiq/react-components/commit/46ec62b616bc5f9a41f35f98337835fa3b29be52))
- **useHideOverflowItems:** include 'use client' directive ([570658d](https://github.com/koobiq/react-components/commit/570658dfc7049ee78c1308430f201fa9bfa216c6))

## [0.3.1](https://github.com/koobiq/react-components/compare/0.3.0...0.3.1) (2025-08-15)

### 🐞 Bug Fixes

- **Button, IconButton:** add data attributes to customize buttons (DS-4107) ([104b67a](https://github.com/koobiq/react-components/commit/104b67a4337c05ab7466514d2435e33c32ca69fd))

## [0.3.0](https://github.com/koobiq/react-components/compare/0.2.2...0.3.0) (2025-08-14)

### 🚀 Features

- **core:** add `useHideOverflowItems` hook (DS-4047) ([c740d6c](https://github.com/koobiq/react-components/commit/c740d6cb06eacdc25d654274252f2e067d4a43ca))

### 🐞 Bug Fixes

- **core:** fix overriding tabIndex for `Button` ([47478e5](https://github.com/koobiq/react-components/commit/47478e5c5173fee56ca59537f23b02ed781fcc2c))
- **ListItemText:** change root element from div to span ([da8abad](https://github.com/koobiq/react-components/commit/da8abade8f0235491c7c3cb0064d1c6e208ab606))
- **Select:** block chevron interactivity while keeping custom addons interactive (DS-4086) ([2a538b7](https://github.com/koobiq/react-components/commit/2a538b74b53ca5987dfb9c5c80e8b28b13c66fa4))
- **Select:** prevent layout shift when placeholder switches to value ([fc427d6](https://github.com/koobiq/react-components/commit/fc427d6261b3e2eac96c235de20bf6bc6c609d50))
- **Select:** switch root from button to div[role="button"] ([7995065](https://github.com/koobiq/react-components/commit/7995065bf2c814449e4599e2943e8a16052285de))
- **Tag:** change remove button aria-label from "Close" to "Remove" ([3ccadd5](https://github.com/koobiq/react-components/commit/3ccadd5c6d2f85a813cd4053b8f03956499f601a))

## [0.2.2](https://github.com/koobiq/react-components/compare/0.2.1...0.2.2) (2025-08-07)

### 🐞 Bug Fixes

- **Input, Textarea, Select, DatePicker, TimePicker:** set correct background in invalid state ([7364627](https://github.com/koobiq/react-components/commit/73646275c077faf6829c2ebc4977c892a6dc6539))
- **TagGroup:** remove internal prefix from tag class names ([8f8c392](https://github.com/koobiq/react-components/commit/8f8c3922fafef9abc0c1f9f7c7bf75043905d1e8))
- **TimePicker:** remove `pointer-events: none` restriction on start addons ([7c6fcc7](https://github.com/koobiq/react-components/commit/7c6fcc7c6dd2d6cd1ed128692ee6fd83b8832362))

## [0.2.1](https://github.com/koobiq/react-components/compare/0.2.0...0.2.1) (2025-08-06)

### 🐞 Bug Fixes

- **components:** prevent double visual focus in fields ([e9629ae](https://github.com/koobiq/react-components/commit/e9629aecdd88642a67fd46528ca07cb0b1de70e6))

## [0.2.0](https://github.com/koobiq/react-components/compare/0.1.2...0.2.0) (2025-08-05)

### 🚀 Features

- **core:** add `isDefined` type guard util ([5f9ce9e](https://github.com/koobiq/react-components/commit/5f9ce9e25d0f0537652a84ff86857dd5bc67f5d4))

### 🐞 Bug Fixes

- **Select:** improve control markup for multiline state (DS-4063) ([1d350e2](https://github.com/koobiq/react-components/commit/1d350e27be7b39deb4dbe61aad7723d9864bc279))
- **Tag:** fix outline offset for focused state ([475edd8](https://github.com/koobiq/react-components/commit/475edd83204ac54a721f942909987972119f449c))

## [0.1.2](https://github.com/koobiq/react-components/compare/0.1.1...0.1.2) (2025-08-04)

### 🚀 Features

- **storybook:** add "status:deprecated" tag ([c7c351c](https://github.com/koobiq/react-components/commit/c7c351c6bc977edd27433d4fbe72cb1e405e9b07))

### 🐞 Bug Fixes

- **components/fields:** remove extra border/spacing offset (DS-4061) ([cc7cb2d](https://github.com/koobiq/react-components/commit/cc7cb2d3dab5ca0ff0bb5cd3a022ee8b43e39237))
- **TagGroup:** correct spacing between tags ([2a76a33](https://github.com/koobiq/react-components/commit/2a76a33e0bb2a76550c2dc5a30da62db3b016aad))

## [0.1.1](https://github.com/koobiq/react-components/compare/0.1.0...0.1.1) (2025-07-29)

### 🐞 Bug Fixes

- **components:** fix bouncing scrolling in pop-up windows (DS-4048) ([8888c8e](https://github.com/koobiq/react-components/commit/8888c8e502c9bc8d0e1ed9f0adb22cd4f8260c8a))

## [0.1.0](https://github.com/koobiq/react-components/compare/0.0.1...0.1.0) (2025-07-25)

### 🚀 Features

- **components:** add TimePicker component (DS-3911) ([3401b68](https://github.com/koobiq/react-components/commit/3401b687c46f507b93038d551a6f4ab3baa8189a))
- **components:** extend library component types based on React Aria (DS-4033) ([89b81aa](https://github.com/koobiq/react-components/commit/89b81aa3d5ae78edec6fd20f7b2abf8ede51d1d5))
- **DateInput:** add time mask (DS-4015) ([2e16977](https://github.com/koobiq/react-components/commit/2e16977cbcc5b3f2227c9d4287ced64c6878bb49))

### 🐞 Bug Fixes

- **Checkbox:** apply correct background for `invalid` state (DS-4016) ([d1ac84e](https://github.com/koobiq/react-components/commit/d1ac84e9000eb0a0af1c33224b4c720b11657530))

## [0.0.1](https://github.com/koobiq/react-components/compare/0.0.1-beta.38...0.0.1) (2025-07-22)

### 🚀 Features

- **components:** export `ListData`, `ListOptions`, `Locale` types ([9b24de4](https://github.com/koobiq/react-components/commit/9b24de462de21b62ced227b75b61cf9c3984d301))
- **core, primitives:** clean up structure and simplify deps (DS-4012) ([03bc43f](https://github.com/koobiq/react-components/commit/03bc43f3b6c8afe11550a4e6f83baa24cd686d8d))
- **RadioGroup, Radio:** add `isInvalid`, `isDisabled`, `isRequired` and `isReadOnly` (DS-4010) ([155f095](https://github.com/koobiq/react-components/commit/155f0957460d765f27900ad1b94ad068060ec126))

### 🐞 Bug Fixes

- **Button/IconButton:** correct prop types for Button and IconButton ([5e457b7](https://github.com/koobiq/react-components/commit/5e457b751dbe8f6bbec3feb37eaf090de6ce85b7))
- **Radio:** add `data-size` and `data-label-placement` attributes ([86b9ddf](https://github.com/koobiq/react-components/commit/86b9ddf9ea1e7e4b38c37f0c8dbf813a28eb2d1b))
- **Radio:** add `data-testid` prop type declaration ([981858b](https://github.com/koobiq/react-components/commit/981858b2742a50c0c6d1a7a50957ffdbf3d7ef3f))
- **Radio:** add `style` prop type declaration ([34abcc1](https://github.com/koobiq/react-components/commit/34abcc1cfdcf6bfdca4a6de01713b54d88be63e2))

## [0.0.1-beta.38](https://github.com/koobiq/react-components/compare/0.0.1-beta.37...0.0.1-beta.38) (2025-07-18)

### 🚀 Features

- **Calendar:** highlight invalid date (DS-3998) ([34810a1](https://github.com/koobiq/react-components/commit/34810a1326a0e9dd448a0fdd699d42438c369448))
- **components:** add DatePicker component (DS-3855) ([d3c4e13](https://github.com/koobiq/react-components/commit/d3c4e13e54bf84fbb58a1f159d74059c8fce3dea))
- **components:** bump `@koobiq/design-tokens` from 3.11.2 to 3.14.0 (DS-4001) ([660479f](https://github.com/koobiq/react-components/commit/660479f26b029e7f0b7a8da24475d75d23ddf0b6))
- **Toggle:** improve styling of the component (DS-4002) ([9140ddd](https://github.com/koobiq/react-components/commit/9140dddc51dee5a244663569f9b91092ffc7c213))

### 🐞 Bug Fixes

- **Calendar:** support style prop (DS-3999) ([bd5bf73](https://github.com/koobiq/react-components/commit/bd5bf733e22f2f71328601c34871ae5d0bcc6dbd))

## [0.0.1-beta.37](https://github.com/koobiq/react-components/compare/0.0.1-beta.36...0.0.1-beta.37) (2025-07-16)

### 🚀 Features

- **components/DateInput:** allow `caption` to accept ReactNode (DS-3993) ([64256f1](https://github.com/koobiq/react-components/commit/64256f1239257418fe3dfb6b23b17a2f88baf964))
- **InputNumber:** improve increment and decrement buttons behavior (DS-3996) ([5df62cb](https://github.com/koobiq/react-components/commit/5df62cb1d92030ac9185ee62561179c6d3fa56e2))

### 🐞 Bug Fixes

- **components/Radio:** exclude `caption` prop from `RadioProps` type (DS-3992) ([b0fcef9](https://github.com/koobiq/react-components/commit/b0fcef9e19453275013cc66c8ccb742c1271b800))
- **Input/DateInput/InputNumber/Select:** apply disabled state for addons (DS-3994) ([4c3876a](https://github.com/koobiq/react-components/commit/4c3876a9057d57642345d068861ccf4f4d37999d))

## [0.0.1-beta.36](https://github.com/koobiq/react-components/compare/0.0.1-beta.35...0.0.1-beta.36) (2025-07-16)

### 🐞 Bug Fixes

- **components:** correct `fullWidth` behavior for Input, Select, InputNumber, Textarea and DateInput (DS-3990) ([3ecb90e](https://github.com/koobiq/react-components/commit/3ecb90e2eb7cf92d1d8bb3adc272e5bf94fbc028))

## [0.0.1-beta.35](https://github.com/koobiq/react-components/compare/0.0.1-beta.34...0.0.1-beta.35) (2025-07-15)

### 🚀 Features

- **components/Menu:** add `isOpen`, deprecate `open` (DS-3979) ([031d750](https://github.com/koobiq/react-components/commit/031d750a11cdfe53d166b0e5a37dee0dad0f373f))
- **components/Modal:** add `isOpen`, deprecate `open` (DS-3977) ([2141746](https://github.com/koobiq/react-components/commit/2141746e34141e1245eadf78d6071a926ee7d4a3))
- **components/Popover:** add `isOpen`, deprecate `open` ([70c46ce](https://github.com/koobiq/react-components/commit/70c46cead17e4679564155e8e082fa06765f2391))
- **components/SidePanel:** add `isOpen`, deprecate `open` (DS-3978) ([e6b124d](https://github.com/koobiq/react-components/commit/e6b124dc4ef35f47852352b7e5cda70136baf888))
- **components/SidePanel:** add `placement`, deprecate `position` (DS-3981) ([f0381ff](https://github.com/koobiq/react-components/commit/f0381ff05e2c729687614303b28010887371302d))

### 🐞 Bug Fixes

- **components/Popover:** add `style` prop (DS-3986) ([398101c](https://github.com/koobiq/react-components/commit/398101c807b42f37eff98d26c8a8a31ff07272f5))
- **components:** restore focus trap in modal windows (DS-3987) ([e4e1c3e](https://github.com/koobiq/react-components/commit/e4e1c3ea8d074ab195c6e88780cc38d4436d56e4))

## [0.0.1-beta.34](https://github.com/koobiq/react-components/compare/0.0.1-beta.33...0.0.1-beta.34) (2025-07-11)

### 🐞 Bug Fixes

- **components/DateInput:** add 'use client' directive for client-side rendering ([d852bba](https://github.com/koobiq/react-components/commit/d852bbac0a65889ccabc826086868000b020f138))

## [0.0.1-beta.33](https://github.com/koobiq/react-components/compare/0.0.1-beta.32...0.0.1-beta.33) (2025-07-11)

### 🚀 Features

- **components:** add DateInput ([cd2c2d4](https://github.com/koobiq/react-components/commit/cd2c2d46956b84dd7bc51b67c52baf265ebc3146))

### 🐞 Bug Fixes

- **components/InputNumber:** fix types ([be4a628](https://github.com/koobiq/react-components/commit/be4a628ea4d07954f107137cd895f5a9e6b9081a))
- **components/Link:** fix types ([6a913a3](https://github.com/koobiq/react-components/commit/6a913a38c308069cae24e466f37d004c78727597))
- **components/RadioGroup:** fix types ([3c4872b](https://github.com/koobiq/react-components/commit/3c4872bd7394dadd55161ecb96248c0376bcd82a))
- **components/Textarea:** fix types ([431f617](https://github.com/koobiq/react-components/commit/431f617a20092da75465affce829ee3243f13e6e))

## [0.0.1-beta.32](https://github.com/koobiq/react-components/compare/0.0.1-beta.31...0.0.1-beta.32) (2025-07-08)

### 🚀 Features

- **components:** allow `errorMessage` and `caption` to accept ReactNode in Input, Textarea, Select, InputNumber ([394c662](https://github.com/koobiq/react-components/commit/394c66210ca297eec341eacd5ada66b9f0f1f01f))

### 🐞 Bug Fixes

- **components:** fix margins for caption and errorMessage blocks in Input, Textarea, Select, InputNumber ([4b971f7](https://github.com/koobiq/react-components/commit/4b971f781251b086933408c92e7a56ff01f76a8e))
- **components:** keep caption visible when `isValid` is true in Input, Textarea, Select, InputNumber ([232e17b](https://github.com/koobiq/react-components/commit/232e17b02a35e6707c30bcefc5615fe08dce4f39))

## [0.0.1-beta.31](https://github.com/koobiq/react-components/compare/0.0.1-beta.30...0.0.1-beta.31) (2025-07-07)

### 🚀 Features

- **components/Provider:** add `router` prop to support client-side routing ([1d861f4](https://github.com/koobiq/react-components/commit/1d861f460c62bf7e1bba4530b871a5253ab43c2b))
- **Input/InputNumber/Select/Textarea:** support logical props for React Aria integration ([01c1617](https://github.com/koobiq/react-components/commit/01c161792dc30c2f8347aad076d9259e339572ef))

## [0.0.1-beta.30](https://github.com/koobiq/react-components/compare/0.0.1-beta.29...0.0.1-beta.30) (2025-07-02)

### 🚀 Features

- implement unified deprecation handling for legacy props ([065b421](https://github.com/koobiq/react-components/commit/065b4212a7971d15ce2e967e3ffdf8da28b256c4))

## [0.0.1-beta.29](https://github.com/koobiq/react-components/compare/0.0.1-beta.28...0.0.1-beta.29) (2025-07-01)

### 🚀 Features

- **components/Badge:** replace label prop with children ([66e029b](https://github.com/koobiq/react-components/commit/66e029b3f611eeffe32de551f148d8020416750f))
- **components/Tooltip:** add isDisabled and isOpen props ([9e02ece](https://github.com/koobiq/react-components/commit/9e02ecec43a49c7382b45c00805467153ac7904c))

### 🐞 Bug Fixes

- **components/Tooltip:** allow SVG element as a valid trigger without type error ([4acdc3e](https://github.com/koobiq/react-components/commit/4acdc3e5576f64fca3292069fc6ebd571414c780))
- **components/Tooltip:** fix "WARN: A component changed from uncontrolled to controlled." ([c0402c1](https://github.com/koobiq/react-components/commit/c0402c107d2c18b915282b2b0d1697e54767c9b3))
- **components/Tooltip:** fix control element not triggering open ([def2ef8](https://github.com/koobiq/react-components/commit/def2ef8c6f118822f6cdb6996d8ee709ffa73ebb))

## [0.0.1-beta.28](https://github.com/koobiq/react-components/compare/0.0.1-beta.27...0.0.1-beta.28) (2025-06-30)

### ⚠ BREAKING CHANGES

- **components/Table:** remove `fullWidth` prop
- **icons:** remove IconSquareClipboard16

### 🚀 Features

- **components:** add experimental RouterProvider ([8f47ebc](https://github.com/koobiq/react-components/commit/8f47ebc4715d18afa9ee4932b356b0384c62211a))
- **icons:** add social icons and other new icons ([ab62397](https://github.com/koobiq/react-components/commit/ab6239779bcd2667ea2845faae3615ce32635388))

### 🐞 Bug Fixes

- **components/Table:** remove `fullWidth` prop ([bac6615](https://github.com/koobiq/react-components/commit/bac66151215075517654614756ff018ae4de76bd))

## [0.0.1-beta.27](https://github.com/koobiq/react-components/compare/0.0.1-beta.26...0.0.1-beta.27) (2025-06-25)

### 🚀 Features

- **components:** mark SkeletonBlock and SkeletonTypography as stable ([1f6e1b1](https://github.com/koobiq/react-components/commit/1f6e1b1fc3ef4cb53f320bd5782c667c2d2c24a3))

## [0.0.1-beta.26](https://github.com/koobiq/react-components/compare/0.0.1-beta.25...0.0.1-beta.26) (2025-06-25)

### 🚀 Features

- **components/Menu:** add `slotProps.list` for list customization ([675f6bd](https://github.com/koobiq/react-components/commit/675f6bd04f086456d21ae14223cfbebbd70d03c1))
- **components/Popover:** add `maxBlockSize` prop ([02dfa7c](https://github.com/koobiq/react-components/commit/02dfa7c6efd70a374006b57b09a87a250378e80f))
- **components/Toggle:** add isDisabled, isInvalid, isSelected, isReadOnly, defaultSelected ([1d74853](https://github.com/koobiq/react-components/commit/1d74853039c0723012df6f5e9b63953aedfee177))
- **components:** add `capitalizeFirstLetter` utility ([fa7c3a2](https://github.com/koobiq/react-components/commit/fa7c3a26d0b521e4ff112be8412f0b00fecd0249))
- **components:** add Calendar component ([f75b56f](https://github.com/koobiq/react-components/commit/f75b56f5bdbe8aee5a4c4a83349f9f954a448d53))
- **components:** export `useLocale` from the library ([66b16f8](https://github.com/koobiq/react-components/commit/66b16f80fb3ea5ad9f52e40e92a9435511b5a5ad))

### 🐞 Bug Fixes

- **components/Menu:** correct slotProps typing ([8634822](https://github.com/koobiq/react-components/commit/8634822f1f3e17d29ef605660977a74092cd228f))
- **components/Popover:** correct slotProps typing ([30b0cf4](https://github.com/koobiq/react-components/commit/30b0cf40e3db0a44a494fa26f4d4a63b51a5aa61))
- **components/Table:** refine component layout and fix CSS bugs ([922f1f8](https://github.com/koobiq/react-components/commit/922f1f81a623a2f7db650cc50525c0c6bfa14b7a))
- **components/Toggle:** add type declaration for `style` prop ([446402d](https://github.com/koobiq/react-components/commit/446402d7c093cb1c990b8496e9b51c83608188d2))

## [0.0.1-beta.25](https://github.com/koobiq/react-components/compare/0.0.1-beta.24...0.0.1-beta.25) (2025-06-16)

### 🚀 Features

- add Table component ([42cb2b7](https://github.com/koobiq/react-components/commit/42cb2b7a06f0ee871368efd3dc8535539ec19ce4))

### 🐞 Bug Fixes

- **components/TagGroup:** ensure client-side rendering with 'use client' directive ([ff63d14](https://github.com/koobiq/react-components/commit/ff63d14ab6dd5a2cdbe832166849bed647b0538b))

## [0.0.1-beta.24](https://github.com/koobiq/react-components/compare/0.0.1-beta.23...0.0.1-beta.24) (2025-06-10)

### 🚀 Features

- **components/Checkbox:** add isDisabled, isInvalid, isSelected, isReadOnly, isRequired, isIndeterminate, defaultSelected ([61a21bf](https://github.com/koobiq/react-components/commit/61a21bf6b093530be22ba25ffb0af51c19c7b676))
- **components/Checkbox:** add type declaration for `style` prop ([1f37414](https://github.com/koobiq/react-components/commit/1f37414b3560f639622badd08152b3a4cbcaaabb))
- **components/Container:** add `isFixed`, deprecate `fixed` ([e58b0e3](https://github.com/koobiq/react-components/commit/e58b0e3f7cadae534d22091e1ab64175484225a9))
- **components/Divider:** add helper data-attributes for customization ([c1c7536](https://github.com/koobiq/react-components/commit/c1c7536013140fc3c54ab00451e35f02f3867ce4))
- **components/SkeletonBlock:** mark the component as experimental ([184bb83](https://github.com/koobiq/react-components/commit/184bb836cd6004930ee04f521df9aacbfc35c16c))
- **components/SkeletonBlock:** update styles to match design system specs ([04669dd](https://github.com/koobiq/react-components/commit/04669ddf45a67ee42ded86ee39a325121b244f4e))
- **components/SkeletonTypography:** mark the component as experimental ([b534196](https://github.com/koobiq/react-components/commit/b534196fdc54a4975ab7137c2df8b014af10dec9))
- **components:** bump @koobiq/design-tokens from 3.12.1 to 3.13.2 ([4962229](https://github.com/koobiq/react-components/commit/4962229c90d3852c367859bdada21bc5caf5ba4b))

### 🐞 Bug Fixes

- **components/Checkbox:** correct `defaultSelected` behavior ([07f6726](https://github.com/koobiq/react-components/commit/07f67262e7f4ff194ec95d08264a947d6a251254))

## [0.0.1-beta.23](https://github.com/koobiq/react-components/compare/0.0.1-beta.22...0.0.1-beta.23) (2025-06-09)

### 🚀 Features

- **components/List:** enhance styling of disabled list item ([7307ec5](https://github.com/koobiq/react-components/commit/7307ec5b8f928c9160caf454e34d068fad787f70))

### 🐞 Bug Fixes

- **components/ButtonToggleGroup:** correct ts signature for `onSelectionChange` ([ba79281](https://github.com/koobiq/react-components/commit/ba79281dc88b345c30292d036ad19a1b652dbc68))
- **components/Tooltip:** correct custom class definition ([40c3d19](https://github.com/koobiq/react-components/commit/40c3d199e9b1a6562c01b81a3f07acf0a2e31b03))

## [0.0.1-beta.22](https://github.com/koobiq/react-components/compare/0.0.1-beta.21...0.0.1-beta.22) (2025-05-30)

### ⚠ BREAKING CHANGES

- **components/ButtonToggleGroup:** The "isBlock" prop is removed. Use "fullWidth" prop to replace it.

### 🚀 Features

- **components/Alert:** add `isCompact` & `isColored`, deprecate `compact` & `colored` ([05a9ad5](https://github.com/koobiq/react-components/commit/05a9ad57c35e844ef34132176f1ecdfdf4cb38e6))
- **components/Backdrop:** add `isOpen` prop, deprecate `open` ([1ba8b26](https://github.com/koobiq/react-components/commit/1ba8b2612ed5e6f910fbb289f37ccfa81636bb92))
- **components/Button/IconButton:** rethink logical prop naming ([8bb43c3](https://github.com/koobiq/react-components/commit/8bb43c3213abd5af10a5e3a544975c7e0b8f9aeb))
- **components/ButtonToggleGroup:** add `fullWidth`; remove `isBlock` ([#58](https://github.com/koobiq/react-components/issues/58)) ([2c802a8](https://github.com/koobiq/react-components/commit/2c802a88f162a5ee42d455d005d706957d841fbc))
- **components/Link:** add `allowVisited`; deprecate visitable ([0d9af52](https://github.com/koobiq/react-components/commit/0d9af52012320969a7bca4f583fdd6a0144ac7b7))
- **components/Link:** add `isDisabled`, `isVisitable`, `isPseudo`; deprecate disabled, visitable, pseudo ([96a3d45](https://github.com/koobiq/react-components/commit/96a3d45f9292afc399540606f0bc59ad615ae0a0))

## [0.0.1-beta.21](https://github.com/koobiq/react-components/compare/0.0.1-beta.20...0.0.1-beta.21) (2025-05-28)

### 🚀 Features

- **components:** add the `TagGroup` ([66c5d3e](https://github.com/koobiq/react-components/commit/66c5d3e18ae5144d352fd357d91ae5481bad4df6))
- **icons:** add `IconSquareClipboard16` and refine other icons ([1dd405f](https://github.com/koobiq/react-components/commit/1dd405f11267b42dd80041bf4ac4cf2d8452824e))

## [0.0.1-beta.20](https://github.com/koobiq/react-components/compare/0.0.1-beta.19...0.0.1-beta.20) (2025-05-26)

### 🐞 Bug Fixes

- **components/Menu.Header:** support merging of custom className ([#51](https://github.com/koobiq/react-components/issues/51)) ([13f1d2a](https://github.com/koobiq/react-components/commit/13f1d2a619510297ccb56e16c88fd0a9ea85a9e4))

## [0.0.1-beta.19](https://github.com/koobiq/react-components/compare/0.0.1-beta.18...0.0.1-beta.19) (2025-05-23)

### 🚀 Features

- **components:** add the `ButtonToggleGroup` and `ButtonToggle` components ([ceb10ad](https://github.com/koobiq/react-components/commit/ceb10ad045ca032c9d273a16e4be616f911385c6))

## [0.0.1-beta.18](https://github.com/koobiq/react-components/compare/0.0.1-beta.17...0.0.1-beta.18) (2025-05-21)

### 🐞 Bug Fixes

- **components/Checkbox,Radio,Toggle:** prevent controls from shrinking in flex containers ([5c30ac4](https://github.com/koobiq/react-components/commit/5c30ac4e3cb1250e08c80c52308a73a8620a325e))
- **components/Modal:** handle horizontal scrolling in dialog window ([64cf66a](https://github.com/koobiq/react-components/commit/64cf66a70422c1249637256d3285262d307888b0))

## [0.0.1-beta.17](https://github.com/koobiq/react-components/compare/0.0.1-beta.16...0.0.1-beta.17) (2025-05-15)

### 🚀 Features

- **components:** add experimental `Menu` component ([c11bd5f](https://github.com/koobiq/react-components/commit/c11bd5fcbbdf0561f278eab6cf12add7d50d14d3))

## [0.0.1-beta.16](https://github.com/koobiq/react-components/compare/0.0.1-beta.15...0.0.1-beta.16) (2025-05-13)

### 🐞 Bug Fixes

- **components/Modal:** fix a scroll ([1abd7e7](https://github.com/koobiq/react-components/commit/1abd7e79993d0ea0d8a9347ea48942088cef6ea6))

## [0.0.1-beta.15](https://github.com/koobiq/react-components/compare/0.0.1-beta.14...0.0.1-beta.15) (2025-05-12)

### 🚀 Features

- **icons:** improve the `IconShieldUser16` ([353a323](https://github.com/koobiq/react-components/commit/353a32381052779fa9c4671520378929d36c2c98))

### 🐞 Bug Fixes

- **components/Сheckbox/Radio/Toggle:** use <span> for VisuallyHidden ([47f808c](https://github.com/koobiq/react-components/commit/47f808c3d1d66ef77c4a4563bc18e7b25a6ed370))
- correct scroll layout for Checkbox, Radio and Toggle ([7237d25](https://github.com/koobiq/react-components/commit/7237d25d3b3d1a8782d927b82e91887c2f2c2603))

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
