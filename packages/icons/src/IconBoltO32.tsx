import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBoltO32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="m11.02 3.093 8.747.795a1 1 0 0 1 .864 1.294L18.5 12l3.643.729a1 1 0 0 1 .673 1.474L13.891 29.93a.4.4 0 0 1-.747-.23L14 19l-4.14-.828a1 1 0 0 1-.802-1.047l.874-13.103a1 1 0 0 1 1.088-.93m.84 2.084-.748 11.206 5.023 1.004-.422 5.281 4.682-8.25-4.467-.893 2.424-7.758z"
      />
    </svg>
  )
);
IconBoltO32.displayName = 'IconBoltO32';
