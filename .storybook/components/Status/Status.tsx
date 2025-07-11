import type { FC } from 'react';

import { Badge, spacing } from '@koobiq/react-components';
import { clsx } from '@koobiq/react-core';
import { Link } from '@koobiq/react-primitives';

import type { StatusProps } from './types';
import { variantMap } from './utils';

export const Status: FC<StatusProps> = ({ variant = 'stable', ...other }) => {
  const mappingProps = variantMap[variant];

  return (
    <div className={clsx(spacing({ mbe: 'l' }), 'sb-unstyled')}>
      <Badge
        {...mappingProps}
        {...other}
        as={Link}
        href="/Component lifecycle"
      />
    </div>
  );
};
