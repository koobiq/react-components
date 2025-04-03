import { isBrowser } from '@koobiq/react-core';

type ConfigureRootThemeOptions = {
  theme?: string;
  root?: Element | null;
};

let prevClassName = '';

export const configureRootTheme = ({
  theme = '',
  root = isBrowser() ? document.body : null,
}: ConfigureRootThemeOptions) => {
  if (!isBrowser()) {
    return;
  }

  if (!root) {
    throw new Error('');
  }

  root.className.replace(prevClassName, '');

  prevClassName = theme;

  root.className = prevClassName;
};
