import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconUser24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M16.481 6.683c0 2.862-1.916 6.125-4.54 6.125s-4.54-3.263-4.54-6.125S9.434 1.5 11.94 1.5s4.54 2.32 4.54 5.183" />
        <path d="M11.941 14.608c2.073 0 3.7-1.273 4.715-2.687q.335-.466.61-.986l4.293 2.351a1.79 1.79 0 0 1 .904 1.931l-1.47 7.044a.3.3 0 0 1-.294.239H3.301a.3.3 0 0 1-.294-.239l-1.47-7.044a1.79 1.79 0 0 1 .904-1.93l4.201-2.302q.266.491.584.936c1.016 1.414 2.642 2.687 4.715 2.687" />
      </g>
    </svg>
  )
);
IconUser24.displayName = 'IconUser24';
