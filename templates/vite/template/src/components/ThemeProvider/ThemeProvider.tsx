import type { ReactNode } from 'react';
import { useLayoutEffect, useState } from 'react';

import { ThemeProviderContext } from './ThemeProviderContext.tsx';
import { configureRootTheme } from './utils';

export type ThemeProviderProps = {
  children?: ReactNode;
  themes?: string[];
  defaultTheme?: string;
};

export const ThemeProvider = ({
  children,
  themes,
  defaultTheme,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string>(defaultTheme || themes?.[0] || '');

  useLayoutEffect(() => {
    configureRootTheme({ theme });
  }, [theme]);

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
};
