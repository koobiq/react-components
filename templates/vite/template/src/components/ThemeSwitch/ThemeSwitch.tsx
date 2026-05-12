'use client';

import { useTheme } from '../ThemeProvider';
import { Button } from '@koobiq/react-components';
import { IconSun16, IconSunMoon16 } from '@koobiq/react-icons';

type ThemeSwitchProps = {
  className?: string;
};

export const ThemeSwitch = ({ className }: ThemeSwitchProps) => {
  const { theme, setTheme } = useTheme();

  const isDark = theme === 'kbq-dark';

  return (
    <Button
      variant="contrast-transparent"
      onPress={() => setTheme(isDark ? 'kbq-light' : 'kbq-dark')}
      startIcon={isDark ? <IconSun16 /> : <IconSunMoon16 />}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={className}
      onlyIcon
    />
  );
};
