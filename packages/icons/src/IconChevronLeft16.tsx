import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronLeft16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m6.67 8 4.771 4.809a.2.2 0 0 1 0 .285l-.839.845a.206.206 0 0 1-.292 0L4.56 8.142a.2.2 0 0 1 0-.284L10.31 2.06c.08-.081.212-.081.292 0l.84.846a.2.2 0 0 1 0 .284z" />
    </svg>
  )
);
IconChevronLeft16.displayName = 'IconChevronLeft16';
