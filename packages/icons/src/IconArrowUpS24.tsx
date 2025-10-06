import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowUpS24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="m13.18 7.42 3.784 3.742a.3.3 0 0 0 .426 0l1.269-1.259a.31.31 0 0 0 0-.438l-6.446-6.377a.3.3 0 0 0-.426 0L5.34 9.465a.31.31 0 0 0 0 .438l1.269 1.259a.3.3 0 0 0 .427 0L10.77 7.47v13.228a.3.3 0 0 0 .3.302h1.809a.3.3 0 0 0 .3-.302z"
      />
    </svg>
  )
);
IconArrowUpS24.displayName = 'IconArrowUpS24';
