import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPulse16 = forwardRef(
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
        d="M7.96.558c.03-.097.168-.094.193.004l2.41 9.395.799-2.651a.2.2 0 0 1 .192-.142H15.8c.11 0 .2.089.2.199v1.193a.2.2 0 0 1-.2.2h-3.205l-2.054 7.16c-.029.097-.167.094-.193-.004L7.937 6.155l-2.278 7.522a.1.1 0 0 1-.19.005L3.384 7.982l-.334.664a.2.2 0 0 1-.18.11H.2a.2.2 0 0 1-.2-.199V7.363a.2.2 0 0 1 .2-.2h1.806l1.506-2.996a.1.1 0 0 1 .184.01l1.733 4.74z"
      />
    </svg>
  )
);
IconPulse16.displayName = 'IconPulse16';
