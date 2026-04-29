'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@koobiq/react-components';
import { IconSun16, IconSunMoon16 } from '@koobiq/react-icons';

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

type ThemeSwitchProps = {
  className?: string;
};

export const ThemeSwitch = ({ className }: ThemeSwitchProps) => {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot
  );
  const { resolvedTheme, setTheme } = useTheme();

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'kbq-dark';

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
