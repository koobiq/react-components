import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDiamond16 = forwardRef(
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
        d="M.645 8.141a.2.2 0 0 1 0-.282L7.859.645a.2.2 0 0 1 .282 0l7.214 7.214a.2.2 0 0 1 0 .282l-7.214 7.214a.2.2 0 0 1-.282 0z"
      />
    </svg>
  )
);
IconDiamond16.displayName = 'IconDiamond16';
