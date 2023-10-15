# @koobiq/react-components

## Getting Started

Install the component library with the following command:

```bash
pnpm add @koobiq/design-tokens @koobiq/react-components
```

### Usage

```tsx
import '@koobiq/design-tokens/web/css-tokens.css';
import '@koobiq/design-tokens/web/css-tokens-light.css';
import '@koobiq/design-tokens/web/css-tokens-dark.css';
import '@koobiq/react-components/style.css';

import { Typography } from '@koobiq/react-components';

export default function App() {
  return <Typography>Hello, Koobiq React!</Typography>;
}
```

## Browser Support

[Check compatible browsers](https://browsersl.ist/#q=defaults+and+supports+es6-module%2C%0A++++chrome+%3E+88%2C%0A++++safari+%3E+14%2C%0A++++firefox+%3E+78%2C%0A++++opera+%3E+75%2C%0A++++edge+%3E+88)

## Development

Follow these steps to start the development mode:

- Clone the repository and navigate to the created directory.
- Run the command `pnpm dev` in the terminal.

Documentation will be available at [http://localhost:6006](http://localhost:6006).
All development is conducted there. For convenience, you can go directly to the page of the component you are working on.

### Prerequisites

- Node.js v20
- pnpm v9
