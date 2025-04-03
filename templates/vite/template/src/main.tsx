import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { ThemeProvider } from './components';

import '@koobiq/design-tokens/web/css-tokens.css';
import '@koobiq/design-tokens/web/css-tokens-light.css';
import '@koobiq/design-tokens/web/css-tokens-dark.css';
import '@koobiq/react-components/style.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="kbq-dark" themes={['kbq-light', 'kbq-dark']}>
      <App />
    </ThemeProvider>
  </StrictMode>
);
