import { createContext, useContext, useEffect, useState } from 'react';

import { Provider } from '@koobiq/react-components';
import { isNotNil } from '@koobiq/react-core';
import { DocsContainer as BaseContainer } from '@storybook/blocks';
import { addons } from '@storybook/preview-api';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';

import { light, dark } from '../themes';

const channel = addons.getChannel();

export const ThemeProviderContext = createContext<{
  isDark?: boolean;
} | null>(null);

export const useThemeProvider = () => useContext(ThemeProviderContext);

export const DocContainer: typeof BaseContainer = (params) => {
  const { context, children } = params;
  const [isDark, setDark] = useState();
  const themeIsMounted = isNotNil(isDark);

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setDark);

    return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark);
  }, [channel, setDark]);

  if (!themeIsMounted) {
    return null;
  }

  return (
    <BaseContainer context={context} theme={isDark ? dark : light}>
      <ThemeProviderContext.Provider value={{ isDark }}>
        <Provider>
          <div className="kbq-docs-decorator">{children}</div>
        </Provider>
      </ThemeProviderContext.Provider>
    </BaseContainer>
  );
};
