import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPin16 = forwardRef(
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
        d="M9.322 1.615a1.204 1.204 0 0 1 1.9-.262l3.427 3.426a1.204 1.204 0 0 1-.262 1.901L10.98 8.59c.977 1.796.64 4.175-.81 5.746a.19.19 0 0 1-.276.004l-3.557-3.542-3.457 3.457a.2.2 0 0 1-.109.056l-1.157.189a.1.1 0 0 1-.114-.114l.19-1.157a.2.2 0 0 1 .055-.109l3.457-3.457-3.544-3.555a.19.19 0 0 1 .004-.276c1.571-1.45 3.953-1.786 5.75-.81z"
      />
    </svg>
  )
);
IconPin16.displayName = 'IconPin16';
