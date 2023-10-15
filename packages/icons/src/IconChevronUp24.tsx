import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronUp24 = forwardRef(
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
        d="m12 10.005-7.213 7.157a.3.3 0 0 1-.427 0L3.09 15.903a.31.31 0 0 1 0-.438l8.696-8.627a.3.3 0 0 1 .426 0l8.696 8.627a.31.31 0 0 1 0 .438l-1.269 1.259a.3.3 0 0 1-.427 0z"
      />
    </svg>
  )
);
IconChevronUp24.displayName = 'IconChevronUp24';
