'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Button, spacing } from '@koobiq/react-components';
import { IconSun16, IconSunMoon16 } from '@koobiq/react-icons';

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === 'kbq-dark';

  return (
    <Button
      variant="contrast-transparent"
      onClick={() => setTheme(isDark ? 'kbq-light' : 'kbq-dark')}
      startIcon={isDark ? <IconSun16 /> : <IconSunMoon16 />}
      className={spacing({ mis: 'auto' })}
      onlyIcon
    />
  );
};
