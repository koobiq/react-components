import { useEffect, useLayoutEffect } from 'react';

import { isBrowser } from '../../utils/index.js';

export const useIsomorphicEffect = isBrowser() ? useLayoutEffect : useEffect;
