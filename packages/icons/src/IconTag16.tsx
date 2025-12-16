import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconTag16 = forwardRef(
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
      <path d="M14 7.647a.2.2 0 0 1-.06.144l-6.852 6.853a1.216 1.216 0 0 1-1.72 0l-4.012-4.012a1.216 1.216 0 0 1 0-1.72L8.21 2.06A.2.2 0 0 1 8.353 2h5.444c.112 0 .203.09.203.203zM10.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
    </svg>
  )
);
IconTag16.displayName = 'IconTag16';
