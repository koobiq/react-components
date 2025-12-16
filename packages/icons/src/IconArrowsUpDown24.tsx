import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowsUpDown24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="m13.208 4.279-.006 6.521a.3.3 0 0 1-.3.3h-1.799a.3.3 0 0 1-.3-.3V4.268L7.707 7.332a.3.3 0 0 1-.423 0L6.088 6.148a.294.294 0 0 1 0-.419l5.7-5.642a.3.3 0 0 1 .423 0l5.701 5.642a.294.294 0 0 1 0 .419l-1.196 1.184a.3.3 0 0 1-.423 0zM11.096 12.9a.3.3 0 0 0-.3.3l-.004 6.521-3.085-3.053a.3.3 0 0 0-.423 0l-1.196 1.184a.294.294 0 0 0 0 .419l5.7 5.642a.3.3 0 0 0 .423 0l5.701-5.642a.294.294 0 0 0 0-.419l-1.196-1.184a.3.3 0 0 0-.423 0l-3.096 3.064.004-6.532a.3.3 0 0 0-.3-.3z" />
      </g>
    </svg>
  )
);
IconArrowsUpDown24.displayName = 'IconArrowsUpDown24';
