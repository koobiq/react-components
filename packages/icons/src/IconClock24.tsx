import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconClock24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M13.2 13.5a.3.3 0 0 0 .3-.3V6.6a.3.3 0 0 0-.3-.3h-1.8a.3.3 0 0 0-.3.3v4.5H7a.3.3 0 0 0-.3.3v1.8a.3.3 0 0 0 .3.3z" />
        <path d="M12 20.1a8.1 8.1 0 1 1 0-16.2 8.1 8.1 0 0 1 0 16.2m0 2.4c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5" />
      </g>
    </svg>
  )
);
IconClock24.displayName = 'IconClock24';
