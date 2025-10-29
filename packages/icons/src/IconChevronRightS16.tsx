import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronRightS16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M8.852 8 5.13 11.809a.203.203 0 0 0 0 .285l.83.845c.08.081.21.081.29 0l4.692-4.797a.203.203 0 0 0 0-.284L6.249 3.06a.2.2 0 0 0-.288 0l-.831.846a.203.203 0 0 0 0 .284z" />
    </svg>
  )
);
IconChevronRightS16.displayName = 'IconChevronRightS16';
