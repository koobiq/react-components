import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDiamondHalf16 = forwardRef(
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
        d="M2.766 8 8 2.766 13.234 8zM.645 7.859a.2.2 0 0 0 0 .282l7.214 7.214a.2.2 0 0 0 .282 0l7.214-7.214a.2.2 0 0 0 0-.282L8.141.645a.2.2 0 0 0-.282 0z"
      />
    </svg>
  )
);
IconDiamondHalf16.displayName = 'IconDiamondHalf16';
