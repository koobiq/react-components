import type { FC } from 'react';

import { Badge } from '@koobiq/react-components';
import { Link } from '@koobiq/react-primitives';

import type { StatusProps } from './types';
import { variantMap } from './utils';

export const Status: FC<StatusProps> = ({ variant = 'stable', ...other }) => {
  const mappingProps = variantMap[variant];

  return (
    <div className={'sb-unstyled'}>
      <Badge
        {...mappingProps}
        {...other}
        as={Link}
        href="/Component lifecycle"
      />
    </div>
  );
};
