import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDiamondO16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M2.766 8 8 2.766 13.234 8 8 13.234zM.645 7.859a.2.2 0 0 0 0 .282l7.214 7.214a.2.2 0 0 0 .282 0l7.214-7.214a.2.2 0 0 0 0-.282L8.141.645a.2.2 0 0 0-.282 0z" />
    </svg>
  )
);
IconDiamondO16.displayName = 'IconDiamondO16';
