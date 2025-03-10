import { type FC } from 'react';

import {
  Alert as KoobiqAlert,
  type AlertProps,
} from '@koobiq/react-components';
import { clsx } from '@koobiq/react-core';

import s from './Alert.module.css';

export const Alert: FC<AlertProps> = ({ children, className, ...other }) => (
  <KoobiqAlert
    colored
    compact
    status="info"
    {...other}
    className={clsx(s.base, 'sb-unstyled', className)}
  >
    {children}
  </KoobiqAlert>
);
