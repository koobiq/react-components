import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMagnifyingGlass24 = forwardRef(
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
        d="M15.999 10.136a5.857 5.857 0 1 0-11.715 0 5.857 5.857 0 0 0 11.715 0m-.928 6.628a8.26 8.26 0 1 1 1.7-1.7l5.272 5.274a.3.3 0 0 1 0 .425l-1.274 1.274a.3.3 0 0 1-.425 0z"
      />
    </svg>
  )
);
IconMagnifyingGlass24.displayName = 'IconMagnifyingGlass24';
