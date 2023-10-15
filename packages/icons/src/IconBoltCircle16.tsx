import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBoltCircle16 = forwardRef(
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
        d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14M9.677 4c.084 0 .142.082.112.158L8.496 7.5h2.884c.104 0 .158.12.089.195l-4.87 5.265c-.085.092-.239.009-.204-.11l1.057-3.6H4.62a.117.117 0 0 1-.114-.153l1.72-5.018A.12.12 0 0 1 6.338 4z"
      />
    </svg>
  )
);
IconBoltCircle16.displayName = 'IconBoltCircle16';
