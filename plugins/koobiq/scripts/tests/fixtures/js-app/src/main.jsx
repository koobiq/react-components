import '@koobiq/design-tokens/web/new/css-tokens.css';
import '@koobiq/design-tokens/web/new/css-tokens-light.css';
import '@koobiq/design-tokens/web/new/css-tokens-dark.css';
import '@koobiq/react-components/style.css';
import { createRoot } from 'react-dom/client';
import { Provider, Button, IconButton } from '@koobiq/react-components';

const App = () => (
  <Provider>
    <Button disabled onPress={() => {}}>Go</Button> {/* expect: deprecated/prop */}
    <IconButton /> {/* expect: a11y/icon-button-label */}
    <div className="kbq-button-5c3f2a" /> {/* expect: style/hashed-class */}
  </Provider>
);

createRoot(document.getElementById('root')).render(<App />);
