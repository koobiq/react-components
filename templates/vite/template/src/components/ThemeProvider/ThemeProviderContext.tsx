import { createContext, useContext } from 'react';

export type ThemeProviderContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

export const ThemeProviderContext = createContext<ThemeProviderContextType>(
  {} as ThemeProviderContextType
);

export function useTheme() {
  return useContext(ThemeProviderContext);
}
