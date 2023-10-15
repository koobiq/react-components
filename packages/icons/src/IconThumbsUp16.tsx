import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconThumbsUp16 = forwardRef(
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
        <path d="M8.847 1.563a.194.194 0 0 1 .242-.036q.236.14.466.287c.445.284.658.819.526 1.322q-.367 1.406-.732 2.812h4.44c.669 0 1.211.53 1.211 1.184v1.27q0 .245-.099.468c-.342.771-1.499 3.366-2.263 4.965-.196.41-.615.665-1.077.665H4.237V6.606c.801-.944 3.988-4.374 4.61-5.043M1 7.784C1 7.13 1.542 6.6 2.21 6.6h.816v7.9h-.815C1.542 14.5 1 13.97 1 13.316z" />
      </g>
    </svg>
  )
);
IconThumbsUp16.displayName = 'IconThumbsUp16';
