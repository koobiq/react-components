import type { SVGProps } from 'react';

import {
  IconCircleInfo16,
  IconCircleCheck16,
  IconTriangleExclamation16,
} from '@koobiq/react-icons';

const iconProps: SVGProps<SVGSVGElement> = {
  focusable: false,
  'aria-hidden': true,
};

export const matchStatusToIcon = {
  info: <IconCircleInfo16 {...iconProps} />,
  success: <IconCircleCheck16 {...iconProps} />,
  error: <IconTriangleExclamation16 {...iconProps} />,
  warning: <IconTriangleExclamation16 {...iconProps} />,
};
