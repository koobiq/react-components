import type { FC } from 'react';

import { Badge, spacing } from '@koobiq/react-components';
import { clsx } from '@koobiq/react-core';
import LinkTo from '@storybook/addon-links/react';

import type { StatusProps } from './types';
import { variantMap } from './utils';

export const Status: FC<StatusProps> = ({ variant = 'stable', ...other }) => {
  const kind = 'Component lifecycle';
  const name = 'Docs';

  const mappingProps = variantMap[variant];

  return (
    <div className={clsx(spacing({ mbe: 'l' }), 'sb-unstyled')}>
      <Badge {...mappingProps} {...other} as={LinkTo} kind={kind} name={name} />
    </div>
  );
};
