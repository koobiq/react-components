import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronLeftS16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m7.148 8 3.722 3.809a.203.203 0 0 1 0 .285l-.83.845c-.08.081-.21.081-.29 0L5.059 8.142a.203.203 0 0 1 0-.284L9.751 3.06c.079-.081.21-.081.289 0l.83.846a.203.203 0 0 1 0 .284z" />
    </svg>
  )
);
IconChevronLeftS16.displayName = 'IconChevronLeftS16';
