import type { SVGProps } from 'react';

import {
  IconCheck16,
  IconCheckCircle16,
  IconExclamationTriangle16,
  IconInfoCircle16,
} from '@koobiq/react-icons';

const iconProps: SVGProps<SVGSVGElement> = {
  focusable: false,
  'aria-hidden': true,
};

export const matchStatusToIcon = {
  normal: {
    info: <IconInfoCircle16 {...iconProps} />,
    success: <IconCheck16 {...iconProps} />,
    error: <IconExclamationTriangle16 {...iconProps} />,
    warning: <IconExclamationTriangle16 {...iconProps} />,
  },
  compact: {
    info: <IconInfoCircle16 {...iconProps} />,
    success: <IconCheckCircle16 {...iconProps} />,
    error: <IconExclamationTriangle16 {...iconProps} />,
    warning: <IconExclamationTriangle16 {...iconProps} />,
  },
};
