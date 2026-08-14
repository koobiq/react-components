import { createContext, useContext } from 'react';

import { Provider } from '@koobiq/react-components';
import { DocsContainer as BaseContainer } from '@storybook/addon-docs/blocks';
import { linkTo } from '@storybook/addon-links';
import { useDarkMode } from '@vueless/storybook-dark-mode';

import { light, dark } from '../themes';

export const ThemeProviderContext = createContext<{
  isDark?: boolean;
} | null>(null);

export const useThemeProvider = () => useContext(ThemeProviderContext);

export const DocContainer: typeof BaseContainer = (params) => {
  const { context, children } = params;
  const isDark = useDarkMode();

  return (
    <BaseContainer context={context} theme={isDark ? dark : light}>
      <ThemeProviderContext.Provider value={{ isDark }}>
        <Provider
          router={{
            navigate: (href) => {
              linkTo(href)();
            },
          }}
        >
          <div className="kbq-docs-decorator">{children}</div>
        </Provider>
      </ThemeProviderContext.Provider>
    </BaseContainer>
  );
};
