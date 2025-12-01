# @koobiq/react-icons

**A collection of React-icons for the web, part of Koobiq React.**

We use icons as React components. This approach works out of the box (no special loaders needed),
supports tree-shaking, and includes full TypeScript typings.

If you need SVG files or icon font (Koobiq Icons), use the [@koobiq/icons](https://github.com/koobiq/icons) package.

## Showcase

Use the [icon showcase](https://react.koobiq.io/?path=/docs/icons--docs) to visually present the package contents.

## Installation

Depending on your preference, run one of the following in your terminal:

```sh
# With npm
npm install @koobiq/react-icons

# With yarn
yarn add @koobiq/react-icons

# With pnpm
yarn add @koobiq/react-icons
```

## Usage

Import the required icon from the package:

```tsx
import { IconCheck16 } from '@koobiq/react-icons';

const Icon = () => <IconCheck16 color="#4CAF50" />;
```

Some icons include an accent layer and support a two-tone (duotone) style.
Override the `--icon-accent-color` [CSS-variable](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties) to change only the accent color without affecting the base color.

```css
/* Icon.module.css */
.icon {
  --icon-accent-color: red;
}
```

```tsx
// Icons.tsx
import { IconFilterDot16 } from '@koobiq/react-icons';
import styles from './Icon.module.css';

const Icon = () => <IconFilterDot16 style={styles.icon} />;
```
