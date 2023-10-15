import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconUser16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M10.988 4.455c0 1.908-1.278 4.083-3.027 4.083S4.934 6.363 4.934 4.455 6.289 1 7.96 1c1.671 0 3.027 1.547 3.027 3.455" />
        <path d="M7.96 9.738c1.383 0 2.467-.848 3.144-1.791a6 6 0 0 0 .407-.657l2.862 1.568c.465.255.709.775.602 1.287l-.98 4.696A.2.2 0 0 1 13.8 15H2.201a.2.2 0 0 1-.196-.16l-.98-4.695a1.19 1.19 0 0 1 .602-1.287l2.801-1.534q.177.327.39.623c.677.943 1.76 1.791 3.143 1.791" />
      </g>
    </svg>
  )
);
IconUser16.displayName = 'IconUser16';
