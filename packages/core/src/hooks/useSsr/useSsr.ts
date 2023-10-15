import { useEffect, useState } from 'react';

import { isBrowser } from '../../utils/index.js';

type SsrState = {
  isBrowser: boolean;
  isServer: boolean;
};

export type UseSsrReturn = SsrState;

export const useSsr = (): UseSsrReturn => {
  const [browser, setBrowser] = useState<boolean>(false);

  useEffect(() => {
    setBrowser(isBrowser());
  }, []);

  return {
    isBrowser: browser,
    isServer: !browser,
  };
};
