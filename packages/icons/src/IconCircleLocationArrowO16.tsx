import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleLocationArrowO16 = forwardRef(
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
      <g>
        <path d="M3.785 7.779a.225.225 0 0 0 .012.423l2.894.964c.067.023.12.076.143.143l.964 2.894c.066.199.345.207.423.012l2.762-6.905a.225.225 0 0 0-.293-.293z" />
        <path d="M8 13.4A5.4 5.4 0 1 1 8 2.6a5.4 5.4 0 0 1 0 10.8M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14" />
      </g>
    </svg>
  )
);
IconCircleLocationArrowO16.displayName = 'IconCircleLocationArrowO16';
