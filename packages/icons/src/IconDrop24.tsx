import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDrop24 = forwardRef(
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
        d="M12 23.25c4.35 0 7.875-3.575 7.875-7.986 0-2.171-1.26-4.38-3.463-7.33l-4.143-5.548a.335.335 0 0 0-.538 0L7.588 7.934c-2.202 2.95-3.463 5.159-3.463 7.33 0 4.41 3.526 7.986 7.875 7.986"
      />
    </svg>
  )
);
IconDrop24.displayName = 'IconDrop24';
