import '@koobiq/design-tokens/web/new/css-tokens.css';
import '@koobiq/design-tokens/web/new/css-tokens-light.css';
import '@koobiq/design-tokens/web/new/css-tokens-dark.css';
import '@koobiq/react-components/style.css';

import { createRoot } from 'react-dom/client';
import { Provider, ToastProvider } from '@koobiq/react-components';

import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <Provider>
    <ToastProvider />
    <App />
  </Provider>
);
