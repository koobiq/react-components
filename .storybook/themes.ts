import { create } from 'storybook/theming';

export const brand = {
  brandTitle: 'Koobiq React',
  brandUrl: 'https://github.com/koobiq/react-components',
  brandTarget: '_blank',
  fontBase:
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;", // var(--kbq-font-family-base)
  fontCode:
    "'JetBrains Mono', 'Roboto Mono', 'Consolas', 'Menlo', 'Monaco', monospace;", // var(--kbq-font-family-mono)
};

// Use hsla here instead of oklch/lab: Storybook theming does not reliably support newer CSS color functions.
export const light = create({
  ...brand,
  base: 'light',
  textColor: 'hsla(221, 100%, 5.1%, 0.85)', // var(--kbq-foreground-contrast)
  colorSecondary: 'hsla(221, 100%, 5.1%, 0.85)', // var(--kbq-foreground-contrast)
  barBg: 'hsla(0, 0%, 100%, 1)', // var(--kbq-background-bg)
  barHoverColor: 'hsla(221, 100%, 5.1%, 0.85)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  barTextColor: 'hsla(221, 100%, 5.1%, 0.85)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  barSelectedColor: 'hsla(221, 100%, 5.1%, 0.85)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  appBg: 'hsla(217, 28.5%, 96.3%, 1)', // var(--kbq-background-bg-secondary)
  appContentBg: 'hsla(0, 0%, 100%, 1)', // var(--kbq-background-bg)
  appPreviewBg: 'hsla(0, 0%, 100%, 1)', // var(--kbq-background-bg)
  appBorderColor: 'hsla(217, 100%, 15.5%, 0.11)', // var(--kbq-background-contrast-fade)
  appBorderRadius: 12,
  buttonBorder: 'hsla(223, 100%, 12.5%, 0.24)', // var(--kbq-form-field-default-border-color)
  buttonBg: 'hsla(217, 28.5%, 96.3%, 1)', // var(--kbq-background-bg-secondary)
  brandImage: '/images/logo-name-light.svg',
  appHoverBg: 'hsla(217, 100%, 15%, 0.11)', // kbq-states-background-transparent-active
});

export const dark = create({
  ...brand,
  base: 'dark',
  textColor: 'hsla(212, 100%, 96.8%, 0.9)', // var(--kbq-foreground-contrast)
  colorSecondary: 'hsla(212, 100%, 96.8%, 0.9)', // var(--kbq-foreground-contrast)
  barBg: 'hsla(225, 20.1%, 9.5%, 1)', // var(--kbq-background-bg)
  barHoverColor: 'hsla(216, 100%, 95.6%, 0.83)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  barTextColor: 'hsla(216, 100%, 95.6%, 0.83)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  barSelectedColor: 'hsla(216, 100%, 95.6%, 0.83)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  appBg: 'hsla(224, 17.7%, 14.3%, 1)', // var(--kbq-background-bg-secondary)
  appContentBg: 'hsla(225, 20.1%, 9.5%, 1)', // var(--kbq-background-bg)
  appPreviewBg: 'hsla(225, 20.1%, 9.5%, 1)', // var(--kbq-background-bg),
  appBorderColor: 'hsla(224, 100%, 85.8%, 0.17)', // var(--kbq-background-contrast-fade)
  appBorderRadius: 12,
  buttonBorder: 'hsla(219, 100%, 84.7%, 0.29)', // var(--kbq-form-field-default-border-color)
  buttonBg: 'hsla(224, 17.7%, 14.3%, 1)', // var(--kbq-background-bg-secondary)
  brandImage: '/images/logo-name-dark.svg',
  appHoverBg: 'hsla(238, 59%, 78%, 0.17)', // kbq-states-background-transparent-active
});
