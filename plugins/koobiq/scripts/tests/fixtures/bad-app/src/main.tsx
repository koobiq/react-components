import { createRoot } from 'react-dom/client';

import '@koobiq/react-components/style.css'; // expect: setup/style-css-order
import '@koobiq/design-tokens/web/css-tokens.css'; // expect: setup/legacy-token-set
import '@koobiq/design-tokens/web/css-tokens-light.css';

import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);
