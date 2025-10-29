import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPencil24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M18.587 2.027a1.8 1.8 0 0 0-2.544 0l-1.285 1.285 5.93 5.93 1.285-1.285a1.8 1.8 0 0 0 0-2.544zM19.416 10.515l-5.93-5.931-9.532 9.532 5.93 5.93zM1.95 22.405a.3.3 0 0 1-.355-.355l1.347-6.401 5.41 5.409z" />
      </g>
    </svg>
  )
);
IconPencil24.displayName = 'IconPencil24';
