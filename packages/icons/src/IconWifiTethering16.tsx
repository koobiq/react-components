import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconWifiTethering16 = forwardRef(
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
      <path d="M4.64 12.48a.206.206 0 0 0-.038-.283 5.4 5.4 0 1 1 6.795 0 .206.206 0 0 0-.037.283l.72.96a.196.196 0 0 0 .278.038 7 7 0 1 0-8.717 0c.087.069.213.05.279-.038zm6.037-1.244a.193.193 0 0 1-.277-.036l-.72-.96a.213.213 0 0 1 .035-.286 2.6 2.6 0 1 0-3.43 0 .213.213 0 0 1 .035.286l-.72.96a.193.193 0 0 1-.277.036 4.2 4.2 0 1 1 5.355 0M9.4 8a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0" />
    </svg>
  )
);
IconWifiTethering16.displayName = 'IconWifiTethering16';
