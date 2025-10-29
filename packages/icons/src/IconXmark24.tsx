import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconXmark24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M20.162 5.54a.3.3 0 0 0 0-.425l-1.277-1.277a.3.3 0 0 0-.426 0L12 10.298l-6.46-6.46a.3.3 0 0 0-.425 0L3.838 5.115a.3.3 0 0 0 0 .426L10.298 12l-6.46 6.46a.3.3 0 0 0 0 .425l1.277 1.277a.3.3 0 0 0 .426 0L12 13.702l6.46 6.46a.3.3 0 0 0 .425 0l1.277-1.277a.3.3 0 0 0 0-.426L13.702 12z" />
    </svg>
  )
);
IconXmark24.displayName = 'IconXmark24';
