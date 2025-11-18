import type { SVGProps } from 'react';

import {
  IconCheck16,
  IconCircleCheck16,
  IconTriangleExclamation16,
  IconCircleInfo16,
} from '@koobiq/react-icons';

const iconProps: SVGProps<SVGSVGElement> = {
  focusable: false,
  'aria-hidden': true,
};

export const matchStatusToIcon = {
  normal: {
    info: <IconCircleInfo16 {...iconProps} />,
    success: <IconCheck16 {...iconProps} />,
    error: <IconTriangleExclamation16 {...iconProps} />,
    warning: <IconTriangleExclamation16 {...iconProps} />,
  },
  compact: {
    info: <IconCircleInfo16 {...iconProps} />,
    success: <IconCircleCheck16 {...iconProps} />,
    error: <IconTriangleExclamation16 {...iconProps} />,
    warning: <IconTriangleExclamation16 {...iconProps} />,
  },
};
