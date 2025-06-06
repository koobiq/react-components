import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconRuler16 = forwardRef(
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
        d="M4.346 15.94a.2.2 0 0 1-.286 0l-4-4a.2.2 0 0 1 0-.286l1.285-1.286 2.357 2.357a.2.2 0 0 0 .286 0l.571-.571a.2.2 0 0 0 0-.286L2.202 9.511l1.865-1.865L5.71 9.29a.2.2 0 0 0 .285 0l.572-.572a.2.2 0 0 0 0-.285L4.924 6.789 6.79 4.924l2.357 2.357a.2.2 0 0 0 .286 0l.571-.571a.2.2 0 0 0 0-.286L7.646 4.067l1.865-1.865 1.643 1.643a.2.2 0 0 0 .285 0l.572-.572a.2.2 0 0 0 0-.285l-1.643-1.643L11.654.06a.2.2 0 0 1 .286 0l4 4.001a.2.2 0 0 1 0 .286z"
      />
    </svg>
  )
);
IconRuler16.displayName = 'IconRuler16';
