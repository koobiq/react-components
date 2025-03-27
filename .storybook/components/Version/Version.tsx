import { Badge } from '@koobiq/react-components';
import LinkTo from '@storybook/addon-links/react';

import { version } from '../../../package.json';

export const Version = () => {
  const kind = 'Changelog';
  const name = 'Docs';

  return (
    <Badge
      className="sb-unstyled"
      as={LinkTo}
      kind={kind}
      label={version}
      name={name}
    />
  );
};
