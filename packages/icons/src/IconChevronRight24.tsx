import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronRight24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M13.995 12 6.838 4.787a.3.3 0 0 1 0-.427L8.097 3.09a.31.31 0 0 1 .438 0l8.627 8.696a.3.3 0 0 1 0 .426L8.535 20.91a.31.31 0 0 1-.438 0L6.838 19.64a.3.3 0 0 1 0-.427z"
      />
    </svg>
  )
);
IconChevronRight24.displayName = 'IconChevronRight24';
