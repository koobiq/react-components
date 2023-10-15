import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconLock16 = forwardRef(
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
        d="M4 7V5a4 4 0 1 1 8 0v2h.8A1.2 1.2 0 0 1 14 8.2v5.6a1.2 1.2 0 0 1-1.2 1.2H3.2A1.2 1.2 0 0 1 2 13.8V8.2A1.2 1.2 0 0 1 3.2 7zm1.6 0h4.8V5a2.4 2.4 0 0 0-4.8 0zm2.716 3.949a1 1 0 1 0-.632 0l-.64 1.92a.1.1 0 0 0 .095.131H8.86a.1.1 0 0 0 .095-.132z"
      />
    </svg>
  )
);
IconLock16.displayName = 'IconLock16';
