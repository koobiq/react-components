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

export const light = create({
  ...brand,
  base: 'light',
  textColor: 'hsla(229, 15%, 15%, 100%)', // var(--kbq-foreground-contrast)
  colorSecondary: 'hsla(229, 15%, 15%, 100%)', // var(--kbq-states-background-transparent-active)
  barBg: 'hsla(0, 0%, 100%, 100%)', // var(--kbq-background-bg)
  barHoverColor: 'hsla(229, 15%, 15%, 100%)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  barTextColor: 'hsla(229, 15%, 15%, 100%)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  barSelectedColor: 'hsla(229, 15%, 15%, 100%)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  appBg: 'hsla(229, 15%, 95%, 100%)', // var(--kbq-background-bg-secondary)
  appContentBg: 'hsla(0, 0%, 100%, 100%)', // var(--kbq-background-bg)
  appPreviewBg: 'hsla(0, 0%, 100%, 100%)', // var(--kbq-background-bg)
  appBorderColor: 'hsla(229, 15%, 92%, 100%)', // var(--kbq-background-contrast-fade)
  appBorderRadius: 12,
  buttonBorder: 'hsla(229, 15%, 80%, 100%)', // var(--kbq-form-field-default-border-color)
  buttonBg: 'hsla(229, 15%, 95%, 100%)', // var(--kbq-background-bg-secondary)
  brandImage: '/images/logo-name-light.svg',
});

export const dark = create({
  ...brand,
  base: 'dark',
  textColor: 'hsla(229, 15%, 80%, 100%)', // var(--kbq-foreground-contrast)
  colorSecondary: 'hsla(229, 15%, 80%, 100%)', // var(--kbq-states-background-transparent-active)
  barBg: 'hsla(229, 15%, 12%, 100%)', // var(--kbq-background-bg)
  barHoverColor: 'hsla(229, 15%, 80%, 100%)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  barTextColor: 'hsla(229, 15%, 80%, 100%)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  barSelectedColor: 'hsla(229, 15%, 80%, 100%)', // var(--kbq-button-transparent-contrast-fade-on-left-icon)
  appBg: 'hsla(229, 15%, 16%, 100%)', // var(--kbq-background-bg-secondary)
  appContentBg: 'hsla(229, 15%, 12%, 100%)', // var(--kbq-background-bg)
  appPreviewBg: 'hsla(229, 15%, 12%, 100%)', // var(--kbq-background-bg),
  appBorderColor: 'hsla(229, 15%, 25%, 100%)', // var(--kbq-background-contrast-fade)
  appBorderRadius: 12,
  buttonBorder: 'hsla(229, 15%, 30%, 100%)', // var(--kbq-form-field-default-border-color)
  buttonBg: 'hsla(229, 15%, 16%, 100%)', // var(--kbq-background-bg-secondary)
  brandImage: '/images/logo-name-dark.svg',
});
