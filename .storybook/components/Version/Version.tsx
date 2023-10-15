import { Badge } from '@koobiq/react-components';

import { version } from '../../../package.json';

export const Version = () => <Badge className="sb-unstyled" label={version} />;
