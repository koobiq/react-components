'use client';

import { InputContext, useSlottedContext } from 'react-aria-components';

export { InputContext };

export const useInputContext = () => useSlottedContext(InputContext) ?? {};
