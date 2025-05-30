import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconImage16 = forwardRef(
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
        d="M0 3.2A1.2 1.2 0 0 1 1.2 2h13.6A1.2 1.2 0 0 1 16 3.2v9.6a1.2 1.2 0 0 1-1.2 1.2H1.2A1.2 1.2 0 0 1 0 12.8zm4.5 2.05a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0m6.642.391a.2.2 0 0 0-.283 0L6 10.5 4.14 9.104a.2.2 0 0 0-.262.019L1.6 11.4v.8c0 .11.09.2.2.2h12.4a.2.2 0 0 0 .2-.2V8.9z"
      />
    </svg>
  )
);
IconImage16.displayName = 'IconImage16';
