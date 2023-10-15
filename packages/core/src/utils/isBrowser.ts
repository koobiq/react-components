export const isBrowser = (): boolean =>
  Boolean(
    typeof window !== 'undefined' &&
      window.document &&
      window.document.createElement
  );
