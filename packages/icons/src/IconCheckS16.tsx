import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCheckS16 = forwardRef(
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
        d="M12.938 5.887a.204.204 0 0 1 .004.288l-5.55 5.764a.2.2 0 0 1-.289 0L3.058 7.763a.204.204 0 0 1 .004-.288l.857-.83a.2.2 0 0 1 .285.004l3.043 3.15 4.549-4.738a.2.2 0 0 1 .285-.004z"
      />
    </svg>
  )
);
IconCheckS16.displayName = 'IconCheckS16';
