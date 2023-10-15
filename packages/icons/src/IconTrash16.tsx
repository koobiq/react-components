import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconTrash16 = forwardRef(
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
        <path d="M5 2.4A1.4 1.4 0 0 1 6.4 1h3.2A1.4 1.4 0 0 1 11 2.4h3.3c.11 0 .2.09.2.2v1.2a.2.2 0 0 1-.2.2H1.7a.2.2 0 0 1-.2-.2V2.6c0-.11.09-.2.2-.2zM13.5 5.2h-11v8.4A1.4 1.4 0 0 0 3.9 15h8.2a1.4 1.4 0 0 0 1.4-1.4zm-6.9 2v5.6a.2.2 0 0 1-.2.2h-.8a.2.2 0 0 1-.2-.2V7.2c0-.11.09-.2.2-.2h.8c.11 0 .2.09.2.2m2.8 0c0-.11.09-.2.2-.2h.8c.11 0 .2.09.2.2v5.6a.2.2 0 0 1-.2.2h-.8a.2.2 0 0 1-.2-.2z" />
      </g>
    </svg>
  )
);
IconTrash16.displayName = 'IconTrash16';
