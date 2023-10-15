import type { FC, ReactNode } from 'react';

import { Typography } from '@koobiq/react-components';

export type IntroductionProps = {
  children?: ReactNode;
};
export const Introduction: FC<IntroductionProps> = ({ children }) => (
  <Typography variant="subheading">{children}</Typography>
);
