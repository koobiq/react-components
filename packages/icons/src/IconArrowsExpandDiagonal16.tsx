import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowsExpandDiagonal16 = forwardRef(
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
        <path d="M12.335 2.532H9.407a.2.2 0 0 1-.2-.2V1.2c0-.11.09-.2.2-.2H14.8c.11 0 .2.09.2.2v5.393a.2.2 0 0 1-.2.2h-1.132a.2.2 0 0 1-.2-.2V3.675L9.916 7.22a.2.2 0 0 1-.282 0l-.854-.855a.2.2 0 0 1 0-.283zM2.532 12.325 6.084 8.78a.2.2 0 0 1 .282 0l.855.855a.2.2 0 0 1 0 .283l-3.556 3.55h2.928c.11 0 .2.09.2.2V14.8a.2.2 0 0 1-.2.2H1.2a.2.2 0 0 1-.2-.2V9.407c0-.11.09-.2.2-.2h1.132c.11 0 .2.09.2.2z" />
      </g>
    </svg>
  )
);
IconArrowsExpandDiagonal16.displayName = 'IconArrowsExpandDiagonal16';
