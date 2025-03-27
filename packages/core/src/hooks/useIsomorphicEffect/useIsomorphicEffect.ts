'use client';

import { useEffect, useLayoutEffect } from 'react';

import { isBrowser } from '../../utils';

export const useIsomorphicEffect = isBrowser() ? useLayoutEffect : useEffect;
