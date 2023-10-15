import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronUpS24 = forwardRef(
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
        d="m12 11.13-4.963 4.907a.3.3 0 0 1-.427 0L5.34 14.778a.31.31 0 0 1 0-.438l6.446-6.377a.3.3 0 0 1 .426 0l6.446 6.377a.31.31 0 0 1 0 .438l-1.269 1.259a.3.3 0 0 1-.427 0z"
      />
    </svg>
  )
);
IconChevronUpS24.displayName = 'IconChevronUpS24';
