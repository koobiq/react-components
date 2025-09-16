import type { ReactNode } from 'react';

export const isPrimitiveNode = (n: ReactNode): n is string | number =>
  typeof n === 'string' || typeof n === 'number';
