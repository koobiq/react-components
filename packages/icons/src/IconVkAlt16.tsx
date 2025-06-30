import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconVkAlt16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M8.715 12.992C3.248 12.992.13 9.244 0 3.008h2.738c.09 4.577 2.109 6.516 3.708 6.916V3.008h2.578v3.948c1.58-.17 3.238-1.97 3.798-3.948H15.4c-.43 2.439-2.228 4.238-3.508 4.977 1.28.6 3.329 2.169 4.108 5.007h-2.838c-.61-1.899-2.129-3.368-4.138-3.568v3.568z"
      />
    </svg>
  )
);
IconVkAlt16.displayName = 'IconVkAlt16';
